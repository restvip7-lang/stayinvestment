// Английские и сербские версии объектов и старых статей со старого сайта stayinvestment.com.
// Запуск: npm run import-legacy-i18n  (после import-legacy; нужен доступ к stayinvestment.com)
//
// Для каждой русской карточки/статьи берём ссылки hreflang="en" / "sr" со старой страницы,
// скачиваем перевод и кладём его в тот же JSON в поле i18n: { en: {...}, sr: {...} }.
// Старые английские/сербские адреса → новые (/en/…, /sr/…) — в src/content/legacy-redirects-i18n.json.
// Цифры, фото и ID берутся из русской версии: переводы на старом сайте — только тексты.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { SITE, sleep, get, text, cleanHtml, meta } from './legacy-lib.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const LANGS = ['en', 'sr'];

const alternates = (html) => Object.fromEntries(
  [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="(en|sr)"[^>]+href="([^"]+)"/g)].map((m) => [m[1], m[2].replace(SITE, '')]),
);

/** Текст карточки объекта на любом языке (разметка та же, что у русской). */
function parseObject(html) {
  const title = text(/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? '');
  const id = /class="id-label">\s*ID:\s*([A-Z]{2}\d+)/.exec(html)?.[1] ?? null;
  const chars = {};
  const charsBlock = /<div class="main-chars">([\s\S]*?)<\/div>/.exec(html)?.[1] ?? '';
  for (const m of charsBlock.matchAll(/<p><b>([^<]+):<\/b>([\s\S]*?)<\/p>/g)) chars[text(m[1])] = text(m[2]).replace(/,\s*$/, '');
  const pick = (re) => Object.entries(chars).find(([k]) => re.test(k))?.[1] ?? null;
  const desc = /<div class="description"\s*>([\s\S]*?)<\/article>/.exec(html)?.[1] ?? '';
  const infrastructure = [...(/<div class="chars">([\s\S]*?)<\/div>/.exec(desc)?.[1] ?? '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => text(m[1])).filter(Boolean);
  const descriptionHtml = cleanHtml(desc.replace(/<div class="metres">[\s\S]*?<\/div>/, '').replace(/<div class="main-block__title">[\s\S]*?<\/div>/, '').replace(/<div class="chars">[\s\S]*?<\/div>/, ''));
  return {
    id,
    title,
    location: pick(/^(location|lokacija|lokacija objekta|mesto)/i),
    type: pick(/^(type|tip)/i),
    infrastructure,
    descriptionHtml,
  };
}

function parseNews(html) {
  const title = text(/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? '');
  let body = html.slice(html.indexOf('news-detail-text'));
  body = body.slice(body.indexOf('>') + 1);
  const cut = [body.search(/<!--\s*(BEGIN )?FORM/i), body.indexOf('<!--/LEFT BLOCK'), body.indexOf('wpcf7')].filter((x) => x > 0);
  body = body.slice(0, Math.min(...cut));
  return {
    title,
    seoTitle: (/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] && text(/<title>([\s\S]*?)<\/title>/i.exec(html)[1])) || null,
    seoDescription: meta(html, 'description'),
    contentHtml: cleanHtml(body),
  };
}

/** Перевод «настоящий», а не копия русского текста (на старом сайте бывали непереведённые страницы). */
const isTranslated = (s) => !!s && !/[а-яё]{4,}/i.test(s);

const redirects = {};
const stats = { objects: { en: 0, sr: 0 }, news: { en: 0, sr: 0 } };

async function run(dir, kind, parse, toPath, fields) {
  for (const f of (await readdir(ROOT + dir)).filter((x) => x.endsWith('.json'))) {
    const file = ROOT + dir + f;
    const item = JSON.parse(await readFile(file, 'utf8'));
    const ru = await get(SITE + item.legacyPath);
    if (!ru) continue;
    const alt = alternates(ru);
    item.i18n = item.i18n ?? {};
    for (const lang of LANGS) {
      const path = alt[lang];
      if (!path || /^\/?$/.test(path.replace(/^\/(en|sr)/, ''))) continue;
      const html = await get(SITE + path);
      if (!html) continue;
      const t = parse(html);
      if (kind === 'objects' && t.id && t.id !== item.id) continue; // чужая карточка
      if (!isTranslated(t.title)) continue;
      item.i18n[lang] = { legacyPath: path, ...Object.fromEntries(fields.map((k) => [k, t[k]])) };
      redirects[path] = `/${lang}${toPath(item)}`;
      stats[kind][lang]++;
      await sleep(120);
    }
    await writeFile(file, JSON.stringify(item, null, 2) + '\n');
  }
}

await run('src/content/objects/', 'objects', parseObject, (o) => `/investment-directory/${o.package}/${o.slug}/`, ['title', 'location', 'type', 'infrastructure', 'descriptionHtml']);
await run('src/content/legacy-news/', 'news', parseNews, (n) => `/news/${n.slug}/`, ['title', 'seoTitle', 'seoDescription', 'contentHtml']);

// Второй проход: переводы, которые на старом сайте не связаны с русской версией (сломанные hreflang).
// Объекты сопоставляем по ID карточки, статьи — по файлу обложки.
const sitemapUrls = [];
for (const sm of ['sitemap.xml', 'post-sitemap.xml', 'page-sitemap.xml']) {
  const xml = (await get(`${SITE}/${sm}`)) ?? '';
  sitemapUrls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '')));
}
const urls = [...new Set(sitemapUrls)];
const coverName = (u) => (u ?? '').split('/').pop().replace(/[^\w.-]/g, '_').replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/-scaled(?=\.\w+$)/, '');

