import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';

/**
 * Номер выложенного коммита — по нему монитор (platform.stayproperty.com) сверяет прод с веткой main.
 * Файл REVISION в корне приложения пишет выкладка на сервере (deploy/deploy.sh); на Vercel номер берётся
 * из VERCEL_GIT_COMMIT_SHA; локально — «dev».
 */
export const prerender = false;

function revision(): string {
  const env = process.env.STAY_REVISION || process.env.VERCEL_GIT_COMMIT_SHA;
  if (env) return env.trim();
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
