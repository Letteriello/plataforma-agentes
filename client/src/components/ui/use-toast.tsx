import * as React from 'react'

type ToastVariant = 'default' | 'destructive' | 'success'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  action?: React.ReactNode
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  toast: (props: Omit<Toast, 'id'>) => string | (() => void)
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    )
  }, [])

  const toast = React.useCallback(
    (props: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)

      setToasts((currentToasts) => [...currentToasts, { id, ...props }])

      if (props.duration !== 0) {
        const duration = props.duration || 5000
        const timer = setTimeout(() => {
          dismiss(id)
        }, duration)

        return () => clearTimeout(timer)
      }

      return id
    },
    [dismiss],
  )

  const value = React.useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
    }),
    [toasts, toast, dismiss],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
