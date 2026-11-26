/**
 * Редиректы со старого stayinvestment.com (301). Переезды объектов и удалённые карточки —
 * src/content/legacy-redirects.json (генерирует npm run import-legacy), остальное — здесь.
 * Полный список с пояснениями: docs/redirects.md.
 */
import legacy from '../content/legacy-redirects.json';
import legacyI18n from '../content/legacy-redirects-i18n.json';

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
  // Страницы английской и сербской версий старого сайта
  '/en/home/': '/en/',
  '/en/about-company/': '/en/o-kompanii/',
  '/en/about-company/dokumenty-kompanii/': '/en/o-kompanii/',
  '/en/investment-control/': '/en/kontrol-investitsij/',
  '/en/guarantees-and-security/': '/en/garantii-i-obespechenie/',
  '/en/contacts-2/': '/en/contacts/',
  '/en/news-en/': '/en/news/',
  '/en/obzor-rynka-turetskoj-nedvizhimosti-za-poslednie-15-let/': '/en/news/',
  '/en/overseas-investors-continue-to-support-turkey/': '/en/news/',
  '/en/investment-directory/bronze/': '/en/investment-directory/rental/',
  '/en/investment-directory/gold/': '/en/investment-directory/startovye/',
  '/en/investment-directory/exclusive/': '/en/investment-directory/partnerskye/',
  '/en/investment-directory/business-investments/': '/en/investment-directory/biznes-investitsii/',
  '/sr/glavnaya-3/': '/sr/',
  '/sr/glavnaya-3-2/': '/sr/',
  '/sr/o-kompaniji/': '/sr/o-kompanii/',
  '/sr/kontrola-investicija/': '/sr/kontrol-investitsij/',
  '/sr/garancija-i-sigurnost/': '/sr/garantii-i-obespechenie/',
  '/sr/kontakt/': '/sr/contacts/',
};

const MAP: Record<string, string> = { ...(legacy as Record<string, string>), ...(legacyI18n as Record<string, string>), ...STATIC };

export function redirectFor(path: string): { to: string; status: 301 | 302 } | null {
  const p = path.endsWith('/') ? path : `${path}/`;
  if (MAP[p]) return { to: MAP[p], status: 301 };
  // Старые карточки и статьи на английском/сербском, у которых нет пары на новом сайте, — в раздел.
  const old = /^\/(en|sr)\/(investment-directory\/(?!(?:rental|startovye|partnerskye|biznes-investitsii)\/)|news-en\/).+/.exec(p);
  if (old) return { to: `/${old[1]}/${old[2].startsWith('news-en') ? 'news' : 'investment-directory'}/`, status: 301 };
  return null;
}
