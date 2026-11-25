'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

let listeners: ((toasts: ToastMessage[]) => void)[] = []
let toasts: ToastMessage[] = []

export function showToast(message: string, type: ToastType = 'success') {
  const id = Math.random().toString(36).slice(2)
  toasts = [...toasts, { id, message, type }]
  listeners.forEach((l) => l(toasts))
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    listeners.forEach((l) => l(toasts))
  }, 3500)
}

const STYLES = {
  success: { icon: CheckCircle2, color: 'text-success-ink', border: 'border-l-success' },
  error: { icon: XCircle, color: 'text-danger-ink', border: 'border-l-danger' },
  info: { icon: Info, color: 'text-muted', border: 'border-l-line' },
}

export default function Toast() {
  const [current, setCurrent] = useState<ToastMessage[]>([])

  useEffect(() => {
    listeners.push(setCurrent)
    return () => {
      listeners = listeners.filter((l) => l !== setCurrent)
    }
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {current.map((t) => {
        const { icon: Icon, color, border } = STYLES[t.type]
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-xl border border-l-4 border-line ${border} bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-lg`}
          >
            <Icon size={18} aria-hidden="true" className={color} />
            {t.message}
          </div>
        )
      })}
    </div>
  )
}
