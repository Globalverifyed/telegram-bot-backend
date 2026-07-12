#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="Globalverifyed_bot"
BRANCH="main"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$PROJECT_DIR"
echo "[deploy] Project: $PROJECT_DIR"
echo "[deploy] Branch:  $BRANCH"

if [[ ! -d .git ]]; then
  echo "[deploy] ERROR: $PROJECT_DIR is not a Git repository." >&2
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "[deploy] ERROR: Missing $PROJECT_DIR/.env" >&2
  exit 1
fi

command -v git >/dev/null || { echo "[deploy] ERROR: git is not installed" >&2; exit 1; }
command -v npm >/dev/null || { echo "[deploy] ERROR: npm is not installed" >&2; exit 1; }
command -v pm2 >/dev/null || { echo "[deploy] ERROR: pm2 is not installed" >&2; exit 1; }

# Runtime data under data/*.json and .env are ignored by Git and remain untouched.
git fetch --prune origin "$BRANCH"
git reset --hard "origin/$BRANCH"

npm ci --omit=dev

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start ecosystem.config.js --env production
fi

sleep 3
STATUS="$(pm2 jlist | node -e '
let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{
 const apps=JSON.parse(s); const app=apps.find(a=>a.name===process.argv[1]);
 process.stdout.write(app?.pm2_env?.status || "missing");
});
' "$APP_NAME")"

if [[ "$STATUS" != "online" ]]; then
  echo "[deploy] ERROR: $APP_NAME status is $STATUS" >&2
  pm2 logs "$APP_NAME" --lines 80 --nostream || true
  exit 1
fi

pm2 save
echo "[deploy] SUCCESS: $APP_NAME is online."
pm2 status "$APP_NAME"
