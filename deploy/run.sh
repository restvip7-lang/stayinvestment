#!/usr/bin/env bash
# Сайт обычным процессом Node.js — для сервера, где в Plesk нет Node.js 22+ (см. deploy/README.md, «Без администратора»).
# Процесс слушает только 127.0.0.1; наружу его отдаёт Apache по правилу из deploy/htaccess-proxy.txt.
#   bash deploy/run.sh            — запустить, если не запущен (cron раз в минуту: поднимает после сбоя и перезагрузки)
#   bash deploy/run.sh restart    — перезапустить (после выкладки это делает deploy.sh)
#   bash deploy/run.sh stop | status
set -euo pipefail

BASE="${STAY_APP_BASE:-$HOME/stayinvestment-app}"
[[ -f "$BASE/deploy.env" ]] && . "$BASE/deploy.env"    # STAY_NODE_BIN, STAY_PORT — настройки этого сервера, не в git
NODE_BIN="${STAY_NODE_BIN:-$HOME/node24/bin}"
PORT="${STAY_PORT:-4330}"
PIDFILE="$BASE/app.pid"
export PATH="$NODE_BIN:$PATH"
mkdir -p "$BASE/logs"

pid() { cat "$PIDFILE" 2>/dev/null || true; }
running() {
  local p; p="$(pid)"
  [[ -n "$p" ]] && grep -qa 'dist/server/entry.mjs' "/proc/$p/cmdline" 2>/dev/null
}
stop() {
  running || return 0
  local p; p="$(pid)"
  kill "$p" 2>/dev/null || true
  for _ in $(seq 1 50); do running || break; sleep 0.2; done
  running && kill -9 "$p" 2>/dev/null || true
  rm -f "$PIDFILE"
}
start() {
  cd "$BASE/current"                                    # symlink → releases/<коммит>; отсюда же читается REVISION
  # Переменные сайта (LEAD_WEBHOOK_URL, REVALIDATE_SECRET, STAY_NOINDEX, IMG_CACHE_DIR) — в $BASE/app.env, не в git
  HOST=127.0.0.1 PORT="$PORT" NODE_ENV=production \
    nohup node --env-file-if-exists="$BASE/app.env" dist/server/entry.mjs >> "$BASE/logs/app.log" 2>&1 8>&- 9>&- &   # 8, 9 — замки run.sh и deploy.sh, процессу сайта их не оставляем
  echo $! > "$PIDFILE"
  for _ in $(seq 1 50); do
    curl -fsS -o /dev/null -m 2 "http://127.0.0.1:$PORT/version.txt" 2>/dev/null && { echo "$(date '+%F %T') запущен, порт $PORT, версия $(cat REVISION 2>/dev/null | cut -c1-7)"; return 0; }
    sleep 0.2
  done
  echo "$(date '+%F %T') не отвечает на порту $PORT — см. $BASE/logs/app.log" >&2
  return 1
}

exec 8>"$BASE/.run.lock"
flock -w 30 8 || exit 0

case "${1:-ensure}" in
  ensure)  running || start ;;
  restart) stop; start ;;
  stop)    stop ;;
  status)  running && echo "работает, pid $(pid)" || { echo "не запущен"; exit 1; } ;;
  *) echo "usage: run.sh [ensure|restart|stop|status]" >&2; exit 2 ;;
esac
