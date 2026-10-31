# invercion-max — demo de gestión de préstamos

Aplicación web estática en español para una cartera de préstamos con cobro diario. Incluye panel administrativo, vista de cliente, tarjetas de cobro separadas por préstamo, inversiones, pagos y reportes.

## Ejecutar con Docker

Requisitos: Docker Desktop (Windows/macOS) o Docker Engine + Docker Compose (Linux). Inicia Docker Desktop antes de ejecutar los comandos.

```sh
docker compose up --build -d
```

Abre [http://localhost:8080](http://localhost:8080). Para detener la aplicación:

```sh
docker compose down
```

Por defecto se publica el puerto 8080 del equipo. Para elegir otro puerto, defínelo al iniciar Compose:

```sh
PORT=8090 docker compose up --build -d
```

En PowerShell:

```powershell
$env:PORT=8090
docker compose up --build -d
```

### Usar desde otros dispositivos de la misma red

1. Ejecuta Docker en el equipo que funcionará como host y comprueba que el sitio abre en `http://localhost:8080`.
2. Obtén la IP local del host (por ejemplo, con `ipconfig` en Windows o `ip addr` en Linux).
3. Desde un teléfono u otro equipo conectado a la misma red, abre `http://IP-LOCAL-DEL-HOST:8080` (por ejemplo, `http://192.168.1.20:8080`).
4. Si no conecta, permite el puerto TCP 8080 en el firewall del host y verifica que el router no aísle los dispositivos Wi-Fi.

Para acceso desde fuera de la red se requiere despliegue en un servidor accesible por Internet, HTTPS y medidas de seguridad adecuadas; no se recomienda exponer esta demo directamente.

### Actualizar la imagen después de cambios

```sh
git pull
docker compose up --build -d
```

## Inicio de sesión de demostración

- **Cliente:** elige un perfil de cliente y usa el correo que se muestra en la lista (por ejemplo, `juan@demo.com`).
- **Administrador:** usa `admin@invercion-max.demo`.
- Para cualquiera de los perfiles, ingresa cualquier texto como contraseña: la contraseña no se comprueba.
- Cierra sesión con el icono de salida; al recargar la página se muestra de nuevo el acceso.

En la cartera inicial Juan Pérez tiene dos préstamos de ejemplo. Cada uno aparece en una tarjeta propia con su calendario, pagos y saldo independientes.

## Funciones

- Registrar inversiones y préstamos de **30 a 60 días de cobro**.
- Cobros programados de lunes a sábado; se excluyen domingos, no festivos.
- Registrar pagos, parciales o diarios, y consultar saldos.
- Revisar capital, actividad y recaudos mensuales en el panel administrativo.
- Probar los cálculos y la migración existentes con Node.js:

```sh
node --check app.js
node tests.js
```

## Reglas financieras

La demo usa **20% mensual simple**, prorrateado según días de cobro:

- `interés = capital × 0,20 × (días de cobro / 30)`
- `total = capital + interés`
- A 30 días se calcula 20%; a 60 días, 40%. El interés no se capitaliza.

El total se divide en cuotas diarias. Se redondea al peso y el ajuste se aplica a la última cuota. La primera cuota ocurre en la fecha inicial, excepto si cae domingo, cuando se programa para el lunes siguiente.

## Publicar en GitHub

1. Crea un repositorio vacío en GitHub; elige privado si no quieres que el código sea público. No marques opciones para crear README, licencia o `.gitignore` si ya existen localmente.
2. Desde esta carpeta, configura la URL y publica la rama principal:

```sh
git init
git add .
git status --short
git commit -m "Preparar invercion-max para Docker"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Reemplaza `USUARIO/REPOSITORIO` por la URL real del repositorio. GitHub te pedirá autenticarte; no incluyas contraseñas o tokens en los comandos ni archivos. Confirma `git status` antes de hacer `git add .` y revisa que solo se suban los archivos deseados. Las hojas de cálculo, documentos, secretos y archivos locales ignorados no deben incorporarse.

## Persistencia y seguridad: importante

Esta es una **demo local**, no un sistema listo para administrar dinero real. No existe backend, autenticación real, base de datos compartida, autorización segura, respaldo, auditoría ni procesamiento de pagos. Las contraseñas de la pantalla son simuladas; la selección del perfil cliente es solo una vista y no protege los registros. Los datos financieros se guardan en el `localStorage` de cada navegador: no se sincronizan entre dispositivos y pueden inspeccionarse o modificarse. Cada dispositivo inicia su propia copia local de los datos.

Docker publica el frontend estático y no añade por sí solo sincronización, autenticación ni persistencia de préstamos. Para uso multiusuario real se necesita desarrollar backend, autenticación/sesiones seguras, autorización del servidor para cada registro, base de datos y copias de respaldo, además de HTTPS y revisiones legales/contables aplicables.
