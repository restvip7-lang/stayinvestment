import type { APIRoute } from 'astro';
import { OBJECTS, PACKAGE_ORDER, objectUrl } from '../lib/catalog';
import { getNews } from '../lib/news';
import { SITE } from '../lib/site';

const STATIC = ['/', '/o-kompanii/', '/metodika-i-riski/', '/kontrol-investitsij/', '/garantii-i-obespechenie/', '/open_a_company_in_turkey/', '/investment-directory/', '/investment-directory/biznes-investitsii/', '/news/', '/contacts/'];

export const GET: APIRoute = async () => {
  const news = await getNews();
  const urls: { loc: string; lastmod?: string }[] = [
    ...STATIC.map((loc) => ({ loc })),
    ...PACKAGE_ORDER.map((k) => ({ loc: `/investment-directory/${k}/` })),
    ...OBJECTS.map((o) => ({ loc: objectUrl(o) })),
    ...news.map((n) => ({ loc: n.url, lastmod: n.date ? n.date.slice(0, 10) : undefined })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${SITE.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cdn-cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
};
