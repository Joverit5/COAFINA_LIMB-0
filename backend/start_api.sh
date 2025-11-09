#!/bin/bash
=============================================
🚀 start_fastapi_tunnel.sh
Levanta FastAPI y crea un túnel HTTPS con Cloudflare
=============================================
Ruta al backend (ajusta si tu main.py está en otro lugar)
APP_PATH="/home/$(whoami)/COAFINA_LIMB-0/backend"
APP_FILE="main:app"
PORT=8000

echo "============================================="
echo "🌐 Iniciando servicio FastAPI en el puerto $PORT..."
echo "============================================="

Moverse al directorio del backend
cd "$APP_PATH" || { echo "❌ No se encontró el directorio $APP_PATH"; exit 1; }

Matar cualquier proceso previo de uvicorn (opcional)
pkill -f "uvicorn" >/dev/null 2>&1

Iniciar FastAPI en segundo plano
nohup uvicorn "$APP_FILE" --host 0.0.0.0 --port $PORT > fastapi.log 2>&1 &

Esperar unos segundos para asegurar que esté arriba
sleep 3

Verificar si se levantó correctamente
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

Ejecutar túnel Cloudflare
cloudflared tunnel --url "http://localhost:$PORT"
