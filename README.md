# SOS-Full Stack - Manual de instalación

## 1. Arquitectura general del sistema

### 1.1 Estructura del proyecto

```bash
/backend
    /backend/src/config # Configuración para pruebas
    /backend/src/domain # Manejo de datos e información
        /backend/src/domain/models
        /backend/src/domain/ports
        /backend/src/domain/repositories
    /backend/src/infrastructure # Conección con servicios externos y base de datos
        /backend/src/infrastructure/api
        /backend/src/infrastructure/data-access
        /backend/src/infrastructure/databasse
        /backend/src/infrastructure/service
    /backend/src/interface # Controladores y enrutadores
        /backend/src/interface/controllers
        /backend/src/interface/middleware
        /backend/src/interface/routes
    /backend/src/queues # Cola de trabajos para publicar en redes
    /backend/src/test # Pruebas unitarias y de integración
    /backend/src/types # Tipado para TS
    /backend/src/use-case # Lógica por función
        /backend/src/use-case/auth
        /backend/src/use-case/blogs
        /backend/src/use-case/clients
        /backend/src/use-case/emails
        /backend/src/use-case/images
        /backend/src/use-case/manuals
        /backend/src/use-case/members-only
        /backend/src/use-case/plans
        /backend/src/use-case/workshops
        /backend/src/use-case/foundPet
        /backend/src/use-case/ip
        /backend/src/use-case/payments
        /backend/src/use-case/purchases
    /backend/src/utils # Herramientas reutilizables
/frontend
    /frontend/src/assets # Archivos estáticos de la aplicación
        /frontend/src/assets/audio
        /frontend/src/assets/images
    /frontend/src/features # Componentes visuales y lógica por función
        /frontend/src/features/auth
        /frontend/src/features/blog
        /frontend/src/features/client
        /frontend/src/features/fount-pet
        /frontend/src/features/graphs
        /frontend/src/features/landing
        /frontend/src/features/manuals
        /frontend/src/features/map
        /frontend/src/features/members-only
        /frontend/src/features/payment
        /frontend/src/features/petCollection
        /frontend/src/features/plans
        /frontend/src/features/poster
        /frontend/src/features/purchases
        /frontend/src/features/users
        /frontend/src/features/workshop
    /frontend/src/pages # Puntos de entrada para las interfaces / diferentes funciones
    /frontend/src/routes # Enrutamiento del lado del cliente
    /frontend/src/shared # Componentes compartidos entre diferentes funciones / reutilización
    /frontend/src/test # Pruebas
```

### 1.2 Módulos del sistema

| Módulos      | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| auth         | Autenticación y autorización de los usuarios                      |
| blogs        | Blogs y noticias de la socia para informar a usuarios             |
| clients      | Clientes que han contratado un plan o se han registrado           |
| emails       | Mandar correos electrónicos de compra                             |
| images       | Manejo de imágenes de mascotas                                    |
| manuals      | Cursos de la socia a la venta                                     |
| members-only | Información de portal exclusivo                                   |
| plans        | Planes de contratación                                            |
| workshops    | Talleres a la venta                                               |
| foundPet     | Mascotas encontradas por terceros                                 |
| ip           | Identificación de lugar de procedencia y precio para los usuarios |
| payments     | Procesamiento de pagos                                            |
| purchases    | Registro de transacciones                                         |

## 2 Tecnologías utilizadas

| Tecnología utilizada  | Descripción                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| Express               | Backend de la aplicación                                                   |
| React                 | Frontend de la aplicación                                                  |
| Docker                | Contenedor para correr otras de las tecnologías utilziadas                 |
| Typescript            | Javascript con tipado para mayor facilidad de desarrollo y documentación   |
| Git                   | Control de versiones                                                       |
| MongoDB               | Base de datos por colecciones                                              |
| Redis                 | Cache para manejar queues                                                  |
| Weaviate              | Base de datos vectorial                                                    |
| eslint                | Análisis de código para mejorar la calidad de este                         |
| prettier              | Asegura que el código siga un formato                                      |
| husky                 | Asegura que el código cumpla con los estándares antes de unirse con github |
| Stripe                | Procesamiento de pagos tarjeta / oxxo / spei                               |
| Paypal                | Procesamiento de pagos paypal                                              |
| axios                 | Peticiones http                                                            |
| bcryptjs              | Encriptación de contraseñas                                                |
| cors                  | Seguridad                                                                  |
| dotenv                | Configuración de la aplicación mediante archivos .env                      |
| ioredis               | Comunicación con Redis                                                     |
| jsonwebtokens         | Tokens de sesión para los clientes autenticados                            |
| mongoose              | Cliente para comunicación con base de datos MongoDB                        |
| multer                | Recibir archivos desde el cliente en peticiones                            |
| nodemailer            | Mandar correos electrónicos                                                |
| zod                   | Seguridad - verifica la información que se manda del front-end al backend  |
| cookie-parser         | Guardar información de cookies para usuarios                               |
| jest                  | Pruebas automáticas                                                        |
| supertest             | Pruebas de integración                                                     |
| graphql               | Necesario para weaviate - peticiones                                       |
| mongodb-memory-server | Pruebas de integración                                                     |
| html-to-image         | Convertir componentes html a imágenes                                      |
| jspdf                 | Generación de pdfs desde el cliente                                        |
| leaflet               | Autocompletar ubicación                                                    |
| recharts              | Gráficas                                                                   |
| tailwind              | Estilo de la interface                                                     |
| vite                  | Bundler para aplicaciones de react                                         |
| vitest                | Pruebas                                                                    |
| Open Street Map       | Mapa de ubicación del usuario                                              |

