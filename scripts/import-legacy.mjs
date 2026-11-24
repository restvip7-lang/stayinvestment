// Импорт контента со старого сайта stayinvestment.com (WordPress) в src/content.
// Запуск: npm run import-legacy  (нужен доступ к stayinvestment.com)
//  - объекты каталога → src/content/objects/<slug>.json
//  - старые новости   → src/content/legacy-news/<slug>.json (+ обложки в public/images/news/)
//  - карта переездов  → src/content/legacy-redirects.json
// Пакет объекта определяется по префиксу ID (RP — Рантье, DP — Стартовый, PP — Партнерский):
// на старом сайте часть объектов лежит не в своём разделе.

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { SITE, sleep, get, decode, text, num, cleanHtml, meta } from './legacy-lib.mjs';
const ROOT = new URL('..', import.meta.url).pathname;
const OUT_OBJ = ROOT + 'src/content/objects/';
const OUT_NEWS = ROOT + 'src/content/legacy-news/';
const OUT_IMG = ROOT + 'public/images/news/';
const PACKAGE_BY_PREFIX = { RP: 'rental', DP: 'startovye', PP: 'partnerskye' };

/** Опечатки старого сайта, найденные проверкой hunspell (docs/content-audit.md). */
const TYPOS = [
  [/у бассена/g, 'у бассейна'],
  [/курсируетобщественный/g, 'курсирует общественный'],
  [/шоппинг/g, 'шопинг'],
  [/бизнес-зони/g, 'бизнес-зоны'],
  [/развитой части Алань —/g, 'развитой части Аланьи —'],
  [/5-ти звездочн/g, 'пятизвёздочн'],
  [/([а-яё])([.,;:])([А-ЯЁ])/g, '$1$2 $3'], // пропущенный пробел после знака препинания
];
const fixTypos = (s) => TYPOS.reduce((acc, [re, to]) => acc.replace(re, to), s);

