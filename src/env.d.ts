/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly STAY_CONTENT_API?: string;
  readonly LEAD_WEBHOOK_URL?: string;
  readonly STAY_NOINDEX?: string;
  /** Куда собран сайт: vercel или node (свой сервер). Задаётся в astro.config.mjs. */
  readonly STAY_TARGET: 'vercel' | 'node';
}
