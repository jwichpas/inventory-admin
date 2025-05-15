import { App, Plugin } from 'vue' // Importa Plugin correctamente
import { useAlert } from '@/composables/useAlert'

// Define la interfaz para los métodos de alerta
interface AlertMethods {
  info: (message: string, title?: string, timeout?: number) => void
  danger: (message: string, title?: string, timeout?: number) => void
  success: (message: string, title?: string, timeout?: number) => void
  warning: (message: string, title?: string, timeout?: number) => void
  dark: (message: string, title?: string, timeout?: number) => void
  remove: (id: number) => void
}

// Extiende el tipo de app para incluir $alert
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $alert: AlertMethods
  }
}

export const alertPlugin: Plugin = {
  install(app: App) {
    const { addAlert, alerts, removeAlert } = useAlert()

    // Proporciona alerts para uso con inject
    app.provide('alerts', alerts)

    // Añade $alert al contexto global
    app.config.globalProperties.$alert = {
      info: (message: string, title: string = '', timeout: number = 5000) =>
        addAlert('info', message, title, timeout),
      danger: (message: string, title: string = '', timeout: number = 5000) =>
        addAlert('danger', message, title, timeout),
      success: (message: string, title: string = '', timeout: number = 5000) =>
        addAlert('success', message, title, timeout),
      warning: (message: string, title: string = '', timeout: number = 5000) =>
        addAlert('warning', message, title, timeout),
      dark: (message: string, title: string = '', timeout: number = 5000) =>
        addAlert('dark', message, title, timeout),
      remove: (id: number) => removeAlert(id),
    }
  },
}
