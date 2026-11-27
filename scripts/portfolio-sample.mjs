#!/usr/bin/env node
/**
 * Пробная выгрузка инвестиционных объектов из API «Портфолио» Stay Property (https://adminer.stayproperty.com/ws/;
 * прежний адрес portfolio.stayrepo.com устарел). Другой адрес можно задать переменной STAY_PORTFOLIO_BASE.
 * Проверяет доступ и кладёт несколько объектов каждого пакета в src/content/fixtures/portfolio-sample.json.
 * Сайт этот файл пока не использует — каталог по-прежнему в src/content/objects (см. README, «Откуда берутся данные»).
 *
 * Запуск: npm run portfolio-sample            — по 2 объекта на пакет
 *         npm run portfolio-sample -- 5       — по 5
 * Нужны переменные окружения (в git не хранятся): STAY_USERNAME, STAY_PASSWORD, STAY_TOKEN.
 *
 * Как устроен API: вход POST /login/auth (сессия в cookie) + заголовок Authorization: Bearer <токен>;
 * список — POST /objects/query с фильтром по таксономии; объект целиком — GET /objects/get/{ID}.
 * Инвестиционные объекты помечены таксономией package_type (id 11): 169 Рантье, 170 Стартовый,
 * 171 Партнерский, 172 Инвестиции в бизнес.
 */
import { writeFile, mkdir } from 'node:fs/promises';

const BASE = (process.env.STAY_PORTFOLIO_BASE ?? 'https://adminer.stayproperty.com/ws').replace(/\/$/, '');
const PER_PACKAGE = Number(process.argv[2]) || 2;
const PACKAGES = { 169: 'rental', 170: 'startovye', 171: 'partnerskye', 172: 'biznes-investitsii' };
const TAX = { type: '1', location: '2', amenities: '3', currency: '4', package: '11', layouts: '15', offer: '16' };
const LANGS = ['ru', 'en', 'sr', 'tr'];

const jar = new Map();
const headers = (extra = {}) => ({
  accept: 'application/json',
  ...(process.env.STAY_TOKEN ? { authorization: `Bearer ${process.env.STAY_TOKEN}` } : {}),
  ...(jar.size ? { cookie: [...jar].map(([k, v]) => `${k}=${v}`).join('; ') } : {}),
  ...extra,
});

async function call(path, init = {}) {
  const res = await fetch(BASE + path, { ...init, headers: headers(init.headers), signal: AbortSignal.timeout(30_000) });
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`${path}: ответ не JSON (HTTP ${res.status})`); }
  if (!res.ok || Number(data.status) !== 200) throw new Error(`${path}: HTTP ${res.status}, ${data.messageText ?? ''}`);
  return data.result;
}

const { STAY_USERNAME: username, STAY_PASSWORD: password } = process.env;
if (!username || !password) {
  console.error('Не заданы STAY_USERNAME / STAY_PASSWORD — доступ к Portfolio API не проверить.');
  process.exit(1);
}
await call('/login/auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username, password }) });
console.log('Вход в Portfolio API: OK');

const query = (termId, perPage) =>
  call('/objects/query', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      language: 'ru', order: 'DESC', orderby: 'modified', page: 1, paged_options: { results_per_page: perPage },
      tax_query: { 0: { taxonomy: TAX.package, field: 'term_id', terms: String(termId), operator: 'IN' } },
    }),
  });

const tr = (t, lang) => (t.translation && typeof t.translation === 'object' ? t.translation[lang] : null) || (lang === 'en' ? t.name : null);
const names = (terms, lang) => (terms ?? []).map((t) => tr(t, lang)).filter(Boolean);
const num = (v) => (v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v));
const byLang = (f) => Object.fromEntries(LANGS.map((l) => [l, f(l)]));

function normalize(o, pkg) {
  const m = o.post_meta ?? {};
  const t = o.post_terms ?? {};
  // Локация — цепочка «страна → город → район»: сортируем по вложенности
  const loc = [...(t[TAX.location] ?? [])];
  const depth = (x) => { let d = 0, p = x.parent; while (p) { d++; p = loc.find((y) => y.term_id === p)?.parent ?? 0; } return d; };
  loc.sort((a, b) => depth(a) - depth(b));
  return {
    id: m.refno || String(o.ID),
    portfolioId: o.ID,
    slug: o.post_name,
    package: pkg,
    title: byLang((l) => (o.i18n?.post_title?.[l] ?? '').trim() || null),
    descriptionHtml: byLang((l) => (o.i18n?.post_content?.[l] ?? '').trim() || null),
    location: byLang((l) => names(loc, l)),
    type: byLang((l) => names(t[TAX.type], l)),
    layouts: (t[TAX.layouts] ?? []).map((x) => x.name),
    amenities: byLang((l) => names(t[TAX.amenities], l)),
    seaDistance: num(m.distance_sea),
    yearBuilt: num(m.year_built),
    price: num(m.sales_cost) || null,
    currency: t[TAX.currency]?.[0]?.name ?? null,
    discountRate: num(m.discount_rate),
    images: (m.object_gallery ?? []).map((u) => u.replace(/([^:])\/\//g, '$1/')),
    updated: o.post_modified,
  };
}

const sample = [];
const totals = {};
for (const [termId, pkg] of Object.entries(PACKAGES)) {
  const list = await query(termId, PER_PACKAGE);
  totals[pkg] = list.total_results;
  for (const short of list.objects ?? []) {
    const full = await call(`/objects/get/${short.ID}?i18n=true&object_meta=true&featured_image=large&gallery_images=large&object_terms=${Object.values(TAX).join(',')}`);
    sample.push(normalize(full, pkg));
  }
}

await mkdir(new URL('../src/content/fixtures/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/content/fixtures/portfolio-sample.json', import.meta.url), JSON.stringify({ fetchedAt: new Date().toISOString(), totals, objects: sample }, null, 2) + '\n');
console.log('Инвестиционных объектов в Portfolio по пакетам:', totals);
for (const o of sample) console.log(`  ${o.package.padEnd(18)} ${String(o.id).padEnd(6)} ${o.title.ru} — фото: ${o.images.length}, языки: ${LANGS.filter((l) => o.title[l]).join('/')}`);
console.log(`Сохранено объектов: ${sample.length} → src/content/fixtures/portfolio-sample.json`);
