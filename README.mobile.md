# Hermes Agent Mobile

Adaptación móvil/PWA del renderer real de Hermes Desktop. Conserva chat,
sesiones, archivos, terminal, temas, voz y notificaciones, reorganizados para
pantallas táctiles.

## Inicio rápido

```bash
npm install
npm run --workspace apps/desktop build:mobile
```

Sirve `hermes_cli/mobile_dist` con el Dashboard de Hermes:

```powershell
$env:HERMES_WEB_DIST = "$PWD\hermes_cli\mobile_dist"
hermes dashboard --port 9120 --no-open
```

Abre `http://127.0.0.1:9120/` en el equipo. Para iPhone/Android consulta la
[guía móvil completa](MOBILE_PWA.md), incluida la configuración HTTPS,
notificaciones, micrófono y “Hey Hermes”.

Este proyecto deriva de
[NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) y
conserva su licencia AGPL-3.0.
