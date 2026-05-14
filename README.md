# SOS-Full Stack - Manual de instalación

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

1. **Asegurarse que no haya versiones anteriores instaladas**

```bash
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)
```

2. **Instalar repositorio de docker**

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

3. **Instalar docker y sus componentes**

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

4. **Verificar instalación**

```bash
sudo docker run hello-world
```

### 2. Instalación y configuración de NGINX

- [Documentación oficial](https://nginx.org/en/linux_packages.html#Ubuntu)

1. **Instalar prerrequisitos y nginx**

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

2. **Verifica que la instalación fue correcta con:**

```bash
sudo nginx -t
sudo systemctl status nginx
```

3. **Activar el servicio**
   Si en el paso anterior nginx tiene un estado de apagado es necesario activarlo manualmente

```bash
sudo systemctl start nginx
```

### 3. Instalación de Node

- [Documentación oficial](https://www.geeksforgeeks.org/linux-unix/how-to-install-nvm-on-ubuntu-22-04/)

NVM es un paquete que nos ayudará a instalar la versión de node que utilizaremos para el proyecto, ya que este corre en JavaScript

1. **Instalar nvm**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

2. **Verificar instalación**

```bash
nvm --version
```

**Debe dar una respuesta como 1.2.2**

3. **Instalar la versión 25.9 de node**

```bash
nvm install 25.9
```

4. **Ver versiones instaladas**

```bash
nvm ls
```

En la lista debería aparecer la versión que se instaló en el paso anterior

5. **Seleccionarla como versión predefinida**

```bash
nvm use 25.9
```

### 4. Instalación de MongoDB

- [Documentación oficial](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-ubuntu/)

1. **Instalar mongo**

---

## Configuración de la aplicación

### 1. Clonar el repositorio y acceder a este

```bash
git clone https://github.com/AztlanConsulting/SOS-FullStack.git
cd SOS-Fullstack
```

### 2. Iniciar base de datos vectorial

La configuración de la base de datos vectorial se encuentra en el archivo docker-compose.yml, en este se puede cambiar la configuración si se quiere modificar algo como los puertos. Pero la configuración establecida es necesaria para el correcto funcionamiento de la aplicación

1. **Levantar el contenedor**

La base de datos vectorial es utilizada para la función de mascotas encontradas.
Es necesario generar la imagen de docker y levantarla para que funcione

```bash
docker compose up
```

Si la configuración de docker fue correcta, este debería ejecutar el archivo dentro del proyecto docker-compose.yml para instalar weaviate e iniciar el contenedor.

2. **Verificar que el proceso corre de manera correcta**

```bash
docker ps
```

Debería mostrar los contenedores corriendo por el momento (pythonVector)

### 3. Preparar entornos

1. **Correr npm install en los diferentes entornos**

```bash
npm run install:all
```

2. **Popular la base de datos con la información pre-definida**

```bash
cd backend
npm run init:mongoDB
```

3. **En caso de querer probar el software o correrlo en modo de desarrollo**

- Iniciar el backend con:

```bash
npm run dev
```

- En otra consola correr:

```bash
npm run init:vectorDB
```

4. **Variables de entorno**

Volver a la ruta del proyecto de caso de ser necesario con _cd_

```bash
echo    'SERVER_PORT=3000 \
        VECTOR_DB="localhost:8080" \
        VITE_PAYPAL_CLIENT={your_paypal_key_here}' | .env

echo    'SERVER_PORT=3000
VECTOR_DB="localhost:8080"
FRONT_END_URL="http://localhost:5173"

ENVIRONMENT="sandbox"
PAYPAL_CLIENT="AbB-syqahGPQimRktwEXm10iNzau1Xx3aRzPV99WWbUtDA0PV-flFBw3mY1epYZDiIDsUa8voAwOOAOZ"
PAYPAL_SECRET="EBPwoWBhcgAsZqz_bLNlSMY94cn2sZZ1TBTtXczV2r78WfN2JY3YFhqX2FZvSDseEqgEMe8b3mBGX-Nd"
PAYPAL_REDIRECT_BASE_URL="http://localhost:5173"

STRIPE_SECRET_KEY={your_stripe_secret}
STRIPE_WEBHOOK_SECRET={your_stripe_webhook_secret}

TEST_MONGODB_URI={your_mongo_uri}

JWT_ACCESS_SECRET={your_access_secret}
JWT_REFRESH_SECRET={your_refresh_secret}
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
BCRYPT_SALT_ROUNDS=12

CORS_ORIGIN=http://localhost:5173' | ./backend.env
```
