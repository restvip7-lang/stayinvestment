/**
 * Редиректы со старого stayinvestment.com (301). Переезды объектов и удалённые карточки —
 * src/content/legacy-redirects.json (генерирует npm run import-legacy), остальное — здесь.
 * Полный список с пояснениями: docs/redirects.md.
 */
import legacy from '../content/legacy-redirects.json';

const STATIC: Record<string, string> = {
  '/glavnaya-2/': '/',
  '/main-test/': '/',
  '/test2/': '/',
  '/test3/': '/',
  '/investiranje-u-nekretnine-u-turskoj/': '/',
  '/individualnyj-podbor/': '/investment-directory/',
  '/trade-in/': '/investment-directory/',
  '/investment-directory/bronzovyj/': '/investment-directory/rental/',
  '/proektnaya-dokumentatsiya/': '/kontrol-investitsij/',
  '/o-kompanii/dokumenty-kompanii/': '/o-kompanii/',
  '/obzor-rynka-turetskoj-nedvizhimosti-za-poslednie-15-let/': '/news/',
};

const MAP: Record<string, string> = { ...(legacy as Record<string, string>), ...STATIC };

export function redirectFor(path: string): { to: string; status: 301 | 302 } | null {
  const p = path.endsWith('/') ? path : `${path}/`;
  if (MAP[p]) return { to: MAP[p], status: 301 };
  // Английская и сербская версии ещё не перенесены — временно ведём на русскую главную (302, не 301).
  if (/^\/(en|sr)(\/|$)/.test(p)) return { to: '/', status: 302 };
  return null;
}
