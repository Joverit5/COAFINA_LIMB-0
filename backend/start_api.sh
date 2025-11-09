#!/bin/bash

# === Levantar el servicio FastAPI en segundo plano ===
echo "Iniciando servidor FastAPI en puerto 8000..."
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > fastapi.log 2>&1 &

# Esperar unos segundos para asegurarnos de que el servidor arranca
sleep 5

# === Iniciar túnel de Cloudflare ===
echo "Iniciando túnel de Cloudflare..."
nohup cloudflared tunnel --url http://localhost:8000 > cloudflared.log 2>&1 &

echo "✅ Servidor FastAPI y túnel de Cloudflare iniciados correctamente."