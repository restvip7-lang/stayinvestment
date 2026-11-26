#!/usr/bin/env node
/**
 * Переносит внешние картинки к себе, чтобы сайт не зависел от старого сервера и CDN Битрикс24.
 *
 * Что делает:
 * 1. Ищет в src/content/objects/*.json и src/content/legacy-news/*.json ссылки на картинки
 *    с cdn-ru.bitrix24.ru и stayinvestment.com/wp-content/uploads.
 * 2. Скачивает каждую и сохраняет в public/media/ в формате WebP: <id>.webp (до 1600 px), <id>-960.webp, <id>-480.webp.
 *    id — хеш исходной ссылки. Размер 240 px и манифест дописывает scripts/optimize-images.mjs (npm run localize-media запускает оба).
 * 3. Заменяет ссылки в JSON на /media/<id>.webp.
 * 4. Пишет соответствие «исходная ссылка → файл» в src/content/media-map.json (чтобы всегда знать, откуда фото).
 *
 * Повторный запуск безопасен: уже скачанные файлы пропускаются, не скачавшиеся ссылки остаются как были.
 * Запуск: npm run localize-media   (нужен доступ в интернет к этим хостам)
 */
import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'public/media');
const MAP = path.join(ROOT, 'src/content/media-map.json');
const DIRS = ['src/content/objects', 'src/content/legacy-news'];
// Ссылки на картинки: Битрикс24 (без расширения, в именах бывают пробелы) и загрузки WordPress старого сайта.
const RE = /https?:\/\/(?:cdn-ru\.bitrix24\.ru\/[^"'\n\\<>)]+|(?:www\.)?stayinvestment\.com\/wp-content\/uploads\/[^"'\s\\<>)]+?\.(?:jpe?g|png|gif|webp))/gi;
const SIZES = [
  { w: 1600, suffix: '', q: 74 },
  { w: 960, suffix: '-960', q: 72 },
  { w: 480, suffix: '-480', q: 70 },
];
const CONCURRENCY = 6;

const exists = (p) => access(p).then(() => true, () => false);
const idOf = (url) => createHash('sha1').update(url).digest('hex').slice(0, 16);

async function download(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url.replace(/ /g, '%20'), { headers: { 'user-agent': 'Mozilla/5.0 (media backup)' }, signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

async function save(url) {
  const id = idOf(url);
  const local = `/media/${id}.webp`;
  const files = SIZES.map((s) => path.join(OUT, `${id}${s.suffix}.webp`));
  if ((await Promise.all(files.map(exists))).every(Boolean)) return local;
  const buf = await download(url);
  for (const [i, s] of SIZES.entries()) {
    await sharp(buf, { failOn: 'none' }).rotate().resize({ width: s.w, withoutEnlargement: true }).webp({ quality: s.q, effort: 5 }).toFile(files[i]);
  }
  return local;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const map = (await exists(MAP)) ? JSON.parse(await readFile(MAP, 'utf8')) : {};
  const files = [];
  for (const d of DIRS) {
    for (const f of await readdir(path.join(ROOT, d))) if (f.endsWith('.json')) files.push(path.join(ROOT, d, f));
  }
  const texts = new Map(await Promise.all(files.map(async (f) => [f, await readFile(f, 'utf8')])));
  const urls = [...new Set([...texts.values()].flatMap((t) => t.match(RE) ?? []))];
  console.log(`Внешних картинок: ${urls.length}`);

  const failed = [];
  let done = 0;
  const queue = [...urls];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    for (let url; (url = queue.shift()); ) {
      try { map[url] = await save(url); } catch (e) { failed.push(`${url} — ${e.message}`); }
      if (++done % 25 === 0) console.log(`  ${done}/${urls.length}`);
    }
  }));

  let changed = 0;
  for (const [f, t] of texts) {
    const next = t.replace(RE, (u) => map[u] ?? u);
    if (next !== t) { await writeFile(f, next); changed++; }
  }
  const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MAP, JSON.stringify(sorted, null, 2) + '\n');

  console.log(`Готово: сохранено ${urls.length - failed.length}, файлов с контентом обновлено ${changed}.`);
  if (failed.length) {
    console.log(`Не скачались (${failed.length}) — ссылки оставлены как были:`);
    for (const x of failed) console.log('  ' + x);
    process.exitCode = 2;
  }
}

main();
