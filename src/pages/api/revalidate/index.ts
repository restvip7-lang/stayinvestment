import type { APIRoute } from 'astro';
import { expireCache } from '../../../lib/cache';

export const prerender = false;

/**
 * Сброс кэша данных: админка может дёргать после публикации новости,
 * cron на сервере — раз в сутки (deploy/README.md). Authorization: Bearer <REVALIDATE_SECRET | CRON_SECRET>.
 */
function authorized(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  return [process.env.REVALIDATE_SECRET, process.env.CRON_SECRET].filter(Boolean).some((s) => auth === `Bearer ${s}`);
}

async function run(request: Request) {
  if (!authorized(request)) return new Response('Unauthorized', { status: 401 });
  expireCache();
  return Response.json({ ok: true });
}

export const GET: APIRoute = ({ request }) => run(request);
export const POST: APIRoute = ({ request }) => run(request);
