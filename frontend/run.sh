#!/usr/bin/env sh
set -eu

APP_DIR="${APP_DIR:-/app}"
NODE_MAJOR="${NODE_MAJOR:-20}"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

install_nodejs() {
  echo "Node.js/npm/npx is missing. Installing Node.js ${NODE_MAJOR}.x..."

  if command_exists apt-get; then
    apt-get update
    apt-get install -y --no-install-recommends ca-certificates curl gnupg
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list
    apt-get update
    apt-get install -y nodejs
    rm -rf /var/lib/apt/lists/*
  elif command_exists apk; then
    apk add --no-cache nodejs npm
  else
    echo "Unsupported base image: cannot install Node.js automatically." >&2
    exit 1
  fi
}

cd "$APP_DIR"

if ! command_exists node || ! command_exists npm || ! command_exists npx; then
  install_nodejs
fi

if ! command_exists node || ! command_exists npm || ! command_exists npx; then
  echo "Node.js, npm, or npx is still missing after installation." >&2
  exit 1
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo "npx version: $(npx --version)"

if [ ! -d node_modules ]; then
  echo "node_modules not found. Installing dependencies with npm i..."
  npm i
else
  echo "node_modules found. Skipping npm i."
fi

echo "Starting React app..."
exec npm start
