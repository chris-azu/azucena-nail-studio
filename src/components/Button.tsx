import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primary' | 'outline' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
  completa?: boolean
  children: ReactNode
}

const estilos: Record<Variante, string> = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary/90',
  outline: 'border border-primary/40 text-primary bg-white/60 hover:bg-white',
  ghost: 'text-primary hover:bg-primary-container/50',
  danger: 'bg-red-50 text-red-700 hover:bg-red-100',
}

export function Button({
  variante = 'primary',
  completa = false,
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-semibold transition-smooth hover:shadow-soft active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variante]} ${
        completa ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
