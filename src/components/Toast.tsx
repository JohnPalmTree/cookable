'use client'
import { useEffect, useState } from 'react'

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
  listeners.forEach(l => l(toasts))
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    listeners.forEach(l => l(toasts))
  }, 3500)
}

const COLORS = {
  success: 'bg-green-600',
  error:   'bg-red-600',
  info:    'bg-gray-800',
}

export default function Toast() {
  const [current, setCurrent] = useState<ToastMessage[]>([])

  useEffect(() => {
    listeners.push(setCurrent)
    return () => { listeners = listeners.filter(l => l !== setCurrent) }
  }, [])

  if (current.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {current.map(t => (
        <div
          key={t.id}
          className={`${COLORS[t.type]} text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}