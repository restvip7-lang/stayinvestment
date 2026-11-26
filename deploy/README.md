# Выкладка на сервер (Plesk 167.86.66.155)

Сайт — Node-приложение Astro (`dist/server/entry.mjs`), запускает его Plesk (Node.js / Passenger).
Выкладка — на самом сервере: cron раз в минуту запускает `deploy/deploy.sh`, тот смотрит `origin/main`
и при новом коммите собирает его в `releases/<коммит>/` и переключает `current` на новую сборку.
Сборка упала — сайт остаётся на прошлой версии, монитор видит старый номер на `/version.txt` и пишет в Telegram.

Сборка на сервере — обычная `npm run build`: без переменной `VERCEL` Astro собирает Node-приложение (`astro.config.mjs`).
Тот же код собирается и на Vercel — там тестовая копия сайта.

```
~/stayinvestment-app/
  repo/                 git clone (только для fetch и git archive)
  releases/<коммит>/    сборки, хранятся 3 последние
  current → releases/…  корень приложения в Plesk
  logs/deploy.log
```

## Один раз — в панели Plesk (администратор сервера)

1. Обновления → компоненты: **Node.js 24** (или 22; Astro нужна Node ≥ 22.12, сейчас стоят только 20 и 21).
2. Подписка stayinvestment.com → «Доступ по SSH»: **/bin/bash** вместо chroot (в chroot нет git, npm, tar, cron).
3. Поддомен для проверки до переключения, например **new.stayinvestment.com** (DNS — запись A в Cloudflare на 167.86.66.155 с прокси).
4. Поддомен → Node.js: версия 24, корень приложения `~/stayinvestment-app/current`, файл запуска `dist/server/entry.mjs`,
   переменные окружения — из `.env.example` (`STAY_CONTENT_API`, `LEAD_WEBHOOK_URL`, `REVALIDATE_SECRET`, `STAY_NOINDEX`),
   плюс `IMG_CACHE_DIR=/var/www/vhosts/stayinvestment.com/stayinvestment-app/img-cache` (путь к домашней папке подписки уточнить) —
   иначе кэш сжатых картинок новостей лежит внутри сборки и пропадает с каждой выкладкой.
5. Поддомен → «Apache и nginx» → дополнительные директивы nginx: правила долгого кэша для `/media`, `/fonts`, `/_astro`
   из `deploy/nginx-plesk.conf` (только блоки `location` с заголовками; проксирование делает сам Plesk).

Место на диске: одна сборка — около 0,8 ГБ (фото сайта ~140 МБ в двух копиях + зависимости), хранятся 3 последние.

## Один раз — по SSH под пользователем подписки

```bash
ssh-keygen -t ed25519 -f ~/.ssh/stayinvestment_deploy -N ''   # ключ только на чтение репозитория
# публичный ключ → GitHub: репозиторий → Settings → Deploy keys (без права записи)
mkdir -p ~/stayinvestment-app && cd ~/stayinvestment-app
GIT_SSH_COMMAND='ssh -i ~/.ssh/stayinvestment_deploy' git clone git@github.com:stayproperty-org/stayinvestment.git repo
git -C repo config core.sshCommand 'ssh -i ~/.ssh/stayinvestment_deploy'
bash repo/deploy/deploy.sh --force
( crontab -l 2>/dev/null; echo '* * * * * bash $HOME/stayinvestment-app/repo/deploy/deploy.sh >> $HOME/stayinvestment-app/logs/deploy.log 2>&1' ) | crontab -
```

`deploy.sh` берётся из `repo/` — сам себя обновляет вместе с `main` (со следующего запуска).

## Переключение домена

Когда сайт на поддомене проверен: Node.js-приложение — на stayinvestment.com, WordPress — бэкап на Synology и удаление с сервера.

## Без администратора: Node.js в домашней папке

Если поставить Node.js 22+ в Plesk некому (на сервере только 20 и 21), всё то же делается под пользователем подписки.
Отличия от схемы выше: Node.js лежит в домашней папке, сайт работает обычным процессом на `127.0.0.1:4330`
(`deploy/run.sh`), а поддомен отдаёт его через Apache (`deploy/htaccess-proxy.txt`). Автовыкладка — тот же `deploy.sh`.

Нужно: SSH `/bin/bash` (Plesk → Hosting → SSH access), в Apache включены `proxy` и `proxy_http` (на этом сервере включены).

```bash
# 1. Node.js 24 в домашнюю папку (≈200 МБ, права root не нужны)
cd ~ && curl -fsSLO https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt
F=$(grep -o 'node-v[0-9.]*-linux-x64.tar.xz' SHASUMS256.txt | head -1)
curl -fsSLO "https://nodejs.org/dist/latest-v24.x/$F" && grep " $F\$" SHASUMS256.txt | sha256sum -c -
mkdir -p ~/node24 && tar -xJf "$F" -C ~/node24 --strip-components=1 && rm "$F" SHASUMS256.txt && ~/node24/bin/node -v

# 2. Настройки этого сервера (в git не попадают)
mkdir -p ~/stayinvestment-app/logs
printf 'STAY_NODE_BIN=%s/node24/bin\nSTAY_RUN=process\nSTAY_PORT=4330\n' "$HOME" > ~/stayinvestment-app/deploy.env
printf 'STAY_NOINDEX=1\nIMG_CACHE_DIR=%s/stayinvestment-app/img-cache\n' "$HOME" > ~/stayinvestment-app/app.env
# в app.env позже дописать LEAD_WEBHOOK_URL=… и REVALIDATE_SECRET=…

# 3. Ключ для чтения репозитория, клон и первая сборка — как в разделе выше (ssh-keygen … deploy.sh --force)

# 4. cron: автовыкладка и присмотр за процессом (поднимает после сбоя и перезагрузки сервера)
( crontab -l 2>/dev/null
  echo '* * * * * bash $HOME/stayinvestment-app/repo/deploy/deploy.sh >> $HOME/stayinvestment-app/logs/deploy.log 2>&1'
  echo '* * * * * bash $HOME/stayinvestment-app/current/deploy/run.sh >> $HOME/stayinvestment-app/logs/deploy.log 2>&1'
) | crontab -
```

5. Plesk → «Add Subdomain» (например, `new`), DNS — запись A в Cloudflare. В корневую папку поддомена положить
   `deploy/htaccess-proxy.txt` под именем `.htaccess`; других файлов в ней быть не должно.

Проверка на сервере: `curl -s http://127.0.0.1:4330/version.txt` — номер коммита `main`; `bash ~/stayinvestment-app/current/deploy/run.sh status`.
Снять всё: убрать две строки из `crontab -e`, `run.sh stop`, удалить `~/stayinvestment-app`, `~/node24` и поддомен. Старый сайт (`httpdocs`) эта схема не трогает.
