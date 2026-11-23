# Stay Investment — сайт

Новый сайт [stayinvestment.com](https://stayinvestment.com): инвестиции в недвижимость Турции, направление группы Stay Property.
Структура и тексты перенесены со старого сайта на WordPress и отредактированы ([docs/content-audit.md](docs/content-audit.md)),
дизайн — в фирменном стиле Stay Property (как stayproperty.com: шрифт Euclid Circular A по лицензии группы, `public/fonts/`; токены — `src/styles/global.css`). Стек — как у соседнего сайта `stay.com.tr`: **Astro 7 + Tailwind 4, SSR на Node (свой сервер, Plesk 167.86.66.155)**.

## Запуск

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # сборка (dist/, запуск: node dist/server/entry.mjs)
npm run check      # проверка типов
```

Переменные окружения — в [.env.example](.env.example).

## Ветки и выкладка

| Ветка | Что это | Выкладка |
|---|---|---|
| `main` | боевой сайт | сервер сам забирает каждый новый коммит `main` и выкладывает за 1–2 минуты ([deploy/README.md](deploy/README.md)) |
| `dev` | общая рабочая ветка | не выкладывается; проверяем локально (`npm run dev`) |
| `feature/…` | отдельная задача (по желанию) | как `dev` |

Порядок работы:

1. Перед началом — `git checkout dev && git pull`. В `main` напрямую не коммитим.
2. Коммиты — в `dev` (или в `feature/…` от `dev`, потом слияние в `dev`).
3. Проверили → Pull request `dev` → `main` → слияние. Это и есть выкладка на прод.
4. После слияния прод отдаёт номер коммита на `/version.txt`; монитор (platform.stayproperty.com) сверяет его с `main` и пишет в Telegram, если выкладка застряла.

Перед PR: `npm run build` и `npm run check` без ошибок.

## Откуда берутся данные

| Что | Источник | Обновление |
|---|---|---|
| Новости (свежие) | Админка Stay Property: `GET https://admin.stayproperty.com/api/content/news?language=ru` | Сами: кэш 10 мин, CDN — 10 мин + stale-while-revalidate. Мгновенно — `POST /api/revalidate/` с `Authorization: Bearer $REVALIDATE_SECRET` |
| Новости (архив, 26 шт.) | Старый сайт → `src/content/legacy-news/*.json` | `npm run import-legacy` |
| Снимок новостей на случай сбоя API | `src/content/fixtures/content-news.json` | `npm run fixtures` |
| Объекты каталога (48 шт.) | **Временное наполнение** со старого сайта → `src/content/objects/*.json`. Для инвестиций будут отдельные объекты (не из admin.stayproperty.com) — тогда меняется только `src/lib/catalog.ts` | `npm run import-legacy` |
| Тексты страниц | `src/pages/**`, `src/content/package-texts.ts`, `src/content/pages/*.html` | вручную |
| Контакты, меню, команда, цифры | `src/lib/site.ts` | вручную |

Слой данных — `src/lib/news.ts` и `src/lib/catalog.ts`: когда объекты переедут в админку/Portfolio, менять только их.

## Страницы

| Адрес | Файл |
|---|---|
| `/` | `src/pages/index.astro` |
| `/o-kompanii/`, `/kontrol-investitsij/`, `/garantii-i-obespechenie/`, `/open_a_company_in_turkey/`, `/contacts/` | `src/pages/<адрес>/index.astro` |
| `/investment-directory/` | каталог с фильтрами |
| `/investment-directory/{rental,startovye,partnerskye,biznes-investitsii}/` | `src/pages/investment-directory/[pkg]/` |
| `/investment-directory/<пакет>/<slug>/` | карточка объекта + калькулятор |
| `/news/`, `/news/<slug>/`, `/news/rss.xml` | лента, статья, RSS |
| `/sitemap.xml`, `/robots.txt` | для поисковиков |
| `/api/lead/` | приём заявок → `LEAD_WEBHOOK_URL` |

Адреса старого сайта сохранены; редиректы — [docs/redirects.md](docs/redirects.md).

## Перед запуском

- [ ] Подтвердить факты из [docs/content-audit.md](docs/content-audit.md#1-подтвердить-у-заказчика-до-запуска)
- [ ] Логотип в SVG → `src/components/Logo.astro`
- [ ] Куда слать заявки → `LEAD_WEBHOOK_URL`
- [ ] Перенести фото объектов с CDN Битрикс24 к себе (ссылки могут протухнуть)
- [ ] `STAY_NOINDEX=0` — открыть для индексации
- [ ] EN / SR версии
