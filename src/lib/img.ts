/**
 * Адреса картинок под любую площадку.
 * - Свои фото (/media/<id>.webp) лежат в трёх размерах: 480, 960 и 1600 px (scripts/localize-media.mjs).
 * - Внешние фото на Vercel идут через его оптимизатор; на своём сервере — как есть.
 */
export const MEDIA_WIDTHS = [480, 960, 1600] as const;
const VERCEL_OPT = import.meta.env.PROD && import.meta.env.STAY_TARGET === 'vercel';

export const isMedia = (src: string) => /^\/media\/[a-f0-9]+\.webp$/.test(src);

/** Адрес картинки нужной ширины. */
export function imgUrl(src: string, w: number): string {
  if (isMedia(src)) {
    const k = MEDIA_WIDTHS.find((x) => x >= w) ?? 1600;
    return k === 1600 ? src : src.replace(/\.webp$/, `-${k}.webp`);
  }
  if (VERCEL_OPT && /^https:\/\//.test(src)) return `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
  return src;
}

/** srcset для <img>; undefined — картинка одна. */
export function imgSrcset(src: string): string | undefined {
  if (isMedia(src)) return MEDIA_WIDTHS.map((w) => `${imgUrl(src, w)} ${w}w`).join(', ');
  if (VERCEL_OPT && /^https:\/\//.test(src)) return [320, 640, 960, 1280, 1920].map((w) => `${imgUrl(src, w)} ${w}w`).join(', ');
  return undefined;
}

/** Включён ли оптимизатор Vercel (нужно скрипту галереи в браузере). */
export const VERCEL_IMAGES = VERCEL_OPT;
