#!/bin/bash
# ========================================
# CONFIGURACIÓN AUTOMÁTICA DE FASTAPI + HTTPS (DUCKDNS)
# Proyecto: COAFINA_LIMB-0/backend
# ========================================

DOMAIN="api-limb-0.duckdns.org"
APP_DIR="/home/user/COAFINA_LIMB-0/backend"
APP_MODULE="main:app"
PORT=8000
EMAIL="fabiancquinterop@gmail.com" 

echo "🚀 Iniciando configuración para $DOMAIN"

# --- 1. Actualizar paquetes e instalar dependencias ---
sudo apt update -y
sudo apt install -y python3-pip nginx certbot python3-certbot-nginx ufw

# --- 2. Instalar dependencias de Python ---
pip install fastapi uvicorn

# --- 3. Habilitar firewall ---
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw allow 8000
sudo ufw --force enable

# --- 4. Crear servicio systemd para FastAPI ---
SERVICE_FILE="/etc/systemd/system/fastapi.service"

sudo bash -c "cat > $SERVICE_FILE" <<EOL
[Unit]
Description=FastAPI COAFINA_LIMB-0 backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/python3 -m uvicorn $APP_MODULE --host 0.0.0.0 --port $PORT
Restart=always

[Install]
WantedBy=multi-user.target
EOL

sudo systemctl daemon-reload
sudo systemctl enable fastapi
sudo systemctl restart fastapi
echo "✅ Servicio FastAPI iniciado."

# --- 5. Configurar NGINX ---
NGINX_FILE="/etc/nginx/sites-available/$DOMAIN"

sudo cp "$APP_DIR/api-limb-0" "$NGINX_FILE"
sudo ln -sf "$NGINX_FILE" /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
echo "✅ NGINX configurado correctamente."

# --- 6. Obtener certificados SSL con Let's Encrypt ---
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL

# --- 7. Recargar NGINX con SSL activo ---
sudo systemctl reload nginx
echo "✅ Certificado SSL generado correctamente."

# --- 8. Mostrar estado final ---
sudo systemctl status fastapi --no-pager
echo "🎉 API disponible en: https://$DOMAIN"