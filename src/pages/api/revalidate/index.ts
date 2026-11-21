import type { APIRoute } from 'astro';
import { expireCache } from '../../../lib/cache';

export const prerender = false;

/**
 * Сброс кэша (как в stay.com.tr): админка может дёргать после публикации новости,
 * Vercel Cron — раз в сутки (vercel.json). Authorization: Bearer <REVALIDATE_SECRET | CRON_SECRET>.
 */
function authorized(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  return [process.env.REVALIDATE_SECRET, process.env.CRON_SECRET].filter(Boolean).some((s) => auth === `Bearer ${s}`);
}

async function run(request: Request) {
  if (!authorized(request)) return new Response('Unauthorized', { status: 401 });
  expireCache();
  let purged = false;
  try {
    const { invalidateByTag } = await import('@vercel/functions');
    await invalidateByTag(['site']);
    purged = true;
  } catch { /* локально тегов нет */ }
  return Response.json({ ok: true, purged });
}

export const GET: APIRoute = ({ request }) => run(request);
export const POST: APIRoute = ({ request }) => run(request);