## 3. Requisitos previos

### 3.1 Asegurece de tener las siguientes herramientas instaladas

**Correr el proyecto**

- Curl
- Docker
- Node y NPM
- MongoDB

**Despliegue**

- NGINX
- PM2

#### 3.1.1 Curl

Necesario para las demás

```bash
sudo apt install curl
```

#### 3.1.2 Instalación de docker

_Este paso puede variar dependiendo del ambiente de producción y sistema operativo. A continuación se explica la instalación de la aplicación y componentes en el ambiente de Ubuntu 24.04_

- [Documentación oficial](https://docs.docker.com/engine/install/ubuntu/)

Usar la línea de comandos para las ejecutar las siguientes líneas

1 **Asegurarse que no haya versiones anteriores instaladas**

```bash
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)
```

2 **Instalar repositorio de docker**

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

3 **Instalar docker y sus componentes**

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

4 **Verificar instalación**

```bash
sudo docker run hello-world
```

#### 3.1.3 Instalación y configuración de NGINX

- [Documentación oficial](https://nginx.org/en/linux_packages.html#Ubuntu)

  1 **Instalar prerrequisitos y nginx**

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

2 **Verifica que la instalación fue correcta con:**

```bash
sudo nginx -t
sudo systemctl status nginx
```

3 **Activar el servicio**
Si en el paso anterior nginx tiene un estado de apagado es necesario activarlo manualmente

```bash
sudo systemctl start nginx
```

#### 3.1.4 Instalación de nvm, node y npm

- [Documentación oficial](https://www.geeksforgeeks.org/linux-unix/how-to-install-nvm-on-ubuntu-22-04/)

NVM es un paquete que nos ayudará a instalar la versión de node que utilizaremos para el proyecto, ya que este corre en JavaScript

1 **Instalar nvm**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

2 **Verificar instalación**

```bash
nvm --version
```

**Debe dar una respuesta como 1.2.2**

**Instalar la versión 25.9 de node**

```bash
nvm install 25.9
```

4 **Ver versiones instaladas**

```bash
nvm ls
```

En la lista debería aparecer la versión que se instaló en el paso anterior

5 **Seleccionarla como versión predefinida**

```bash
nvm use 25.9
```

6 **Verifica la instalación de los programas**

```bash
node --version
npm --version
```

#### 3.1.5 Instalación de PM2

```bash
npm install -g pm2
```

#### 3.1.6 Instalación de MongoDB

- [Documentación oficial](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-ubuntu/)

  1 **Instalar pre-requisitos**

```bash
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
```

2 **Instalar mongoDB**

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

3 **Iniciar servicio**

```bash
sudo systemctl start mongod
```

4 **Verificar que esté corriendo correctamente**

```bash
sudo systemctl status mongod
```

### 3.2. Acceso al servidor

- Tipo de acceso: ssh
- Requisitos: usuario - contraseña - ip

`ssh usuario@ip`

## 4. Estructura del proyecto

El sistema tiene dos capas principales - backend y frontend

- /backend

Capa que maneja la lógica y conección con bases de datos y servicios de la aplciación
**Arqutiectura:** MVC
La arquitectura del sistema es Modelo, Vista, Controlador. De manera que la vista está manejada completamente por el área de /frontend, controlador es la lógica, utilizando las capas de Interface-UseCase-Infraestructura para las conecciones entre peticiones y la base de datos, que es parte de Dominio-Infraestructura

- /frontend

Parte de la arquitectura MVC y maneja únciamente la interface y las peticiones que se hacen en el backend.

## 5. Configuración del entorno local

```bash
git clone https://github.com/AztlanConsulting/SOS-FullStack.git
cd SOS-FullStack
```

### 5.1 Configuración de docker

La configuración de la base de datos vectorial y la cola de tareas, se encuentra en el archivo docker-compose.yml, en este se puede cambiar la configuración si se quiere modificar algo como los puertos. Pero la configuración establecida es necesaria para el correcto funcionamiento de la aplicación por defecto.

5.1.1 **Levantar el contenedor**

La base de datos vectorial es utilizada para la función de mascotas encontradas.
Es necesario generar la imagen de docker y levantarla para que funcione

```bash
docker compose up -d
```

Si la configuración de docker fue correcta, este debería ejecutar el archivo dentro del proyecto docker-compose.yml para instalar weaviate e iniciar el contenedor.

5.1.2 **Verificar que el proceso corre de manera correcta**

```bash
docker ps
```

Debería mostrar los contenedores corriendo por el momento (pythonVector)

### 5.2 Instalación de dependencias

5.2.1 **Correr npm install en los diferentes entornos**

```bash
npm install
npm run install:all

npm install -g pm2
```

### 5.3 Variables de entorno

| Nota: Usar archivo script que se distribuye de manera segura y directa

Linux / Mac: `create.env.prod.sh`
Windows: `create.env.prod.bat`

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
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hola@sosencontrandomascotas.com
SMTP_PASS={password}
REDIS_HOST=localhost
REDIS_PORT=6379
UMAMI_API_KEY={key}
UMAMI_WEBSITE_ID={id}' > ./backend/.env

echo    'VITE_API_BASE_URL="http://localhost:3000"
VITE_ENVIROMENT="sandbox"
VITE_PAYPAL_CLIENT={paypal-client}
VITE_PAYPAL_SECRET={paypal-secret}
VITE_STRIPE_PUBLISHABLE_KEY={stripe-public-key}' > ./frontend/.env
```

### 5.4 **Ejecución del proyecto**

**Desarollo**

```bash
npm run dev
```

**Producción**

```bash
npm run build
pm2 start ecosystem.config.js
```

### 5.5 **Popular la base de datos con la información pre-definida**

**Popular MongoDB**

```bash
cd backend
npm run init:mongoDB [develop | production]
```

**Popular Weaviate (solo desarrollo)**

1. Crear una carpeta en la ruta /vectorDatabase

Insertar una carpeta con raza de mascota e imágenes

`Ej. /vectorDB/golden/img_1.jpg`

```bash
cd backend
npm run dev # Corriendo
# En orta consola
npm run init:vectorDB populate
```

## 6. Acceso al servidor

### 6.1 Conexión SSH

`ssh [usuario]@[ip-servidor]`

### 6.2 Configuración opcional SSH

```bash
Host [alias]
   HostName [ip]
   User [usuario]
   IdentityFile [ruta_llave]
```

## 7. Desplegar en producción

### 7.1 Instalar dependencias

```bash
npm run install:all
```

### 7.2 Build del proyecto

```bash
npm run build
```

### 7.3 Despliegue de la aplicación

```bash
pm2 start ecosystem.config.js

sudo rm -rf /var/www/html/*
sudo cp -r frontend/dist/* /var/www/html/
```

2 **Configuración de servicios**

- Servidor web: Nginx
- Proxy reverso: Si
- Puertos utilizados: 443, 8080, 3000
  3 **Claves de seguridad**

Cambiar {dominio} por el dominio de la aplicación

```bash
sudo apt install openssl
sudo openssl genpkey -algorithm RSA -out /etc/ssl/private/{dominio}.key
sudo openssl req -new -key /etc/ssl/private/{dominio}.key -out /etc/ssl/certs/{dominio}.csr
sudo openssl x509 -req -in /etc/ssl/certs/{dominio}.csr -signkey /etc/ssl/private/{dominio}.key -out /etc/ssl/certs/{dominio}.crt -days 365
```

4 **Configuración de nginx**

```bash
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

echo 'server {
    listen              443 ssl;
    server_name         www.encontrandomascotas.com encontrandomascotas.com;
    ssl_certificate     /etc/letsencrypt/live/www.encontrandomascotas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.encontrandomascotas.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' https://js.stripe.com https://www.paypal.com https://www.paypalobjects.com https://www.sandbox.paypal.com https://hcaptcha.com https://*.hcaptcha.com; script-src-elem 'self' https://*.paypal.com https://*.paypalobjects.com https://api.google.com https://js.stripe.com 'sha256-npT7gANf5j5xQfBnLoFhyBq4QaE/X/oJcc6dqflY9zw='; style-src-elem 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.paypal.com https://www.sandbox.paypal.com; connect-src 'self' https://api.stripe.com https://www.paypal.com https://photon.komoot.io https://www.sandbox.paypal.com;" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;


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
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    location /weaviate/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}


'> /etc/nginx/sites-available/default

sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl restart nginx
```

## 8. Persistencia y ejecución en servidor

### 8.1 Herramientas de gestión de procesos:

| Herramienta | Descripción                                                             |
| ----------- | ----------------------------------------------------------------------- |
| PM2         | Proceso principal de la aplicación, reinicio automático cuando de error |
| Docker      | Base de datos vectoriales y cola de tareas                              |

### 8.2 Ejecución de servicios

- `pm2 start`
- `docker compose up -d`

### 8.3 Información de servicios

**Ver Estado**

- `pm2 ls`
- `docekr ps`

**Ver logs**

- `pm2 logs 0`
- `docker logs <process-id>`

**Reiniciar el servicio**

- `pm2 restart 0`
- `docker restart <container_name_or_id>`

## 9. Configuración del servidor web

### 9.1 Servidor web utilizado

| Tecnología | Uso           |
| ---------- | ------------- |
| NGINX      | Proxy reverso |

## 10. Flujo de actualización

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

### 11. Consideraciones adicionales

El servidor debe tener el puerto 443 abierto al público para funcionar

### 11. TroubleShooting

11.1 Si ocurre un error donde dice que el archivo o ruta es inexistente:
`sudo mkdir -p {ruta/que/se/quiere/usar}`
