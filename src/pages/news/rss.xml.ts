import type { APIRoute } from 'astro';
import { getNews } from '../../lib/news';
import { SITE } from '../../lib/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const items = (await getNews()).slice(0, 50);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${SITE.name} — новости</title><link>${SITE.url}/news/</link><language>ru</language>
<description>Новости рынка недвижимости Турции</description>
${items.map((n) => `<item><title>${esc(n.title)}</title><link>${SITE.url}${n.url}</link><guid>${SITE.url}${n.url}</guid>${n.date ? `<pubDate>${new Date(n.date).toUTCString()}</pubDate>` : ''}<description>${esc(n.excerpt)}</description></item>`).join('\n')}
</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=0', 'cdn-cache-control': 'public, s-maxage=600, stale-while-revalidate=86400' } });
};
