import type { APIRoute } from 'astro';
import { OBJECTS, PACKAGE_ORDER, objectUrl } from '../lib/catalog';
import { getNews } from '../lib/news';
import { SITE } from '../lib/site';
import { LANGS, LANG_META, localePath, type Lang } from '../i18n';

const STATIC = ['/', '/o-kompanii/', '/metodika-i-riski/', '/kontrol-investitsij/', '/garantii-i-obespechenie/', '/open_a_company_in_turkey/', '/investment-directory/', '/investment-directory/biznes-investitsii/', '/news/', '/contacts/'];

/** Карта сайта на трёх языках: у каждого адреса — ссылки на версии на других языках (hreflang). */
export const GET: APIRoute = async () => {
  const pages: { path: string; langs: readonly Lang[]; lastmod?: string }[] = [
    ...STATIC.map((path) => ({ path, langs: LANGS })),
    ...PACKAGE_ORDER.map((k) => ({ path: `/investment-directory/${k}/`, langs: LANGS })),
    ...OBJECTS.map((o) => ({ path: objectUrl(o), langs: LANGS })),
  ];
  const newsByLang = Object.fromEntries(await Promise.all(LANGS.map(async (l) => [l, await getNews(l)] as const))) as Record<Lang, Awaited<ReturnType<typeof getNews>>>;
  for (const n of newsByLang.ru) {
    pages.push({ path: n.url, langs: LANGS.filter((l) => newsByLang[l].some((x) => x.slug === n.slug)), lastmod: n.date ? n.date.slice(0, 10) : undefined });
  }
  const abs = (l: Lang, p: string) => `${SITE.url}${localePath(l, p)}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap((p) => p.langs.map((l) => `<url><loc>${abs(l, p.path)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}${p.langs.map((a) => `<xhtml:link rel="alternate" hreflang="${LANG_META[a].hreflang}" href="${abs(a, p.path)}"/>`).join('')}</url>`)).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cdn-cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
};
