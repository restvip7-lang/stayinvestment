/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly STAY_CONTENT_API?: string;
  readonly LEAD_WEBHOOK_URL?: string;
  readonly STAY_NOINDEX?: string;
  /** Куда собран сайт: vercel или node (свой сервер). Задаётся в astro.config.mjs. */
  readonly STAY_TARGET: 'vercel' | 'node';
}
declare namespace App {
  interface Locals {
    /** Язык страницы (src/i18n): ставит middleware по префиксу /en, /sr */
    lang: import('./i18n').Lang;
    /** Адрес страницы без языкового префикса */
    path: string;
  }
}
declare function T(s: string, v?: Record<string, string | number>): string;
interface Window { __I18N__?: Record<string, string> }
