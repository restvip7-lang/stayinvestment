/**
 * Адреса картинок. Все фото сайта лежат у нас, в public/media: WebP в четырёх размерах
 * (240, 480, 960 и до 1600 px), браузер берёт подходящий под экран. Готовит их npm run optimize-images.
 *
 * - /media/<id>.webp — фото объектов и статей, перенесённые с внешних сайтов (scripts/localize-media.mjs);
 * - /images/… — свои картинки: в коде пишем исходный путь, здесь он заменяется на сжатую версию из /media;
 * - https://… — картинки новостей из хранилища админки Stay Property: сжимаются и кэшируются на нашей стороне
 *   (на Vercel — его оптимизатор, на своём сервере — /img/, src/pages/img/index.ts).
 */
import manifest from '../content/media-manifest.json';

const LOCAL = manifest.local as Record<string, string>;
/** id → [ширина-240, ширина-480, ширина-960, ширина полного, высота полного] */
const SIZES = manifest.sizes as unknown as Record<string, number[]>;
const SUFFIX = ['-240', '-480', '-960', ''];
const REMOTE_WIDTHS = [320, 640, 960, 1280, 1920];
const TARGET = import.meta.env.STAY_TARGET;
const REMOTE_OPT = import.meta.env.PROD;

const mediaId = (src: string) => /^\/media\/([a-f0-9]+)\.webp$/.exec(src)?.[1] ?? LOCAL[src];

/** Размеры картинки из /media: [{ w, url }] по возрастанию, без повторов. */
function variants(id: string): { w: number; url: string }[] {
  const row = SIZES[id] ?? [240, 480, 960, 1600];
  const out: { w: number; url: string }[] = [];
  SUFFIX.forEach((s, i) => {
    if (row[i] && !out.some((v) => v.w === row[i])) out.push({ w: row[i], url: `/media/${id}${s}.webp` });
  });
  return out;
}

const remote = (src: string, w: number) => {
  if (!REMOTE_OPT || !/^https:\/\//.test(src)) return src;
  const k = REMOTE_WIDTHS.find((x) => x >= w) ?? 1920;
  return TARGET === 'vercel' ? `/_vercel/image?url=${encodeURIComponent(src)}&w=${k}&q=75` : `/img/?url=${encodeURIComponent(src)}&w=${k}`;
};

/** Адрес картинки нужной ширины. */
export function imgUrl(src: string, w: number): string {
  const id = mediaId(src);
  if (!id) return remote(src, w);
  const v = variants(id);
  return (v.find((x) => x.w >= w) ?? v[v.length - 1]).url;
}

/** srcset для <img>; undefined — картинка одна. */
export function imgSrcset(src: string): string | undefined {
  const id = mediaId(src);
  if (id) return variants(id).map((v) => `${v.url} ${v.w}w`).join(', ');
  if (REMOTE_OPT && /^https:\/\//.test(src)) return REMOTE_WIDTHS.map((w) => `${remote(src, w)} ${w}w`).join(', ');
  return undefined;
}

/** Настоящие размеры картинки (для width/height без сдвига вёрстки). */
export function imgSize(src: string): { width: number; height: number } | null {
  const row = SIZES[mediaId(src) ?? ''];
  return row?.[3] && row?.[4] ? { width: row[3], height: row[4] } : null;
}

/**
 * Картинки внутри текста статьи: подставляет сжатые размеры, ленивую загрузку и размеры.
 * Текст статьи — колонка до 760 px, поэтому sizes фиксированный.
 */
export function optimizeHtmlImages(html: string): string {
  return html.replace(/<img\b([^>]*?)\ssrc="([^"]+)"([^>]*)>/g, (tag, a: string, src: string, b: string) => {
    const set = imgSrcset(src);
    if (!set) return tag;
    const rest = `${a}${b}`.replace(/\s(?:srcset|sizes|loading|decoding|width|height)="[^"]*"/g, '');
    const size = imgSize(src);
    const dims = size ? ` width="${size.width}" height="${size.height}"` : '';
    return `<img${rest} src="${imgUrl(src, 960)}" srcset="${set}" sizes="(min-width: 800px) 760px, 100vw"${dims} loading="lazy" decoding="async">`;
  });
}
