import { ref } from 'vue'

type AlertType = 'info' | 'danger' | 'success' | 'warning' | 'dark'

interface Alert {
  id: number
  type: AlertType
  title: string
  message: string
  timeout?: number
}

export function useAlert() {
  const alerts = ref<Alert[]>([])

  const showNotificationes = (
    message: string,
    type: AlertType = 'success',
    title?: string,
    timeout: number = 5000,
  ) => {
    const id = Date.now()
    const alert: Alert = {
      id,
      type,
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      message,
    }

    alerts.value.push(alert)

    if (timeout > 0) {
      setTimeout(() => {
        removeAlert(id)
      }, timeout)
    }
  }

  const removeAlert = (id: number) => {
    alerts.value = alerts.value.filter((alert) => alert.id !== id)
  }

  return {
    alerts,
    showNotificationes,
    removeAlert,
  }
}
