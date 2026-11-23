import type { APIRoute } from 'astro';

/**
 * Номер выложенного коммита — по нему монитор (platform.stayproperty.com) сверяет прод с веткой main.
 * VERCEL_GIT_COMMIT_SHA Vercel подставляет сам при каждой выкладке из Git; локально — «dev».
 */
export const prerender = false;

export const GET: APIRoute = () => {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || import.meta.env.VERCEL_GIT_COMMIT_SHA || 'dev';
  return new Response(sha + '\n', {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'cdn-cache-control': 'no-store',
    },
  });
};
