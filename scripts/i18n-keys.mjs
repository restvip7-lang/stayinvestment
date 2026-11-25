// Список фраз для перевода: все tr('…'), t(lang, '…'), T('…') в коде + тексты из данных (меню, пакеты, подписи).
// Запуск: node scripts/i18n-keys.mjs  → печатает, сколько фраз без перевода в en.json / sr.json;
//         node scripts/i18n-keys.mjs --missing en > missing.json — недостающие фразы.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(ROOT + 'src').filter((f) => /\.(astro|ts)$/.test(f) && !f.includes('/i18n/') && !f.includes('package-texts'));
const keys = new Set();
const STR = String.raw`("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')`;
const re = new RegExp(String.raw`(?:\btr|\bT|\bt\(lang,|\bt\(\w+,)\s*\(?\s*${STR}`, 'g');
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(re)) {
    let k;
    try { k = JSON.parse(m[1].startsWith("'") ? '"' + m[1].slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"') + '"' : m[1]); } catch { continue; }
    if (/[а-яё]/i.test(k)) keys.add(k);
  }
}
// Данные, которые переводятся при выводе: меню, команда, цифры, пакеты, подписи показателей
const site = readFileSync(ROOT + 'src/lib/site.ts', 'utf8');
for (const m of site.matchAll(/(?:label|note|role|name): '([^']*[а-яё][^']*)'/gi)) keys.add(m[1]);
keys.add(/DISCLAIMER =\s*'([^']+)'/.exec(site)[1]);
const cat = readFileSync(ROOT + 'src/lib/catalog.ts', 'utf8');
for (const m of cat.matchAll(/(?:name|tagline|text|seoTitle|seoDescription): '([^']*[а-яё][^']*)'/gi)) keys.add(m[1]);
for (const m of cat.matchAll(/^\s+'[^']+': '([^']+)',$/gm)) keys.add(m[1]);
// Подписи из объектов: тип, единицы, города и районы, инфраструктура (если у объекта нет своей)
for (const f of readdirSync(ROOT + 'src/content/objects')) {
  const o = JSON.parse(readFileSync(ROOT + 'src/content/objects/' + f, 'utf8'));
  if (o.type) keys.add(o.type);
  for (const m of o.metrics) if (m.unit && /[а-яё]/i.test(m.unit)) keys.add(m.unit.replace(/^шт\.?$/, 'шт.').replace(/^мес\.?$/, 'мес.'));
  const parts = (o.location ?? '').split(/\s+/).filter(Boolean);
  keys.add(parts[0] === 'Алания' ? 'Аланья' : parts[0]);
  if (parts.length > 1) keys.add(parts.slice(1).join(' '));
  for (const lang of ['en', 'sr']) if (!o.i18n?.[lang]?.infrastructure?.length) o.infrastructure.forEach((x) => keys.add(x));
}
keys.delete(undefined); keys.delete('');
const arg = process.argv.indexOf('--missing');
if (arg > 0) {
  const lang = process.argv[arg + 1];
  const dict = JSON.parse(readFileSync(ROOT + `src/i18n/${lang}.json`, 'utf8'));
  console.log(JSON.stringify([...keys].filter((k) => !dict[k]), null, 1));
} else {
  for (const lang of ['en', 'sr']) {
    const dict = JSON.parse(readFileSync(ROOT + `src/i18n/${lang}.json`, 'utf8'));
    console.log(`${lang}: фраз ${keys.size}, без перевода ${[...keys].filter((k) => !dict[k]).length}`);
  }
}
