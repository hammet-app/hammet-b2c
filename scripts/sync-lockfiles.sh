
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Synchronizing npm and pnpm lockfiles..."

if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm is not installed."
    exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
    echo "Error: pnpm is not installed."
    exit 1
fi

echo "Generating package-lock.json..."
npm install --package-lock-only --ignore-scripts

echo "Generating pnpm-lock.yaml..."
pnpm install --lockfile-only --ignore-scripts

echo "Both lockfiles have been generated successfully."
echo "Review the changes before committing."
