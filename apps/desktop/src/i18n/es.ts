import { defineLocale } from './define-locale'

// Spanish starts with the phone's most visible surfaces. Untranslated deep
// settings deliberately inherit English through defineLocale instead of
// exposing raw keys while the catalog grows.
export const es = defineLocale({
  common: {
    apply: 'Aplicar',
    back: 'Atrás',
    save: 'Guardar',
    saving: 'Guardando…',
    cancel: 'Cancelar',
    choose: 'Elegir',
    clear: 'Limpiar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    connect: 'Conectar',
    connecting: 'Conectando',
    continue: 'Continuar',
    copied: 'Copiado',
    copy: 'Copiar',
    delete: 'Eliminar',
    done: 'Listo',
    error: 'Error',
    loading: 'Cargando…',
    refresh: 'Actualizar',
    remove: 'Quitar',
    retry: 'Reintentar',
    run: 'Ejecutar',
    send: 'Enviar',
    update: 'Actualizar',
    on: 'Activado',
    off: 'Desactivado'
  },
  titlebar: {
    hideSidebar: 'Ocultar barra lateral',
    showSidebar: 'Mostrar barra lateral',
    search: 'Buscar',
    searchTitle: 'Buscar sesiones, vistas y acciones',
    swapSidebarSides: 'Intercambiar barras laterales',
    hideRightSidebar: 'Ocultar herramientas',
    showRightSidebar: 'Mostrar archivos y terminal',
    unreadSessions: count => (count === 1 ? '1 sesión sin leer' : `${count} sesiones sin leer`),
    muteHaptics: 'Silenciar vibración',
    unmuteHaptics: 'Activar vibración',
    openSettings: 'Abrir configuración',
    openStarmap: 'Abrir mapa de memoria',
    enterHud: 'Modo HUD',
    exitHud: 'Salir del modo HUD',
    resetHudLayout: 'Restablecer tamaño y posición del HUD',
    layoutEditor: 'Editor de distribución',
    layoutEditorTitle: mod => `Editor de distribución — ${mod}-clic restablece la distribución`
  },
  language: {
    label: 'Idioma',
    description: 'Elige el idioma de la interfaz.',
    saving: 'Guardando idioma…',
    saveError: 'No se pudo cambiar el idioma',
    switchTo: 'Cambiar idioma',
    searchPlaceholder: 'Buscar idiomas…',
    noResults: 'No se encontraron idiomas'
  },
  settings: {
    closeSettings: 'Cerrar configuración',
    exportConfig: 'Exportar configuración',
    importConfig: 'Importar configuración',
    resetToDefaults: 'Restablecer valores',
    resetConfirm: '¿Restablecer toda la configuración de Hermes?',
    exportFailed: 'Error al exportar',
    resetFailed: 'Error al restablecer',
    nav: {
      providers: 'Proveedores',
      providerAccounts: 'Cuentas',
      providerApiKeys: 'Claves API',
      providerCustomEndpoints: 'Endpoints personalizados',
      providerLocalModels: 'Modelos locales',
      gateway: 'Conexiones',
      apiKeys: 'Herramientas y claves',
      keybinds: 'Atajos de teclado',
      keysTools: 'Herramientas',
      keysSettings: 'Ajustes',
      mcp: 'MCP',
      archivedChats: 'Chats archivados',
      about: 'Acerca de',
      billing: 'Facturación',
      notifications: 'Notificaciones',
      plugins: 'Plugins'
    },
    notifications: {
      title: 'Notificaciones',
      intro: 'Avisos del sistema por dispositivo.',
      enableAll: 'Activar notificaciones',
      enableAllDesc: 'Al desactivarlo se silencian todos los avisos.',
      focusedHint: 'El aviso de respuesta terminada aparece cuando Hermes está en segundo plano.'
    }
  },
  sidebar: {
    nav: {
      'new-session': 'Nueva sesión',
      skills: 'Capacidades',
      messaging: 'Mensajería',
      artifacts: 'Archivos',
      cron: 'Tareas programadas'
    },
    searchAria: 'Buscar sesiones',
    searchPlaceholder: 'Buscar sesiones…',
    clearSearch: 'Limpiar búsqueda',
    noMatch: query => `Ninguna sesión coincide con “${query}”.`,
    results: 'Resultados',
    pinned: 'Fijadas',
    sessions: 'Sesiones',
    cronJobs: 'Tareas programadas',
    noSessions: 'Aún no hay sesiones',
    noFilterMatches: 'No hay sesiones con estos filtros',
    shiftClickHint: 'Mayús-clic para fijar un chat'
  }
})
