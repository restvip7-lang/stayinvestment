#!/usr/bin/env bash
# Автовыкладка на сервере (Plesk 167.86.66.155): cron раз в минуту.
# Если в origin/main появился новый коммит — сборка в отдельной папке и переключение current на неё.
# Неудачная сборка не трогает работающий сайт: current остаётся на прошлой версии.
#   bash deploy/deploy.sh            — выложить, если есть новый коммит
#   bash deploy/deploy.sh --force    — пересобрать текущий main
set -euo pipefail

BASE="${STAY_APP_BASE:-$HOME/stayinvestment-app}"     # repo/ (git) · releases/<sha>/ · current → releases/<sha>
[[ -f "$BASE/deploy.env" ]] && . "$BASE/deploy.env"   # настройки этого сервера: STAY_NODE_BIN, STAY_RUN — не в git
NODE_BIN="${STAY_NODE_BIN:-/opt/plesk/node/24/bin}"   # нужна Node 22.12+ (требование Astro)
KEEP=3
export PATH="$NODE_BIN:$PATH"

mkdir -p "$BASE/releases" "$BASE/logs"
exec 9>"$BASE/.deploy.lock"
flock -n 9 || exit 0

cd "$BASE/repo"
git fetch -q origin main
NEW="$(git rev-parse origin/main)"
CUR="$(cat "$BASE/current/REVISION" 2>/dev/null || true)"
[[ "$NEW" == "$CUR" && "${1:-}" != "--force" ]] && exit 0

echo "$(date '+%F %T') сборка ${NEW:0:7}"
REL="$BASE/releases/$NEW"
rm -rf "$REL" && mkdir -p "$REL"
git archive "$NEW" | tar -x -C "$REL"
cd "$REL"
npm ci --no-audit --no-fund --loglevel=error
npm run build
echo "$NEW" > REVISION

ln -sfn "$REL" "$BASE/current"
if [[ "${STAY_RUN:-passenger}" == "process" ]]; then
  bash "$REL/deploy/run.sh" restart                                       # сайт обычным процессом (deploy/run.sh)
else
  mkdir -p "$BASE/current/tmp" && touch "$BASE/current/tmp/restart.txt"   # Passenger (Plesk Node.js) перезапускает приложение
fi
echo "$(date '+%F %T') выложено ${NEW:0:7}"

# старые версии — оставить последние $KEEP
ls -1dt "$BASE"/releases/*/ | tail -n +$((KEEP + 1)) | xargs -r rm -rf
