# Hermes Desktop Mobile (PWA)

Esta variante sirve el renderer real de Hermes Desktop desde el backend web de
Hermes. No utiliza el Dashboard administrativo: conserva el chat, las sesiones,
los paneles y la estetica de Desktop, reorganizados por el sistema responsive
existente cuando la pantalla mide menos de 640 px.

## Probar la compilacion incluida

En PowerShell:

```powershell
$env:HERMES_WEB_DIST = "RUTA\hermes-agent-main\hermes_cli\mobile_dist"
hermes dashboard --port 9120 --no-open
```

Abre `http://127.0.0.1:9120/`. El puerto 9119 puede seguir ejecutando el
Dashboard oficial al mismo tiempo.

## Volver a compilar

```bash
npm install
npm run --workspace apps/desktop build:mobile
```

El resultado se escribe en `hermes_cli/mobile_dist/`; la compilacion normal de
Electron continua escribiendose en `apps/desktop/dist/`.

## Telefono

Para instalarla en Android o iPhone debe publicarse mediante HTTPS. Hermes
mantiene toda la ejecucion del agente en el backend. El adaptador web no guarda
ni cachea HTML autenticado, claves, respuestas de API o contenido del usuario.
Las capacidades exclusivas del sistema operativo, como ventanas nativas y
acceso directo a rutas locales, se degradan o permanecen desactivadas en web.

### Controles moviles

- La luna/el sol de la barra superior cambia inmediatamente entre tema claro y
  oscuro. El globo alterna Español/Inglés; el selector completo sigue en
  **Configuración > Apariencia**.
- La barra lateral izquierda flota sobre la conversación. Archivos, terminal y
  exploradores secundarios usan una hoja inferior para conservar ancho útil.
- **Archivos** e **Imágenes** del menú Adjuntar funcionan cuando el backend
  puede recibir o resolver el recurso. En Safari no existe acceso arbitrario a
  rutas del equipo servidor: **Carpeta** y referencias a rutas locales dependen
  del backend y pueden no estar disponibles desde otro dispositivo.
- La grabación de voz requiere HTTPS (localhost también se considera seguro),
  permiso de micrófono y soporte de `MediaRecorder`. “Hey Hermes” requiere,
  además, que Wake Word esté configurado en el backend; cuando el backend usa
  captura `client`, el audio se toma del micrófono del teléfono.

## Habilitar esta interfaz en otra instalación de Hermes

Requisitos: Node.js 20+, npm y una instalación funcional de Hermes Agent.

```bash
git clone https://github.com/soporte-ui/hermes-agent-mobile.git
cd hermes-agent-mobile
npm install
npm run --workspace apps/desktop build:mobile
```

Después indica al Dashboard que sirva el renderer móvil compilado:

```powershell
$env:HERMES_WEB_DIST = "$PWD\hermes_cli\mobile_dist"
hermes dashboard --port 9120 --no-open
```

En macOS/Linux:

```bash
HERMES_WEB_DIST="$PWD/hermes_cli/mobile_dist" hermes dashboard --port 9120 --no-open
```

Para abrirla desde otro dispositivo no publiques directamente el puerto sin
protección. Usa HTTPS, autenticación y un proxy o túnel de confianza. El
teléfono debe poder alcanzar tanto las rutas HTTP de Hermes como su WebSocket.

## Comprobaciones de voz

1. Abre la PWA por HTTPS y pulsa el micrófono; concede permiso cuando Safari lo
   solicite.
2. Graba una frase y confirma que aparece el estado de transcripción.
3. Activa “Hey Hermes”. Si queda deshabilitado, revisa en el backend las
   dependencias/proveedor de Wake Word y que `wake.status` indique
   `available: true`.
4. iOS puede suspender audio y WebSockets cuando la PWA permanece mucho tiempo
   en segundo plano; vuelve a abrirla para rearmar la escucha.

## Notificaciones en Safari

En iPhone o iPad se requiere iOS/iPadOS 16.4 o posterior, servir Hermes por
HTTPS e instalarlo primero con **Compartir > Agregar a pantalla de inicio**.
Después abre la app instalada, entra en **Configuración > Notificaciones** y
pulsa **Probar notificación** para conceder el permiso mediante una acción
directa. Las notificaciones locales funcionan mientras la página de Hermes
sigue ejecutándose. Recibir avisos con la app totalmente cerrada requiere
además un servicio de Web Push en el backend (suscripciones y claves VAPID).
