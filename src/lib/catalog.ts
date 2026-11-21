/**
 * Каталог инвестиционных объектов. Данные — src/content/objects/*.json (импорт со старого сайта:
 * npm run import-legacy). Когда объекты переедут в админку/Portfolio, менять только этот файл.
 */

export type PackageKey = 'rental' | 'startovye' | 'partnerskye';

export interface Metric { label: string; value: number | null; unit: string | null }

export interface InvestObject {
  id: string;
  package: PackageKey;
  slug: string;
  title: string;
  location: string | null;
  type: string | null;
  layouts: string[];
  seaDistance: number | null;
  year: number | null;
  metrics: Metric[];
  infrastructure: string[];
  descriptionHtml: string;
  images: string[];
  video: string | null;
}

export interface PackageInfo {
  key: PackageKey;
  name: string;
  /** Короткий тезис для карточки пакета */
  tagline: string;
  /** Описание пакета (улучшенный текст старого сайта) */
  text: string;
  seoTitle: string;
  seoDescription: string;
}

export const PACKAGES: Record<PackageKey, PackageInfo> = {
  rental: {
    key: 'rental',
    name: 'Рантье',
    tagline: 'Арендный доход с гарантией застройщика',
    text: 'Квартиры в готовых и строящихся комплексах для сдачи в краткосрочную или долгосрочную аренду. Застройщик гарантирует арендный доход на 2–5 лет — в зависимости от проекта. Сдавать объект можно самостоятельно или передать в управление Stay Property: поиск арендаторов, уборка и отчётность — на нас.',
    seoTitle: 'Пакет «Рантье» — недвижимость в Турции под аренду с гарантией дохода',
    seoDescription: 'Квартиры в Аланье и Стамбуле под сдачу в аренду: гарантия арендного дохода от застройщика на 2–5 лет, рассрочка, управление объектом под ключ.',
  },
  startovye: {
    key: 'startovye',
    name: 'Стартовый',
    tagline: 'Вход на этапе котлована — ниже рыночной цены',
    text: 'Покупка квартир в строящихся жилых комплексах по ценам ниже рыночных — со скидкой и беспроцентной рассрочкой от застройщика. Доход формируется за счёт роста стоимости к моменту сдачи дома; по условиям договора компания помогает с перепродажей объекта.',
    seoTitle: 'Пакет «Стартовый» — инвестиции в новостройки Турции на старте продаж',
    seoDescription: 'Квартиры в строящихся ЖК Аланьи и Стамбула по цене ниже рынка: скидки, рассрочка от застройщика, помощь с перепродажей после сдачи дома.',
  },
  partnerskye: {
    key: 'partnerskye',
    name: 'Партнерский',
    tagline: 'Доля в проекте девелопера — ROI от 30%',
    text: 'Участие долей в собственных проектах Stay Property: инвестор входит в проект вместе с девелопером и получает доход от продажи квартир. Прогнозируемая доходность — от 30% за цикл проекта (обычно 24–36 месяцев). Условия, порядок отчётности и обеспечение фиксируются в инвестиционном договоре.',
    seoTitle: 'Пакет «Партнерский» — долевое участие в девелоперских проектах в Турции',
    seoDescription: 'Инвестиции долей в проекты Stay Property в Аланье и Стамбуле: прогнозируемый ROI от 30%, окупаемость 24–36 месяцев, отчётность в кабинете инвестора.',
  },
};

export const PACKAGE_ORDER: PackageKey[] = ['rental', 'startovye', 'partnerskye'];

const files = import.meta.glob<InvestObject>('../content/objects/*.json', { eager: true, import: 'default' });
const ID_NUM = (id: string) => Number(id.slice(2)) || 0;

export const OBJECTS: InvestObject[] = Object.values(files).sort(
  (a, b) => PACKAGE_ORDER.indexOf(a.package) - PACKAGE_ORDER.indexOf(b.package) || ID_NUM(b.id) - ID_NUM(a.id),
);

export const objectUrl = (o: Pick<InvestObject, 'package' | 'slug'>) => `/investment-directory/${o.package}/${o.slug}/`;

export function byPackage(pkg: PackageKey) {
  return OBJECTS.filter((o) => o.package === pkg);
}

export function findObject(pkg: string, slug: string) {
  return OBJECTS.find((o) => o.package === pkg && o.slug === slug) ?? null;
}

const metric = (o: InvestObject, re: RegExp) => o.metrics.find((m) => re.test(m.label))?.value ?? null;

/** Цена входа: стартовая стоимость / мин. лот / сумма входа — в зависимости от пакета. */
export const entryPrice = (o: InvestObject) => metric(o, /Начальная стоимость|Минимальная стоимость лота|Сумма входа/);
/** Главный показатель доходности для карточки. */
export function yieldOf(o: InvestObject): { label: string; value: number } | null {
  const roi = metric(o, /^ROI$/);
  if (roi != null) return { label: 'ROI', value: roi };
  const y = metric(o, /^Доходность$/);
  if (y != null) return { label: 'Доходность в год', value: y };
  const d = metric(o, /^Скидка$/);
  if (d != null) return { label: 'Скидка', value: d };
  return null;
}

/** Город и район: «Алания Конаклы» → { city: 'Алания', district: 'Конаклы' } */
export function placeOf(o: InvestObject) {
  const parts = (o.location ?? '').split(/\s+/).filter(Boolean);
  const city = parts[0] ?? '';
  const district = parts.slice(1).join(' ').replace(/^Азия\s+/, '') || null;
  return { city: city === 'Алания' ? 'Аланья' : city, district };
}

/** Подписи показателей — в современной формулировке. */
const LABELS: Record<string, string> = {
  'Доходность': 'Доходность в год',
  'Минимальная доходность от аренды в год': 'Арендный доход в год, от',
  '1й платеж': 'Первый взнос',
  'Срок рассрочки': 'Рассрочка',
  'Срок гарантии аренды': 'Гарантия аренды',
  'Минимальный вход': 'Минимум объектов',
  'Начальная стоимость': 'Стоимость, от',
  'Минимум лотов для входа': 'Минимум лотов',
  'Минимальная стоимость лота': 'Стоимость лота, от',
  'Скидка': 'Скидка от рынка',
  'Общее кол-во апартаментов': 'Квартир в проекте',
  'Стоимость проекта': 'Бюджет проекта',
  'Минимальная доля в проекте': 'Минимальная доля',
  'Сумма входа': 'Сумма входа',
  'Окупаемость': 'Срок окупаемости',
  'ROI': 'ROI за цикл проекта',
};
export const metricLabel = (l: string) => LABELS[l] ?? l;

const nf = new Intl.NumberFormat('ru-RU');
export function formatMetric(m: Metric) {
  if (m.value == null) return '—';
  const unit = (m.unit ?? '').replace(/^шт\.?$/, 'шт.').replace(/^мес\.?$/, 'мес.');
  if (unit === '€') return `${nf.format(m.value)} €`;
  if (unit === '%') return `${nf.format(m.value)}%`;
  return unit ? `${nf.format(m.value)} ${unit}` : nf.format(m.value);
}
export const euro = (n: number | null) => (n == null ? '—' : `${nf.format(n)} €`);

export const CITIES = [...new Set(OBJECTS.map((o) => placeOf(o).city).filter(Boolean))];
