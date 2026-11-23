/** Общие данные сайта: контакты, меню, команда. Факты — со старого stayinvestment.com (см. docs/content-audit.md). */

export const SITE = {
  name: 'Stay Investment',
  url: 'https://stayinvestment.com',
  parent: 'Stay Property',
  parentUrl: 'https://stayproperty.com',
  phone: '+90 530 178 29 02',
  phoneHref: 'tel:+905301782902',
  whatsapp: 'https://wa.me/905301782902',
  address: 'Oba Mah., Mesut Cad., No: 54, 07400 Alanya / Antalya, Türkiye',
  addressRu: 'Турция, Аланья, район Оба, ул. Месут, 54',
  instagram: 'https://www.instagram.com/stayinvestment/',
  /** Год основания бренда Stay Property — от него считаем «лет на рынке». */
  founded: 2018,
};

export const yearsOnMarket = () => new Date().getFullYear() - SITE.founded;

export interface NavItem { label: string; href: string; children?: { label: string; href: string; note?: string }[] }

export const NAV: NavItem[] = [
  { label: 'О компании', href: '/o-kompanii/' },
  {
    label: 'Инвесторам',
    href: '/kontrol-investitsij/',
    children: [
      { label: 'Методика и риски', href: '/metodika-i-riski/', note: 'Как считаем доходность, риски, глоссарий' },
      { label: 'Контроль инвестиций', href: '/kontrol-investitsij/', note: 'Кабинет инвестора и отчётность' },
      { label: 'Гарантии и обеспечение', href: '/garantii-i-obespechenie/', note: 'Нотариус, вексель, ипотека, ТАПУ' },
      { label: 'Как открыть компанию в Турции', href: '/open_a_company_in_turkey/', note: 'Пошаговая инструкция' },
    ],
  },
  {
    label: 'Каталог',
    href: '/investment-directory/',
    children: [
      { label: 'Рантье', href: '/investment-directory/rental/', note: 'Арендный доход с гарантией' },
      { label: 'Стартовый', href: '/investment-directory/startovye/', note: 'Новостройки ниже рынка' },
      { label: 'Партнерский', href: '/investment-directory/partnerskye/', note: 'Доля в проекте девелопера' },
      { label: 'Инвестиции в бизнес', href: '/investment-directory/biznes-investitsii/', note: 'Офисы, магазины, отели' },
    ],
  },
  { label: 'Новости', href: '/news/' },
  { label: 'Контакты', href: '/contacts/' },
];

/** Команда. focus — точка кадрирования фото (класс Tailwind object-position), чтобы лицо было в центре карточки 4:5. */
export const TEAM = [
  { name: 'Халиль Ибрагим Дайе', role: 'CEO Stay Property', whatsapp: 'https://wa.me/905327643432', photo: '/images/team/halil.jpg', focus: 'object-top' },
  { name: 'Наталья Лихошапка', role: 'Инвестиционный консультант', whatsapp: 'https://wa.me/905357141506', photo: '/images/team/natalya.jpg', focus: 'object-top' },
  { name: 'Ульяна Коркмаз', role: 'Руководитель отдела продаж', whatsapp: 'https://wa.me/905391028170', photo: '/images/team/ulyana.jpg', focus: 'object-top' },
];

/** Показатели группы Stay Property (со старого сайта; подтвердить актуальность — docs/content-audit.md). */
export const STATS = [
  { value: 2446, suffix: '', label: 'квартир построено' },
  { value: 14, suffix: '+', label: 'собственных проектов' },
  { value: 134573, suffix: ' м²', label: 'общая площадь' },
  { value: 9, suffix: '', label: 'офисов в 6 странах' },
];

export const DISCLAIMER =
  'Показатели доходности — прогнозные и основаны на условиях конкретного инвестиционного договора, текущих ценах и арендном спросе. Инвестиции в недвижимость связаны с рисками; прошлые результаты не гарантируют будущей доходности. Материалы сайта не являются публичной офертой.';
