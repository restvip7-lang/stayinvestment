#!/usr/bin/env node
/**
 * Долгий кэш для картинок и шрифтов на Vercel. Запускается после сборки (npm run build).
 *
 * Сборка под Vercel кладёт правила в .vercel/output/config.json; для /_astro Astro сам ставит кэш на год,
 * а файлы из public по умолчанию перепроверяются при каждом заходе. Здесь добавляем:
 *   /media/…  — год, immutable: имя файла — хеш содержимого или исходной ссылки, под тем же именем картинка не меняется;
 *   /fonts/…  — год, immutable;
 *   /images/… — сутки + ещё неделю можно показывать старую, пока в фоне проверяется новая (og.jpg, логотип).
 * На своём сервере те же заголовки ставит nginx — deploy/nginx-plesk.conf.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../.vercel/output/config.json', import.meta.url);
const RULES = [
  { src: '^/media/(.*)$', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
  { src: '^/fonts/(.*)$', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
  { src: '^/images/(.*)$', headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' }, continue: true },
];

let config;
try { config = JSON.parse(await readFile(FILE, 'utf8')); } catch { process.exit(0); } // сборка не под Vercel — делать нечего
const routes = (config.routes ?? []).filter((r) => !RULES.some((x) => x.src === r.src));
config.routes = [...RULES, ...routes];
await writeFile(FILE, JSON.stringify(config, null, 2));
console.log('Кэш картинок и шрифтов: правила добавлены в .vercel/output/config.json');
