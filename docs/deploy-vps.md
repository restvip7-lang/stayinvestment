# Запуск на своём сервере

Новый сайт ставится **рядом** со старым WordPress на тестовый адрес (например, `new.stayinvestment.com`),
проверяется, и только потом на него переключается основной домен. Старый сайт при этом не трогаем.

Тот же код по-прежнему собирается и на Vercel: площадка выбирается сама (`VERCEL=1` → Vercel, иначе — обычный Node.js-сервер).

## Что нужно на сервере

- Node.js **22.12+** и npm (`node -v`);
- pm2 (`npm i -g pm2`) — держит сайт запущенным и поднимает после перезагрузки;
- nginx (в Plesk уже есть), около **1 ГБ** на диске (сайт с фото ~300 МБ, зависимости для сборки ~500 МБ, кэш картинок новостей — до 200 МБ) и **~200 МБ** памяти под процесс.

Код для сервера — в ветке `vps`: она совпадает с основной веткой разработки (тот же сайт, что на stayinvestment.vercel.app).

## Где картинки

| Что | Где | Зависит от старого сервера? |
|---|---|---|
| Фото команды, страниц, обложки старых статей, шрифты | `public/images`, `public/fonts` — в репозитории | Нет |
| Картинки внутри старых статей (24 файла) | `public/media` — уже перенесены из `stayinvestment.com/wp-content` | Нет |
| Фото объектов каталога (537 шт.) | `public/media` — перенесены с CDN Битрикс24 | Нет |
| Новые новости | Хранилище Stay Property (DigitalOcean Spaces), берутся из админки | Нет |

Откуда взялся каждый файл в `public/media` — в `src/content/media-map.json` (исходная ссылка → файл).
Каждое фото лежит в трёх размерах: `<id>.webp` (до 1600 px), `<id>-960.webp`, `<id>-480.webp` — сайт сам выбирает размер под экран.

Всего в `public/media` 561 фото (≈130 МБ). Если в контент добавятся новые внешние ссылки — перенос: GitHub → Actions → «Перенести картинки к себе» → Run workflow (ветка `vps`),
или на любой машине с интернетом: `npm run localize-media` и закоммитить `public/media` + `src/content`.

## Первая установка (Plesk)

1. **DNS.** В Cloudflare добавить запись `A new → 167.86.66.155` (с оранжевым облаком — через Cloudflare).
2. **Поддомен.** Plesk → stayinvestment.com → «Добавить поддомен» `new`. SSL — Let's Encrypt (или сертификат Cloudflare Origin).
3. **Код** (по SSH под пользователем подписки, в папке поддомена):
   ```bash
   git clone -b vps https://github.com/restvip7-lang/stayinvestment.git .
   npm ci
   npm run build
   ```
4. **Секреты** — файл `.env` в папке проекта (в git не попадает), по образцу `.env.example`:
   `LEAD_WEBHOOK_URL`, `REVALIDATE_SECRET`. `STAY_NOINDEX=1` пока адрес тестовый.
5. **Запуск:**
   ```bash
   pm2 start deploy/ecosystem.config.cjs
   pm2 save
   pm2 startup     # выполнить команду, которую он напечатает, — автозапуск после перезагрузки
   ```
   Проверка: `curl -I http://127.0.0.1:4330/` → `200`.
6. **nginx.** Plesk → поддомен → «Apache и nginx»: выключить «Режим прокси», в «Дополнительные директивы nginx»
   вставить `deploy/nginx-plesk.conf` (поправить путь к папке поддомена).
7. **Сброс кэша новостей раз в сутки** (cron пользователя):
   ```
   0 3 * * * curl -fsS -H "Authorization: Bearer <REVALIDATE_SECRET>" https://new.stayinvestment.com/api/revalidate/ > /dev/null
   ```

Без Plesk — то же самое, только nginx-конфиг кладётся в `server { … }` сайта вместе с `listen`/`ssl`.

## Обновление

```bash
git pull
npm ci
npm run build
pm2 reload stayinvestment
```

## Что проверить на тестовом адресе

- главная, каталог, карточка объекта (галерея, калькулятор), новости, статья, контакты, форма заявки;
- фото открываются с `/media/…`, а не с `cdn-ru.bitrix24.ru` / `stayinvestment.com/wp-content`;
- свежие новости из админки появляются (кэш — до 10 минут);
- заголовок `x-robots-tag: noindex` есть (`curl -I`).

## Переезд на основной домен (потом, отдельным решением)

1. Убедиться, что в `src/content` не осталось ссылок на `stayinvestment.com/wp-content` и `cdn-ru.bitrix24.ru`:
   `grep -rlE "wp-content|bitrix24" src/content` — пусто.
2. Переключить домен `stayinvestment.com` на новый сайт, `STAY_NOINDEX=0`, `pm2 reload stayinvestment`.
3. Старые адреса уже перенаправляются (`src/lib/redirects.ts`, [docs/redirects.md](redirects.md)).
4. Старый WordPress оставить выключенным, но не удалять, пока не проверим поиск и заявки.
