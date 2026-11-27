/**
 * Офисы группы Stay Property — данные со страницы stayproperty.com/contacts/.
 * Страны идут в порядке показа; первый офис первой страны (Аланья, главный офис) открыт на странице по умолчанию.
 * Названия стран и городов — по-русски (переводятся через src/i18n), адреса — как в оригинале;
 * addressIntl — запись латиницей для английской и сербской версий там, где оригинал на кириллице.
 */
export interface Office {
  id: string;
  city: string;
  /** Уточнение под названием: район, статус */
  note?: string;
  hq?: boolean;
  /** Офис ещё не открыт */
  soon?: boolean;
  opened?: number;
  address?: string;
  addressIntl?: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
  /** Часовой пояс IANA — для местного времени */
  tz: string;
  /** Фото офиса из public/images/offices */
  photo?: string;
  photoAlt?: string;
  /** Фото города, а не самого офиса (источники — docs/photo-credits.md) */
  cityPhoto?: boolean;
  /** Ссылка на точку в Google Картах (если нет — строится по координатам) */
  mapUrl?: string;
}
export interface OfficeCountry { id: string; name: string; offices: Office[] }

const MAIN_PHONE = '+90 530 178 29 16';
const MAIN_EMAIL = 'office@stayproperty.com';

export const OFFICE_COUNTRIES: OfficeCountry[] = [
  {
    id: 'turkey',
    name: 'Турция',
    offices: [
      {
        id: 'alanya', city: 'Аланья', note: 'Главный офис', hq: true, opened: 2014,
        address: 'Oba Mah., Mesut Cad., No: 54/A — 07400 Alanya / Antalya / Turkey',
        phone: MAIN_PHONE, email: MAIN_EMAIL, lat: 36.5381797, lng: 32.0393043, tz: 'Europe/Istanbul',
        photo: '/images/offices/alanya.jpg', photoAlt: 'Команда Stay Property у главного офиса в Аланье',
        mapUrl: 'https://maps.app.goo.gl/Uhi66QfBQKTY6TJo7',
      },
      {
        id: 'istanbul', city: 'Стамбул', note: 'Багджылар', opened: 2022,
        address: 'Mahmutbey Mah., Taşocağı Yolu Cad., Balance Rezidans No: 19/7, C blok, kat 17, daire 50 — Bağcılar / İstanbul',
        phone: MAIN_PHONE, email: 'office@staypropertyistanbul.com', lat: 41.052686681311, lng: 28.810971185166, tz: 'Europe/Istanbul',
        photo: '/images/offices/istanbul.jpg', photoAlt: 'Переговорная офиса Stay Property в Стамбуле',
      },
      {
        id: 'konya', city: 'Конья', note: 'Мерам', opened: 2026,
        address: 'Melikşah, Sivaslı Ali Kemal Cd. No: 70, 42090 Meram / Konya, Türkiye',
        phone: '+90 530 528 78 29', email: MAIN_EMAIL, lat: 37.8769944, lng: 32.459432, tz: 'Europe/Istanbul',
        photo: '/images/offices/konya.jpg', photoAlt: 'Фасад офиса Stay Property в Конье',
      },
    ],
  },
  {
    id: 'russia',
    name: 'Россия',
    offices: [
      {
        id: 'moscow', city: 'Москва', opened: 2021,
        address: 'Россия, г. Москва, ул. 3-я Ямского Поля, д. 9, корп. 6, офис 101',
        addressIntl: '9 bldg. 6, 3rd Yamskogo Polya St., office 101, Moscow, Russia',
        phone: '+7 499 350 80 99', email: 'msk@staypropertymoscow.com', lat: 55.780890103158, lng: 37.58089104102, tz: 'Europe/Moscow',
        photo: '/images/offices/moscow.jpg', photoAlt: 'Приёмная офиса Stay Property в Москве',
      },
    ],
  },
  {
    id: 'kazakhstan',
    name: 'Казахстан',
    offices: [
      {
        id: 'almaty', city: 'Алматы', opened: 2022,
        address: 'Казахстан, г. Алматы, проспект Достык, 210, бизнес-центр Koktem Grand, 1 эт.',
        addressIntl: 'Koktem Grand business centre, 210 Dostyk Ave., ground floor, Almaty, Kazakhstan',
        phone: '+7 727 312 27 06', email: 'office@staypropertykz.com', lat: 43.229920246659, lng: 76.96101067694, tz: 'Asia/Almaty',
        photo: '/images/offices/almaty.jpg', photoAlt: 'Офис Stay Property в Алматы',
      },
    ],
  },
  {
    id: 'uae',
    name: 'ОАЭ',
    offices: [
      {
        id: 'dubai', city: 'Дубай', note: 'Бизнес-Бэй', opened: 2023,
        address: 'ОАЭ, Дубай, Бизнес-Бэй, Bayswater Tower, офис 1311',
        addressIntl: 'Bayswater Tower, office 1311, Business Bay, Dubai, UAE',
        phone: '+971 55 591 29 76', email: MAIN_EMAIL, lat: 25.229762, lng: 55.289311, tz: 'Asia/Dubai',
        photo: '/images/offices/dubai.jpg', photoAlt: 'Небоскрёбы Бизнес-Бэй и Бурдж-Халифа в Дубае', cityPhoto: true,
      },
    ],
  },
  {
    id: 'north-cyprus',
    name: 'Северный Кипр',
    offices: [
      {
        id: 'cyprus', city: 'Гирне', note: 'Чаталкёй', opened: 2023,
        address: 'Beşparmaklar Caddesi, Mazlum Plaza No: 44, ofis 4 — Çatalköy / Kuzey Kıbrıs',
        phone: MAIN_PHONE, email: MAIN_EMAIL, lat: 35.315875, lng: 33.404182, tz: 'Asia/Famagusta',
        photo: '/images/offices/cyprus.jpg', photoAlt: 'Старая гавань Гирне, Северный Кипр', cityPhoto: true,
      },
    ],
  },
  {
    id: 'uk',
    name: 'Великобритания',
    offices: [
      {
        id: 'london', city: 'Лондон', note: 'Скоро открытие', soon: true, phone: MAIN_PHONE, email: MAIN_EMAIL, lat: 51.5074, lng: -0.1278, tz: 'Europe/London',
        photo: '/images/offices/london.jpg', photoAlt: 'Тауэрский мост на рассвете, Лондон', cityPhoto: true,
      },
    ],
  },
];

export const OFFICES = OFFICE_COUNTRIES.flatMap((c) => c.offices.map((o) => ({ ...o, country: c })));
export const OPEN_OFFICES = OFFICES.filter((o) => !o.soon);

export const OFFICE_LINKS = {
  whatsapp: 'https://wa.me/905301782916',
  telegram: 'https://t.me/stayproperty',
  instagram: 'https://www.instagram.com/stayproperty/',
  youtube: 'https://www.youtube.com/@stayproperty',
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** 36.5381797, 32.0393043 → «36°32′ N · 32°02′ E» */
export function dms(lat: number, lng: number) {
  const part = (v: number, pos: string, neg: string) => {
    const a = Math.abs(v);
    const d = Math.floor(a);
    const m = Math.round((a - d) * 60);
    return `${d}°${String(m === 60 ? 59 : m).padStart(2, '0')}′ ${v >= 0 ? pos : neg}`;
  };
  return `${part(lat, 'N', 'S')} · ${part(lng, 'E', 'W')}`;
}
