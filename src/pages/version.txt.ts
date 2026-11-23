import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';

/**
 * Номер выложенного коммита — по нему монитор (platform.stayproperty.com) сверяет прод с веткой main.
 * Файл REVISION в корне приложения пишет выкладка на сервере (deploy/deploy.sh); локально — «dev».
 */
export const prerender = false;

function revision(): string {
  if (process.env.STAY_REVISION) return process.env.STAY_REVISION.trim();
  try {
    return readFileSync(new URL('REVISION', `file://${process.cwd()}/`), 'utf8').trim() || 'dev';
  } catch {
    return 'dev';
  }
}

export const GET: APIRoute = () =>
  new Response(revision() + '\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'cdn-cache-control': 'no-store' },
  });
