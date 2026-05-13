# SOS-Full Stack

# Manual de instalación

## Clonar el repositorio

El primer paso es descargar el proyecto para tener acceso a sus componentes y dependencias en todo momento.
Este primer paso es importante para la configuración de docker.

```bash
git clone https://github.com/AztlanConsulting/SOS-FullStack.git
cd SOS-Fullstack
```

Esto nos deja descargar el proyecto en una carpeta llamada SOS-Fullstack y entrar en ella.

## Configuración previa del servidor.

_Si ya cuenta con docker instalado y ya tiene una configuración de nginx customizada se puede saltar hasta la sección de configuración de la aplicación_

## 1. Instalación de docker

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

## 2. Instalación y configuración de NGINX

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
sudo systemctl start
```
