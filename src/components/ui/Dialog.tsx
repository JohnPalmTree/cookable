'use client'
import { useEffect, useRef, type ReactNode } from 'react'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  footer?: ReactNode
}

export default function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-labelledby="dialog-title"
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-xl backdrop:bg-black/50"
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 id="dialog-title" className="text-xl font-semibold">
          {title}
        </h2>
        {children && <div className="text-sm text-muted">{children}</div>}
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </dialog>
  )
}