/* ---------- Объекты ---------- */
function parseObject(html, path) {
  const title = text(/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? '').replace(/Тwins/g, 'Twins'); // кириллическая «Т» в латинском названии
  const id = /class="id-label">\s*ID:\s*([A-Z]{2}\d+)/.exec(html)?.[1] ?? null;
  if (!title || !id) return null;
  const gallery = html.slice(html.indexOf('main-gallery__list'), html.indexOf('thumbs-gallery'));
  const images = [...new Set([...gallery.matchAll(/data-src="(https?:[^"]+)"/g)].map((m) => m[1]))];
  const chars = {};
  const charsBlock = /<div class="main-chars">([\s\S]*?)<\/div>/.exec(html)?.[1] ?? '';
  for (const m of charsBlock.matchAll(/<p><b>([^<]+):<\/b>([\s\S]*?)<\/p>/g)) chars[text(m[1])] = text(m[2]).replace(/,\s*$/, '');
  const infoBlock = html.slice(html.indexOf('main-info js-timers'), html.indexOf('card-info__buttons') > 0 ? html.indexOf('card-info__buttons') : html.indexOf('Заказать инфо тур'));
  const metrics = [...infoBlock.matchAll(/main-info__text">([\s\S]*?)<\/span>[\s\S]*?data-to="([^"]*)"[\s\S]*?main-info__val">([\s\S]*?)<\/span>/g)].map((m) => ({
    label: text(m[1]),
    value: num(m[2]),
    unit: text(m[3]) || null,
  }));
  const desc = /<div class="description"\s*>([\s\S]*?)<\/article>/.exec(html)?.[1] ?? '';
  const infrastructure = [...(/<div class="chars">([\s\S]*?)<\/div>/.exec(desc)?.[1] ?? '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => text(m[1])).filter(Boolean);
  const descriptionHtml = cleanHtml(desc.replace(/<div class="metres">[\s\S]*?<\/div>/, '').replace(/<div class="main-block__title">[\s\S]*?<\/div>/, '').replace(/<div class="chars">[\s\S]*?<\/div>/, ''));
  const video = /youtube\.com\/embed\/([\w-]{6,})/.exec(html)?.[1] ?? null;
  const prefix = id.slice(0, 2);
  const pkg = PACKAGE_BY_PREFIX[prefix] ?? path.split('/')[2];
  const slug = path.split('/').filter(Boolean).pop();
  return {
    id,
    package: pkg,
    slug,
    legacyPath: path,
    title,
    location: chars['Расположение'] ?? null,
    type: chars['Тип'] ?? null,
    layouts: chars['Планировка'] ? chars['Планировка'].split(/,\s*/).filter(Boolean) : [],
    seaDistance: chars['Расстояние до моря'] ? num(chars['Расстояние до моря'].replace(/[^\d.,]/g, '')) : null,
    year: chars['Год'] ? num(chars['Год']) : null,
    metrics,
    infrastructure: infrastructure.map(fixTypos),
    descriptionHtml: fixTypos(descriptionHtml),
    images,
    video,
  };
}

/* ---------- Новости ---------- */
function parseNews(html, path) {
  const title = text(/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? '');
  if (!title) return null;
  let body = html.slice(html.indexOf('news-detail-text'));
  body = body.slice(body.indexOf('>') + 1);
  const cut = [body.search(/<!--\s*(BEGIN )?FORM/i), body.indexOf('<!--/LEFT BLOCK'), body.indexOf('wpcf7')].filter((x) => x > 0);
  body = body.slice(0, Math.min(...cut));
  return {
    slug: path.split('/').filter(Boolean).pop(),
    legacyPath: path,
    title,
    seoTitle: (/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] && text(/<title>([\s\S]*?)<\/title>/i.exec(html)[1])) || null,
    seoDescription: meta(html, 'description'),
    publishedAt: meta(html, 'article:published_time'),
    updatedAt: meta(html, 'article:modified_time'),
    image: meta(html, 'og:image'),
    contentHtml: cleanHtml(body),
  };
}

/* ---------- Запуск ---------- */
const sitemap = await get(`${SITE}/sitemap.xml`);
const posts = await get(`${SITE}/post-sitemap.xml`);
const urls = [...new Set([...`${sitemap}${posts}`.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '')))];
const objectPaths = urls.filter((u) => /^\/investment-directory\/(rental|startovye|partnerskye)\/[^/]+\/$/.test(u));
const newsPaths = urls.filter((u) => /^\/news\/[^/?]+\/$/.test(u));

await rm(OUT_OBJ, { recursive: true, force: true });
await rm(OUT_NEWS, { recursive: true, force: true });
for (const d of [OUT_OBJ, OUT_NEWS, OUT_IMG]) await mkdir(d, { recursive: true });

const redirects = {};
const byId = new Map();
const idByPath = {};
let missing = 0;
for (const p of objectPaths) {
  const html = await get(SITE + p);
  if (!html) { missing++; redirects[p] = `/investment-directory/${p.split('/')[2]}/`; continue; }
  const o = parseObject(html, p);
  if (!o) { missing++; continue; }
  idByPath[p] = o.id;
  // Дубли на другом языке (сербский текст в русском разделе) — пропускаем, ведём на русскую карточку.
  if (!/[а-яё]/i.test(o.title)) { o.skip = 'not-ru'; }
  const prev = byId.get(o.id);
  const fits = (x) => x.legacyPath.split('/')[2] === x.package;
  if (!o.skip && (!prev || prev.skip || (!fits(prev) && fits(o)))) byId.set(o.id, o);
  else if (!prev) byId.set(o.id, o);
  await sleep(150);
}
const objects = [...byId.values()].filter((o) => !o.skip);
for (const o of objects) {
  const path = `/investment-directory/${o.package}/${o.slug}/`;
  if (path !== o.legacyPath) redirects[o.legacyPath] = path;
  await writeFile(OUT_OBJ + `${o.slug}.json`, JSON.stringify(o, null, 2) + '\n');
}
// Все прочие старые пути (дубли, сербские версии в русских разделах) → карточка того же ID.
for (const p of objectPaths) {
  if (objects.some((o) => o.legacyPath === p) || redirects[p]) continue;
  const same = objects.find((o) => o.id === idByPath[p]);
  redirects[p] = same ? `/investment-directory/${same.package}/${same.slug}/` : `/investment-directory/${p.split('/')[2]}/`;
}

let newsCount = 0;
for (const p of newsPaths) {
  const html = await get(SITE + p);
  if (!html) { redirects[p] = '/news/'; continue; }
  const n = parseNews(html, p);
  if (!n) continue;
  if (n.image && n.image.startsWith(SITE)) {
    const file = n.image.split('/').pop().replace(/[^\w.-]/g, '_');
    if (!existsSync(OUT_IMG + file)) {
      const buf = await get(n.image, true).catch(() => null);
      if (buf) await writeFile(OUT_IMG + file, buf);
    }
    if (existsSync(OUT_IMG + file)) n.image = `/images/news/${file}`;
  }
  await writeFile(OUT_NEWS + `${n.slug}.json`, JSON.stringify(n, null, 2) + '\n');
  newsCount++;
  await sleep(150);
}

await writeFile(ROOT + 'src/content/legacy-redirects.json', JSON.stringify(redirects, null, 2) + '\n');
const count = (pkg) => objects.filter((o) => o.package === pkg).length;
console.log(`Объекты: ${objects.length} (Рантье ${count('rental')}, Стартовый ${count('startovye')}, Партнерский ${count('partnerskye')}); 404/пустые: ${missing}`);
console.log(`Новости: ${newsCount}; редиректов: ${Object.keys(redirects).length}`);
