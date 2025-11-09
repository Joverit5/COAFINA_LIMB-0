#!/usr/bin/env bash
set -euo pipefail


ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"


python -m pip install --upgrade pip
if [ -f requirements.txt ]; then
    python -m pip install -r requirements.txt
fi

echo "Starting uvicorn (main:app) on 127.0.0.1:8000"
exec uvicorn main:app --reload --host 127.0.0.1 --port 8000
