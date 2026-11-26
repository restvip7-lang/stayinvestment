import type { APIRoute } from 'astro';
import { getNews } from '../../lib/news';
import { SITE } from '../../lib/site';
import { t, localePath, LANG_META } from '../../i18n';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Лента на языке раздела: /news/rss.xml, /en/news/rss.xml, /sr/news/rss.xml. */
export const GET: APIRoute = async ({ locals }) => {
  const lang = locals.lang ?? 'ru';
  const abs = (p: string) => `${SITE.url}${localePath(lang, p)}`;
  const items = (await getNews(lang)).slice(0, 50);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(t(lang, 'Новости Stay Investment'))}</title><link>${abs('/news/')}</link><language>${LANG_META[lang].hreflang}</language>
<description>${esc(t(lang, 'Новости рынка недвижимости Турции'))}</description>
${items.map((n) => `<item><title>${esc(n.title)}</title><link>${abs(n.url)}</link><guid>${abs(n.url)}</guid>${n.date ? `<pubDate>${new Date(n.date).toUTCString()}</pubDate>` : ''}<description>${esc(n.excerpt)}</description></item>`).join('\n')}
</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=0', 'cdn-cache-control': 'public, s-maxage=600, stale-while-revalidate=86400' } });
};
