# Stay Investment — сайт

Новый сайт [stayinvestment.com](https://stayinvestment.com): инвестиции в недвижимость Турции, направление группы Stay Property.
Структура и тексты перенесены со старого сайта на WordPress и отредактированы ([docs/content-audit.md](docs/content-audit.md)),
дизайн — в фирменном стиле Stay Property (как stayproperty.com: шрифт Euclid Circular A по лицензии группы, `public/fonts/`; токены — `src/styles/global.css`). Стек — как у соседнего сайта `stay.com.tr`: **Astro 7 + Tailwind 4, SSR**. Один и тот же код собирается под свой сервер (Node.js, Plesk) и под Vercel (тестовая копия) — площадку выбирает `astro.config.mjs`.

## Запуск

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # сборка: на Vercel — под Vercel, иначе Node.js-сервер (dist/)
npm start          # запуск собранного сайта на своём сервере (127.0.0.1:4330)
npm run optimize-images # сжать свои картинки из public/images в public/media
npm run localize-media  # перенести внешние картинки в public/media
npm run check      # проверка типов
```

Переменные окружения — в [.env.example](.env.example).

## Откуда берутся данные

| Что | Источник | Обновление |
|---|---|---|
| Новости (свежие) | Админка Stay Property: `GET https://admin.stayproperty.com/api/content/news?language=ru` | Сами: кэш 10 мин, CDN — 10 мин + stale-while-revalidate. Мгновенно — `POST /api/revalidate/` с `Authorization: Bearer $REVALIDATE_SECRET` |
| Новости (архив, 26 шт.) | Старый сайт → `src/content/legacy-news/*.json` | `npm run import-legacy` |
| Снимок новостей на случай сбоя API | `src/content/fixtures/content-news.json` | `npm run fixtures` |
| Объекты каталога (48 шт.) | **Временное наполнение** со старого сайта → `src/content/objects/*.json`. Для инвестиций будут отдельные объекты (не из admin.stayproperty.com) — тогда меняется только `src/lib/catalog.ts` | `npm run import-legacy` |
| Все картинки сайта | Лежат у нас: `public/media` — WebP в размерах 240 / 480 / 960 / до 1600 px. Фото объектов и старых статей перенесены с Битрикс24 и старого сайта (`src/content/media-map.json` — откуда каждое), свои картинки из `public/images` сжимаются туда же. Какие размеры есть — `src/content/media-manifest.json`; подстановка — `src/lib/img.ts` | `npm run optimize-images` — после замены или добавления своих картинок; `npm run localize-media` — если в контенте появились внешние ссылки на фото |
| Картинки новостей из админки | Хранилище Stay Property; сжимаются и кэшируются на нашей стороне: на Vercel — его оптимизатор, на своём сервере — `/img/` с кэшем на диске (`src/pages/img/index.ts`) | сами |
| Тексты страниц | `src/pages/**`, `src/content/package-texts.ts`, `src/content/pages/*.html` | вручную |
| Контакты, меню, команда, цифры | `src/lib/site.ts` | вручную |

Слой данных — `src/lib/news.ts` и `src/lib/catalog.ts`: когда объекты переедут в админку/Portfolio, менять только их.

## Языки

Русский (основной, без префикса), английский `/en/…` и сербский латиницей `/sr/…` — подробности в [src/i18n/index.ts](src/i18n/index.ts).

| Что | Где |
|---|---|
| Тексты интерфейса и страниц | `tr('Русская фраза')` в коде → перевод в `src/i18n/en.json`, `src/i18n/sr.json` (ключ — русский текст) |
| Проверка, что ничего не забыто | `node scripts/i18n-keys.mjs` — сколько фраз без перевода; `--missing en` — список |
| Тексты разделов каталога | `src/content/package-texts.ts` (+ `.en.ts`, `.sr.ts`) |
| Инструкция «Как открыть компанию» | `src/content/pages/open-company.html` (+ `.en.html`, `.sr.html`) |
| Объекты и старые статьи | поле `i18n` в JSON — переводы со старого сайта (`npm run import-legacy-i18n`): объекты — все 48 на en и sr, статьи — 9 на en |
| Архивные статьи, переведённые нами | 5 актуальных статей на en, 6 на sr — исходники в `src/content/legacy-news-i18n/`, применить: `python3 scripts/apply-archive-translations.py src/content/legacy-news-i18n` (после `npm run import-legacy` — обязательно) |
| Свежие новости | админка Stay Property отдаёт ru/en/sr сама |

Статьи архива без перевода и устаревшие (`"outdated": true` в JSON — новости с датами, законы, цены прошлых лет) на английской и сербской версии в ленте не показываются; по прямой ссылке открываются по-русски с пометкой и `noindex`.
Старые адреса `/en/…` и `/sr/…` перенаправляются на новые (`src/lib/redirects.ts`, `src/content/legacy-redirects-i18n.json`).

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

## Ветки и выкладка

Рабочий репозиторий — `stayproperty-org/stayinvestment`:

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

Ручная установка без автовыкладки (pm2 + nginx), где лежат картинки, переезд с WordPress — [docs/deploy-vps.md](docs/deploy-vps.md).

## Перед запуском

- [ ] Подтвердить факты из [docs/content-audit.md](docs/content-audit.md#1-подтвердить-у-заказчика-до-запуска)
- [ ] Логотип в SVG → `src/components/Logo.astro`
- [ ] Куда слать заявки → `LEAD_WEBHOOK_URL`
- [ ] `STAY_NOINDEX=0` — открыть для индексации

## Репозитории

- **Рабочий репозиторий организации:** `stayproperty-org/stayinvestment` — ветки `dev` и `main`, см. «Ветки и выкладка».
- **Черновой:** `restvip7-lang/stayinvestment`, ветка `claude/practical-shannon-z1pifq` — отсюда собирается тестовая копия
  на Vercel (stayinvestment.vercel.app). В рабочий репозиторий правки отсюда уходят **только по команде владельца**,
  в `dev`, с компьютера с доступом `staymng-bit`, без перезаписи истории:
  `git push https://staymng-bit@github.com/stayproperty-org/stayinvestment.git <коммит>:refs/heads/dev`.
  Если в `dev` появились чужие коммиты, GitHub откажет — сначала их нужно влить в отправляемую версию.
  То же самое одним запуском на Windows — `deploy/push-to-work.bat`: забирает свежую версию, отправляет в `dev` и открывает страницу запроса `dev` → `main`.
- То же самое умеет GitHub Actions → «Отправить в рабочий репозиторий» (`.github/workflows/push-to-work-repo.yml`),
  если задан секрет `ORG_PUSH_TOKEN` (fine-grained токен `staymng-bit`, Contents: Read and write).
