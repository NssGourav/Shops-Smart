#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/Shops-Smart}"
REPO_URL="${REPO_URL:-https://github.com/NssGourav/Shops-Smart.git}"
BRANCH="${BRANCH:-main}"
SERVER_PORT="${SERVER_PORT:-5001}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required on the target machine" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required on the target machine" >&2
  exit 1
fi

mkdir -p "$APP_DIR"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

git -C "$APP_DIR" fetch origin
git -C "$APP_DIR" checkout "$BRANCH"
git -C "$APP_DIR" reset --hard "origin/$BRANCH"

npm --prefix "$APP_DIR/server" ci
npm --prefix "$APP_DIR/server" run db:push
npm --prefix "$APP_DIR/server" run test

if command -v pm2 >/dev/null 2>&1; then
  pm2 describe shopsmart-backend >/dev/null 2>&1 \
    && pm2 restart shopsmart-backend --update-env \
    || pm2 start "$APP_DIR/server/src/index.js" --name shopsmart-backend --update-env
else
  echo "pm2 not found; backend is ready to start with PORT=$SERVER_PORT"
fi
