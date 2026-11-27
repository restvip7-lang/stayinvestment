/**
 * Новости = свежие из админки Stay Property + архив старого stayinvestment.com.
 *
 * Админка (тот же backend, что у stay.com.tr, src/lib/content.ts там):
 *   GET {STAY_CONTENT_API}/api/content/news?language=ru&page=N&limit=100
 *   → { items, page, limit, total, totalPages }, публично, без авторизации.
 * Новая публикация в админке появляется на сайте сама: данные кэшируются на 10 минут,
 * страницы — на CDN (middleware). Если API недоступен — последняя копия, затем снимок
 * src/content/fixtures/content-news.json (обновить: npm run fixtures).
 * Архивные статьи лежат в src/content/legacy-news (npm run import-legacy), их адреса сохранены.
 */
import { cached } from './cache';
import { fmtDate, type Lang } from '../i18n';
import { optimizeHtmlImages } from './img';
import fxContent from '../content/fixtures/content-news.json';

const BASE = ((import.meta.env.STAY_CONTENT_API as string | undefined) || 'https://admin.stayproperty.com').replace(/\/$/, '');

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  image: string | null;
  /** ISO-дата публикации */
  date: string;
  source: 'api' | 'legacy';
  seoTitle: string | null;
  seoDescription: string | null;
  url: string;
}

interface RawTr { title?: string; excerpt?: string; body?: string; body_html?: string }
interface RawContent {
  id: string;
  title: string;
  excerpt?: string;
  body?: string;
  body_html?: string;
  image?: string;
  enabled?: boolean | string;
  created_at?: string;
  updated_at?: string;
  published_sort?: string;
  published_at?: string;
  translations?: Record<string, RawTr>;
}

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u',
};

/** Адрес материала — как на stay.com.tr: по английскому заголовку, одинаковый на всех языках. */
export function slugOf(s: string) {
  return s
    .toLowerCase()
    .split('')
    .map((c) => TRANSLIT[c] ?? c)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .slice(0, 9)
    .join('-')
    .slice(0, 80)
    .replace(/-+$/, '');
}