async function second(dir, kind, re, matchKey, parse, toPath, fields) {
  const files = (await readdir(ROOT + dir)).filter((x) => x.endsWith('.json'));
  const items = await Promise.all(files.map(async (f) => ({ file: ROOT + dir + f, item: JSON.parse(await readFile(ROOT + dir + f, 'utf8')) })));
  const known = new Set(items.flatMap(({ item }) => Object.values(item.i18n ?? {}).map((x) => x.legacyPath)));
  for (const path of urls.filter((u) => re.test(u) && !known.has(u))) {
    const lang = path.split('/')[1];
    const html = await get(SITE + path);
    if (!html) continue;
    const t = parse(html);
    if (!isTranslated(t.title)) continue;
    const key = matchKey(html, t);
    const hit = key && items.find(({ item }) => kind === 'objects' ? item.id === key : coverName(item.image) === key);
    if (!hit || hit.item.i18n?.[lang]) { await sleep(80); continue; }
    hit.item.i18n = hit.item.i18n ?? {};
    hit.item.i18n[lang] = { legacyPath: path, ...Object.fromEntries(fields.map((k) => [k, t[k]])) };
    redirects[path] = `/${lang}${toPath(hit.item)}`;
    stats[kind][lang]++;
    await writeFile(hit.file, JSON.stringify(hit.item, null, 2) + '\n');
    await sleep(120);
  }
}
await second('src/content/objects/', 'objects', /^\/(en|sr)\/investment-directory\/.+\/$/, (_, t) => t.id, parseObject, (o) => `/investment-directory/${o.package}/${o.slug}/`, ['title', 'location', 'type', 'infrastructure', 'descriptionHtml']);
await second('src/content/legacy-news/', 'news', /^\/(en|sr)\/news-en\/[^/?]+\/$/, (html) => coverName(meta(html, 'og:image')), parseNews, (n) => `/news/${n.slug}/`, ['title', 'seoTitle', 'seoDescription', 'contentHtml']);

await writeFile(ROOT + 'src/content/legacy-redirects-i18n.json', JSON.stringify(redirects, null, 2) + '\n');
console.log(`Объекты: en ${stats.objects.en}, sr ${stats.objects.sr}; статьи: en ${stats.news.en}, sr ${stats.news.sr}; редиректов: ${Object.keys(redirects).length}`);
