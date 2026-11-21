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

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const textToHtml = (s: string) => s.split(/\n{2,}|\r\n\r\n/).map((p) => `<p>${escapeHtml(p.trim())}</p>`).join('');

function isoDate(x: RawContent): string {
  if (x.published_sort) return x.published_sort;
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(x.published_at ?? '');
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return (x.created_at || x.updated_at || '').replace(' ', 'T');
}

async function fetchAll(): Promise<RawContent[]> {
  const out: RawContent[] = [];
  for (let page = 1; page <= 20; page++) {
    const r = await fetch(`${BASE}/api/content/news?language=ru&page=${page}&limit=100`, {
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

function fromApi(items: RawContent[]): NewsItem[] {
  const used = new Set<string>();
  const out: NewsItem[] = [];
  for (const x of items) {
    if (x.enabled === false || x.enabled === 'False') continue;
    const tr = x.translations ?? {};
    const ru = tr.ru;
    const title = (ru?.title || x.title || '').trim();
    if (!title || !/[а-яё]/i.test(title)) continue; // только материалы с русским текстом
    let slug = slugOf(tr.en?.title || title) || x.id;
    if (used.has(slug)) slug = `${slug}-${x.id.replace(/\W/g, '').slice(-6)}`;
    used.add(slug);
    const html = ru?.body_html || x.body_html || textToHtml(ru?.body || x.body || '');
    out.push({
      slug,
      title,
      excerpt: (ru?.excerpt || x.excerpt || '').trim(),
      html,
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
}
const legacyFiles = import.meta.glob<LegacyNews>('../content/legacy-news/*.json', { eager: true, import: 'default' });

function excerptOf(html: string) {
  const t = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > 220 ? t.slice(0, 217).replace(/\s+\S*$/, '') + '…' : t;
}

const legacy: NewsItem[] = Object.values(legacyFiles).map((n) => ({
  slug: n.slug,
  title: n.title,
  excerpt: n.seoDescription?.replace(/\s*✓.*$/, '') || excerptOf(n.contentHtml),
  html: n.contentHtml,
  image: n.image,
  date: n.publishedAt ?? '',
  source: 'legacy',
  seoTitle: n.seoTitle?.replace(/\s+[–-]\s+(Новости|Stay Investment)$/, '') ?? null,
  seoDescription: n.seoDescription,
  url: `/news/${n.slug}/`,
}));

/** Вся лента: свежие из API + архив, новые сверху, без дублей по адресу. */
export async function getNews(): Promise<NewsItem[]> {
  const api = await cached('news-api', async () => fromApi(await fetchAll()), () => fromApi((fxContent as { items: RawContent[] }).items));
  const seen = new Set<string>();
  return [...api, ...legacy]
    .filter((n) => (seen.has(n.slug) ? false : (seen.add(n.slug), true)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsItem(slug: string): Promise<NewsItem | null> {
  return (await getNews()).find((n) => n.slug === slug) ?? null;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(+d) ? '' : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}
