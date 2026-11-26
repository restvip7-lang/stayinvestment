import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

/**
 * Картинки новостей из хранилища админки — через наш сервер: /img/?url=<адрес>&w=<ширина>.
 * Скачивает оригинал один раз, сжимает в WebP нужной ширины и кладёт в папку кэша на диске
 * (IMG_CACHE_DIR, по умолчанию .cache/img рядом с проектом). Повторные запросы отдаются с диска,
 * браузеру и CDN ответ разрешено хранить год — адрес картинки меняется вместе с её содержимым.
 *
 * Работает на своём сервере (сборка под Node.js). На Vercel ту же задачу решает его оптимизатор /_vercel/image.
 * Разрешены только хосты из списка — чужие картинки через сайт не проходят.
 */
const HOSTS = new Set([
  'stay-property.fra1.cdn.digitaloceanspaces.com',
  'eu2.contabostorage.com',
  'admin.stayproperty.com',
  'stayproperty.com',
]);
const WIDTHS = [320, 640, 960, 1280, 1920];
const DIR = process.env.IMG_CACHE_DIR || path.resolve('.cache/img');
const YEAR = 'public, max-age=31536000, immutable';
const MAX_BYTES = 25 * 1024 * 1024;

// Свой Response вместо Response.redirect: у того заголовки неизменяемые, а middleware дописывает свои
const toOriginal = (href: string) => new Response(null, { status: 302, headers: { location: href, 'cache-control': 'no-store' } });
const send = (buf: Buffer, hit: boolean) =>
  new Response(new Uint8Array(buf), { headers: { 'content-type': 'image/webp', 'cache-control': YEAR, 'x-img-cache': hit ? 'HIT' : 'MISS' } });

export const GET: APIRoute = async ({ url }) => {
  const src = url.searchParams.get('url') ?? '';
  const w = Number(url.searchParams.get('w'));
  let target: URL;
  try { target = new URL(src); } catch { return new Response('Bad url', { status: 400 }); }
  if (target.protocol !== 'https:' || !HOSTS.has(target.hostname) || !WIDTHS.includes(w)) return new Response('Not allowed', { status: 400 });
  // Вне сборки под свой сервер сжимать нечем — отдаём оригинал
  if (import.meta.env.STAY_TARGET !== 'node') return toOriginal(target.href);

  const file = path.join(DIR, `${createHash('sha1').update(`${target.href}|${w}`).digest('hex')}.webp`);
  try { return send(await readFile(file), true); } catch { /* в кэше нет — готовим */ }

  try {
    const r = await fetch(target.href, { signal: AbortSignal.timeout(20_000) });
    if (!r.ok) throw new Error(`origin ${r.status}`);
    const input = Buffer.from(await r.arrayBuffer());
    if (input.length > MAX_BYTES) throw new Error('too large');
    const name = 'sharp';
    const sharp = (await import(/* @vite-ignore */ name)).default;
    const out: Buffer = await sharp(input, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toBuffer();
    await mkdir(DIR, { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, out);
    await rename(tmp, file); // запись через временный файл: параллельный запрос не прочитает половину картинки
    return send(out, false);
  } catch (e) {
    // Не получилось сжать (хранилище недоступно, битый файл) — пусть браузер возьмёт оригинал
    console.error(`[img] ${target.href}: ${(e as Error).message}`);
    return toOriginal(target.href);
  }
};
