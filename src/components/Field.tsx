import type { ReactNode } from 'react'

type Props = {
  etiqueta: string
  error?: string
  children: ReactNode
}

export function Field({ etiqueta, error, children }: Props) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink/70">{etiqueta}</span>
      {children}
      {error && <span className="block text-xs text-red-600">{error}</span>}
    </label>
  )
}
