/**
 * Языки сайта. Русский — основной, без префикса в адресе; английский, сербский (латиница) и турецкий — /en/…, /sr/…, /tr/….
 *
 * Как устроено:
 * - middleware (src/middleware.ts) снимает префикс /en|/sr|/tr, кладёт язык в Astro.locals.lang и отдаёт ту же страницу;
 *   внутренние ссылки в готовом HTML он сам дополняет префиксом языка — в вёрстке пишем обычные «/о-чём-то/».
 * - Тексты интерфейса: t(lang, 'Русская фраза') → перевод из src/i18n/en.json / sr.json / tr.json (ключ — русский текст).
 *   Нет перевода — показываем русский (и в dev пишем в консоль, чтобы не пропустить).
 * - Переменные в фразе: t(lang, 'Вход от {sum}', { sum }) — {sum} одинаково во всех языках.
 */
import en from './en.json';
import sr from './sr.json';
import tr from './tr.json';

export const LANGS = ['ru', 'en', 'sr', 'tr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ru';

export const LANG_META: Record<Lang, { label: string; name: string; locale: string; og: string; hreflang: string }> = {
  ru: { label: 'RU', name: 'Русский', locale: 'ru-RU', og: 'ru_RU', hreflang: 'ru' },
  en: { label: 'EN', name: 'English', locale: 'en-GB', og: 'en_GB', hreflang: 'en' },
  sr: { label: 'SR', name: 'Srpski', locale: 'sr-Latn-RS', og: 'sr_RS', hreflang: 'sr' },
  tr: { label: 'TR', name: 'Türkçe', locale: 'tr-TR', og: 'tr_TR', hreflang: 'tr' },
};

const DICT: Record<Exclude<Lang, 'ru'>, Record<string, string>> = { en, sr, tr };
const missing = new Set<string>();

export function t(lang: Lang, ru: string, vars?: Record<string, string | number>): string {
  let s = ru;
  if (lang !== 'ru') {
    const found = DICT[lang][ru];
    if (found) s = found;
    else if (import.meta.env.DEV && !missing.has(`${lang}:${ru}`)) {
      missing.add(`${lang}:${ru}`);
      console.warn(`[i18n] нет перевода (${lang}): ${ru}`);
    }
  }
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

/** Функция перевода для текущего языка: const tr = useT(lang); tr('Текст'). */
export const useT = (lang: Lang) => (ru: string, vars?: Record<string, string | number>) => t(lang, ru, vars);

/** Язык из Astro.locals (ставит middleware). */
export const langOf = (locals: App.Locals): Lang => locals.lang ?? 'ru';

/** Адрес страницы на нужном языке: localePath('en', '/news/') → '/en/news/'. */
export const localePath = (lang: Lang, path: string) => (lang === 'ru' ? path : `/${lang}${path === '/' ? '/' : path}`);

/** Разбор адреса: '/en/news/' → { lang: 'en', path: '/news/' }. */
export function splitLang(pathname: string): { lang: Lang; path: string } {
  const m = /^\/(en|sr|tr)(\/.*)?$/.exec(pathname);
  return m ? { lang: m[1] as Lang, path: m[2] || '/' } : { lang: 'ru', path: pathname };
}

/** Локализованное поле контента: у объектов и статей переводы лежат в i18n.{en,sr,tr}. */
export function pick<T extends object, K extends keyof T>(lang: Lang, item: T & { i18n?: Partial<Record<Lang, Partial<T>>> }, key: K): T[K] {
  const v = lang === 'ru' ? undefined : item.i18n?.[lang]?.[key];
  return (v === undefined || v === null || v === '' ? item[key] : v) as T[K];
}

/** Процент под язык: по-турецки знак стоит перед числом — «%7», «+%15», «%5–7»; в остальных языках — «7%». */
export const fmtPct = (lang: Lang, v: string | number): string => {
  const s = String(v);
  if (lang !== 'tr') return `${s}%`;
  const m = /^([+\-−≈\s]*)(.*)$/.exec(s)!;
  return `${m[1]}%${m[2]}`;
};

/** Формат чисел и дат под язык. */
export const fmtNumber = (lang: Lang, n: number, opts?: Intl.NumberFormatOptions) => n.toLocaleString(LANG_META[lang].locale, opts);
export const fmtDate = (lang: Lang, d: string | Date) => {
  const x = typeof d === 'string' ? new Date(d) : d;
  return Number.isNaN(+x) ? '' : x.toLocaleDateString(LANG_META[lang].locale, { day: 'numeric', month: 'long', year: 'numeric' });
};
