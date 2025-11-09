#!/bin/bash

APP_PATH="/home/$(whoami)/COAFINA_LIMB-0/backend"
APP_FILE="main:app"
PORT=8000

echo "============================================="
echo "🌐 Iniciando servicio FastAPI en el puerto $PORT..."
echo "============================================="


cd "$APP_PATH" || { echo "❌ No se encontró el directorio $APP_PATH"; exit 1; }


if pgrep -f "uvicorn" > /dev/null; then
    echo "✅ FastAPI se está ejecutando correctamente en el puerto $PORT"
else
    echo "❌ Error al iniciar FastAPI. Revisa fastapi.log"
    exit 1
fi

echo
echo "============================================="
echo "🔗 Creando túnel HTTPS con Cloudflare..."
echo "============================================="

cloudflared tunnel --url "http://localhost:$PORT"
