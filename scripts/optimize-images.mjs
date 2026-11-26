#!/usr/bin/env node
/**
 * Оптимизация картинок сайта. Все фото отдаются из public/media в формате WebP в четырёх размерах:
 *   <id>.webp (до 1600 px), <id>-960.webp, <id>-480.webp, <id>-240.webp — браузер берёт подходящий под экран.
 *
 * Что делает:
 * 1. Свои картинки из public/images (фото команды, страниц, обложки архивных статей) сжимает в public/media.
 *    id — хеш содержимого файла: заменили фото — получился новый адрес, старый кэш не мешает.
 *    В коде и контенте по-прежнему пишем исходный путь (/images/team/halil.jpg) — src/lib/img.ts подставит сжатую версию.
 * 2. Фото, перенесённым с внешних сайтов (scripts/localize-media.mjs), дописывает недостающий размер 240 px.
 * 3. Пишет src/content/media-manifest.json: какие размеры есть у каждой картинки и её высоту.
 *
 * Запуск: npm run optimize-images (сети не нужно; повторный запуск пропускает готовое).
 * Не трогает og.jpg и логотип: их читают соцсети и поисковики, им нужен JPG/PNG.
 */
import { readFile, writeFile, readdir, mkdir, access, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'public/images');
const OUT = path.join(ROOT, 'public/media');
const MANIFEST = path.join(ROOT, 'src/content/media-manifest.json');
const SKIP = new Set(['/images/site/og.jpg', '/images/site/logo-old.png']);
const SIZES = [
  { w: 240, suffix: '-240', q: 68 },
  { w: 480, suffix: '-480', q: 70 },
  { w: 960, suffix: '-960', q: 72 },
  { w: 1600, suffix: '', q: 74 },
];

const exists = (p) => access(p).then(() => true, () => false);
const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])))).flat();

await mkdir(OUT, { recursive: true });
const local = {};
let made = 0;

// 1. Свои картинки → public/media
for (const file of (await walk(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
  const rel = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');
  if (SKIP.has(rel)) continue;
  const buf = await readFile(file);
  const id = createHash('sha1').update(buf).digest('hex').slice(0, 16);
  local[rel] = id;
  for (const s of SIZES) {
    const out = path.join(OUT, `${id}${s.suffix}.webp`);
    if (await exists(out)) continue;
    await sharp(buf, { failOn: 'none' }).rotate().resize({ width: s.w, withoutEnlargement: true }).webp({ quality: s.q, effort: 5 }).toFile(out);
    made++;
  }
}

// 2. Размер 240 px для фото, перенесённых с внешних сайтов (делаем из 480 — для миниатюр разницы не видно)
const ids = [...new Set((await readdir(OUT)).filter((f) => f.endsWith('.webp')).map((f) => f.replace(/(-\d+)?\.webp$/, '')))].sort();
for (const id of ids) {
  const small = path.join(OUT, `${id}-240.webp`);
  if (await exists(small)) continue;
  const from = (await exists(path.join(OUT, `${id}-480.webp`))) ? path.join(OUT, `${id}-480.webp`) : path.join(OUT, `${id}.webp`);
  await sharp(from).resize({ width: 240, withoutEnlargement: true }).webp({ quality: 68, effort: 5 }).toFile(small);
  made++;
}

// 3. Манифест: фактическая ширина каждого размера и высота самого большого
const sizes = {};
let bytes = 0;
for (const id of ids) {
  const row = [];
  for (const s of SIZES) {
    const f = path.join(OUT, `${id}${s.suffix}.webp`);
    if (!(await exists(f))) { row.push(0); continue; }
    const m = await sharp(f).metadata();
    row.push(m.width);
    if (s.suffix === '') row.push(m.height);
    bytes += (await stat(f)).size;
  }
  sizes[id] = row; // [w240, w480, w960, wFull, hFull]
}
await writeFile(MANIFEST, JSON.stringify({ local, sizes }) + '\n');
console.log(`Картинок: ${ids.length} (своих из public/images: ${Object.keys(local).length}), новых файлов: ${made}, всего в public/media: ${(bytes / 1048576).toFixed(0)} МБ`);
