# SOS-Full Stack - Manual de instalación

## Acceso al servidor

- Tipo de acceso: ssh
- Requisitos: usuario - contraseña - ip

`ssh usuario@ip`

## Configuración previa del servidor.

_Si ya cuenta con docker instalado y ya tiene una configuración de nginx customizada se puede saltar hasta la sección de configuración de la aplicación_

### 0. Instalar curl

Necesario para las demás

```bash
sudo apt install curl
```

### 1. Instalación de docker

_Este paso puede variar dependiendo del ambiente de producción y sistema operativo. A continuación se explica la instalación de la aplicación y componentes en el ambiente de Ubuntu 24.04_

- [Documentación oficial](https://docs.docker.com/engine/install/ubuntu/)

Usar la línea de comandos para las ejecutar las siguientes líneas

1.1 **Asegurarse que no haya versiones anteriores instaladas**

```bash
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)
```

1.2 **Instalar repositorio de docker**

```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

1.3 **Instalar docker y sus componentes**

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

1.4 **Verificar instalación**

```bash
sudo docker run hello-world
```

### 2. Instalación y configuración de NGINX

- [Documentación oficial](https://nginx.org/en/linux_packages.html#Ubuntu)

  2.1 **Instalar prerrequisitos y nginx**

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring

curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
https://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx

sudo apt update
sudo apt install nginx
```

2.2 **Verifica que la instalación fue correcta con:**

```bash
sudo nginx -t
sudo systemctl status nginx
```

2.3 **Activar el servicio**
Si en el paso anterior nginx tiene un estado de apagado es necesario activarlo manualmente

```bash
sudo systemctl start nginx
```

### 3. Instalación de nvm, node y npm

- [Documentación oficial](https://www.geeksforgeeks.org/linux-unix/how-to-install-nvm-on-ubuntu-22-04/)

NVM es un paquete que nos ayudará a instalar la versión de node que utilizaremos para el proyecto, ya que este corre en JavaScript

3.1 **Instalar nvm**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

3.2 **Verificar instalación**

```bash
nvm --version
```

**Debe dar una respuesta como 1.2.2**

3.3. **Instalar la versión 25.9 de node**

```bash
nvm install 25.9
```

3.4 **Ver versiones instaladas**

```bash
nvm ls
```

En la lista debería aparecer la versión que se instaló en el paso anterior

3.5 **Seleccionarla como versión predefinida**

```bash
nvm use 25.9
```

3.6 **Verifica la instalación de los programas**

```bash
node --version
npm --version
```

### 4. Instalación de PM2

```bash
npm install -g pm2
```

### 5. Instalación de MongoDB

- [Documentación oficial](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-ubuntu/)

  5.1 **Instalar pre-requisitos**

```bash
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
```

5.2 **Instalar mongoDB**

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

5.3 **Iniciar servicio**

```bash
sudo systemctl start mongod
```

5.4 **Verificar que esté corriendo correctamente**

```bash
sudo systemctl status mongod
```

---

## Configuración de la aplicación

### 1. Clonar el repositorio y acceder a este

```bash
git clone https://github.com/AztlanConsulting/SOS-FullStack.git
cd SOS-FullStack
```

### 2. Iniciar base de datos vectorial

La configuración de la base de datos vectorial se encuentra en el archivo docker-compose.yml, en este se puede cambiar la configuración si se quiere modificar algo como los puertos. Pero la configuración establecida es necesaria para el correcto funcionamiento de la aplicación

2.1 **Levantar el contenedor**

La base de datos vectorial es utilizada para la función de mascotas encontradas.
Es necesario generar la imagen de docker y levantarla para que funcione

```bash
docker compose up
```

Si la configuración de docker fue correcta, este debería ejecutar el archivo dentro del proyecto docker-compose.yml para instalar weaviate e iniciar el contenedor.

2.2 **Verificar que el proceso corre de manera correcta**

```bash
docker ps
```

Debería mostrar los contenedores corriendo por el momento (pythonVector)

### 3. Preparar entornos

3.1 **Correr npm install en los diferentes entornos**

```bash
npm run install:all
```

3.2 **Popular la base de datos con la información pre-definida**

```bash
cd backend
npm run init:mongoDB
```

3.3 **En caso de querer probar el software o correrlo en modo de desarrollo**

- Iniciar el backend con:

```bash
npm run dev
```

- En otra consola correr:

```bash
npm run init:vectorDB
```

3.4 **Variables de entorno**

Volver a la ruta del proyecto de caso de ser necesario con `cd`

```bash
echo    'SERVER_PORT=3000
VECTOR_DB="localhost:8080"
VITE_PAYPAL_CLIENT={your_paypal_key_here}' > .env

echo    'SERVER_PORT=3000
VECTOR_DB="localhost:8080"
FRONT_END_URL="http://localhost:5173"
ENVIRONMENT="sandbox"
PAYPAL_CLIENT={paypal-client}
PAYPAL_SECRET={paypal-secret}
PAYPAL_REDIRECT_BASE_URL="http://localhost:5173"
STRIPE_SECRET_KEY={your_stripe_secret}
STRIPE_WEBHOOK_SECRET={your_stripe_webhook_secret}
TEST_MONGODB_URI={your_mongo_uri}
JWT_ACCESS_SECRET={your_access_secret}
JWT_REFRESH_SECRET={your_refresh_secret}
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173' > ./backend/.env

echo    'VITE_API_BASE_URL="http://localhost:3000"
VITE_ENVIROMENT="sandbox"
VITE_PAYPAL_CLIENT={paypal-client}
VITE_PAYPAL_SECRET={paypal-secret}
VITE_STRIPE_PUBLISHABLE_KEY={stripe-public-key}' > ./frontend/.env
```

3.5 **Configurar variables de entorno con claves reales**

En los diferentes archivos .env se manejan diferentes valores para servicios externos, encriptación o de configuración.
En este caso, aquellos envueltos en llaves son las variables que se tienen que asignar manualmente para el correcto funcionamiento de la aplicación

### 4. Correr el proyecto en desarrollo

Desde la ruta del proyecto correr:
`npm run dev`

O de manera individual:

```bash
# Para front-end
npm run dev --prefix frontend

# O para backend
npm run dev --prefix backend
```

### 5. Estructura del proyecto

/backend: lógica de la aplicación - enlace entre el funcionamiento de la aplicación y la información con el cliente

/frontend: Interface de la aplicación

### 6. Guía de despliegue (Producción)

6.1 **Acceder al servidor:** `ssh usuario@ip`
6.2 **Configuración de servicios**

- Servidor web: Nginx
- Proxy reverso: Si
- Puertos utilizados: 443, 8080, 3000
  6.3 Configuración de nginx

```bash
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

echo 'server {
    listen              443 ssl;
    server_name         dominio;
    ssl_certificate     /etc/letsencrypt/live/dominio/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dominio/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
'> /etc/nginx/sites-available/default

sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl restart nginx
```

6.4 Construir programa para producción

```bash
npm run build

sudo rm -rf /var/www/html/*
sudo cp -r frontend/dist/* /var/www/html/
```

6.5 Correr el proyecto en producción

```bash
pm2 start ecosystem.config.js
```

### 7. Comandos de producción

- Iniciar servidor - pm2 start ecosystem.config.js
- Reiniciar servidor - pm2 restart
- Logs servidor - pm2 logs --lines 100
- Detener servidor - pm2 kill

### 8. Persistencia y ejecución en servidor

8.1 Herramientas de gestión de procesos:

- PM2 para el servidor
- Docker para la galería de mascotas encontradas

### 9. Flujo de actualización

```bash
cd SOS-Fullstack

# Update
git pull
npm run install:all
npm run build

# Restart backend
pm2 restart 0

# Update front-end
sudo rm -rf /var/www/html/*
sudo cp -r frontend/dist/* /var/www/html/

# Restart nginx
sudo systemctl restart nginx
```

### 10. Consideraciones adicionales

El servidor debe tener el puerto 443 abierto al público para funcionar

### 11. TroubleShooting
