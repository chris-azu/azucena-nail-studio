import { Link } from 'react-router-dom'

export function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-outline/60 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-md items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Ir a la galería">
          <img
            src="/logo-azucena.png"
            alt=""
            className="h-9 w-9 rounded-full object-cover shadow-soft"
          />
          <span className="font-display text-[17px] tracking-wide text-primary">
            Azucena Nail Studio
          </span>
        </Link>
      </div>
    </header>
  )
}
