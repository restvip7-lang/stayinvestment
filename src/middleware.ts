/**
 * - редиректы со старых адресов stayinvestment.com (src/lib/redirects.ts);
 * - единый вид адреса: строчные буквы, слеш на конце;
 * - заголовки кэша страниц для CDN (Cloudflare): 10 минут свежие + stale-while-revalidate;
 * - пока сайт не открыт (STAY_NOINDEX != 0) — заголовок noindex.
 */
import { defineMiddleware } from 'astro:middleware';
import { redirectFor } from './lib/redirects';

const STATIC = /^\/(_astro|_image|images|fonts|favicon|robots\.txt|sitemap|api\/)/;
const redirect = (to: string, status = 301) => new Response(null, { status, headers: { location: to, 'cache-control': 'public, max-age=3600' } });

export const onRequest = defineMiddleware(async (ctx, next) => {
  const url = ctx.url;
  const path = url.pathname;

  if (!STATIC.test(path)) {
    const r = redirectFor(path);
    if (r) return redirect(r.to + url.search, r.status);
    let fixed = path.toLowerCase().replace(/\/{2,}/g, '/');
    if (!fixed.endsWith('/') && !/\.[a-z0-9]+$/.test(fixed)) fixed += '/';
    if (fixed !== path) return redirect(fixed + url.search);
  }

  const res = await next();

  if (ctx.request.method === 'GET' && !path.startsWith('/api/') && res.status < 500 && !res.headers.has('cache-control')) {
    res.headers.set('cache-control', 'public, max-age=0, must-revalidate');
    res.headers.set('cdn-cache-control', 'public, s-maxage=600, stale-while-revalidate=86400, stale-if-error=86400');
  }
  if ((import.meta.env.STAY_NOINDEX ?? process.env.STAY_NOINDEX ?? '1') !== '0') res.headers.set('x-robots-tag', 'noindex, nofollow');
  return res;
});