/** Сербская кириллица → латиница: сайт на сербском ведём латиницей, а админка иногда отдаёт перевод кириллицей. */
const SR_LAT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š',
};
export function srLatin(s: string) {
  return s.replace(/[\u0400-\u04FF]/g, (ch) => {
    const low = ch.toLowerCase();
    const lat = SR_LAT[low];
    if (lat === undefined) return ch;
    return ch === low ? lat : lat.charAt(0).toUpperCase() + lat.slice(1);
  });
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const textToHtml = (s: string) => s.split(/\n{2,}|\r\n\r\n/).map((p) => `<p>${escapeHtml(p.trim())}</p>`).join('');

function isoDate(x: RawContent): string {
  if (x.published_sort) return x.published_sort;
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(x.published_at ?? '');
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return (x.created_at || x.updated_at || '').replace(' ', 'T');
}

async function fetchAll(lang: Lang): Promise<RawContent[]> {
  const out: RawContent[] = [];
  for (let page = 1; page <= 20; page++) {
    const r = await fetch(`${BASE}/api/content/news?language=${lang}&page=${page}&limit=100`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`news API: ${r.status}`);
    const j = (await r.json()) as { items: RawContent[]; totalPages?: number };
    out.push(...(j.items ?? []));
    if (page >= (j.totalPages ?? 1)) break;
  }
  return out;
}

function fromApi(items: RawContent[], lang: Lang = 'ru'): NewsItem[] {
  const used = new Set<string>();
  const out: NewsItem[] = [];
  for (const x of items) {
    if (x.enabled === false || x.enabled === 'False') continue;
    const tr = x.translations ?? {};
    let ru = tr[lang];
    // Перевод не сделан: в поле языка лежит турецкий оригинал — на этом языке новость не показываем
    if (lang !== 'ru' && lang !== 'tr' && ru?.title && tr.tr?.title && ru.title.trim() === tr.tr.title.trim()) continue;
    if (lang === 'sr' && ru) ru = { title: srLatin(ru.title ?? ''), excerpt: srLatin(ru.excerpt ?? ''), body: srLatin(ru.body ?? ''), body_html: srLatin(ru.body_html ?? '') };
    const title = (ru?.title || (lang === 'ru' ? x.title : '') || '').trim();
    if (!title || (lang === 'ru' && !/[а-яё]/i.test(title))) continue; // только материалы с текстом на этом языке
    let slug = slugOf(tr.en?.title || title) || x.id;
    if (used.has(slug)) slug = `${slug}-${x.id.replace(/\W/g, '').slice(-6)}`;
    used.add(slug);
    const html = ru?.body_html || (lang === 'ru' ? x.body_html : '') || textToHtml(ru?.body || (lang === 'ru' ? x.body : '') || '');
    out.push({
      slug,
      title,
      excerpt: (ru?.excerpt || (lang === 'ru' ? x.excerpt : '') || '').trim(),
      html: optimizeHtmlImages(html),
      image: x.image || null,
      date: isoDate(x),
      source: 'api',
      seoTitle: null,
      seoDescription: null,
      url: `/news/${slug}/`,
    });
  }
  return out;
}

interface LegacyNews {
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  image: string | null;
  contentHtml: string;
  /** Устаревшая новость (даты, законы, цены прошлых лет): показывается только на русском, переводы скрыты */
  outdated?: boolean;
  /** Переводы со старого сайта (npm run import-legacy-i18n) */
  i18n?: Partial<Record<Lang, { title: string; seoTitle: string | null; seoDescription: string | null; contentHtml: string }>>;
}
const legacyFiles = import.meta.glob<LegacyNews>('../content/legacy-news/*.json', { eager: true, import: 'default' });

function excerptOf(html: string) {
  const t = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > 220 ? t.slice(0, 217).replace(/\s+\S*$/, '') + '…' : t;
}

/** Хвост старого сайта: ссылка «Ко всем новостям / Back to News» в конце текста. */
const stripTail = (html: string) => html.replace(/\s*<a href="[^"]*\/news(?:-en)?\/">\s*[^<]{0,40}<\/a>\s*$/, '');
const legacyItem = (n: LegacyNews, lang: Lang): NewsItem => {
  const x = lang === 'ru' ? n : { ...n, ...n.i18n?.[lang] };
  const html = stripTail(x.contentHtml);
  // SEO-описание старого сайта часто — заголовок + рекламные «✓ …»; если после очистки осталось мало, берём начало статьи
  const seo = x.seoDescription?.replace(/\s*✓.*$/, '').trim() ?? '';
  const description = seo.length >= 70 ? seo : excerptOf(html);
  return {
    slug: n.slug,
    title: x.title,
    excerpt: description,
    html: optimizeHtmlImages(html),
    image: n.image,
    date: n.publishedAt ?? '',
    source: 'legacy',
    seoTitle: x.seoTitle?.replace(/\s+[–-]\s+(Новости|News|Novosti|Stay Investment)$/, '') ?? null,
    seoDescription: description,
    url: `/news/${n.slug}/`,
  };
};
const LEGACY = Object.values(legacyFiles);
/** Архив на языке: на русском — всё, на других — только переведённые и не устаревшие статьи. */
const legacyFor = (lang: Lang) => LEGACY.filter((n) => lang === 'ru' || (n.i18n?.[lang] && !n.outdated)).map((n) => legacyItem(n, lang));

/** Вся лента: свежие из API + архив, новые сверху, без дублей по адресу. */
export async function getNews(lang: Lang = 'ru'): Promise<NewsItem[]> {
  const api = await cached(`news-api-${lang}`, async () => fromApi(await fetchAll(lang), lang), () => fromApi((fxContent as { items: RawContent[] }).items, lang));
  const seen = new Set<string>();
  return [...api, ...legacyFor(lang)]
    .filter((n) => (seen.has(n.slug) ? false : (seen.add(n.slug), true)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Материал по адресу. На английском/сербском статья без перевода отдаётся по-русски (translated: false). */
export async function getNewsItem(slug: string, lang: Lang = 'ru'): Promise<(NewsItem & { translated: boolean }) | null> {
  const own = (await getNews(lang)).find((n) => n.slug === slug);
  if (own) return { ...own, translated: true };
  if (lang === 'ru') return null;
  const ru = (await getNews('ru')).find((n) => n.slug === slug);
  return ru ? { ...ru, translated: false } : null;
}

export const formatDate = (iso: string, lang: Lang = 'ru') => fmtDate(lang, iso);
