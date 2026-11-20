import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FotosManager } from './FotosManager'
import { TiposUniaManager } from './TiposUniaManager'

type Props = {
  onLogout: () => Promise<unknown>
}

type Pestaña = 'tipos' | 'fotos'

export function AdminPanelPage({ onLogout }: Props) {
  const [pestaña, setPestaña] = useState<Pestaña>('tipos')

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-md px-5 pb-12 pt-safe">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm font-semibold text-primary">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Galería
          </Link>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="flex items-center gap-1 text-sm font-semibold text-primary"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Salir
          </button>
        </header>

        <div className="mt-7 flex items-center gap-3">
          <img src="/logo-azucena.png" alt="" className="h-12 w-12 rounded-full object-cover shadow-soft" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary/70">Administración</p>
            <h1 className="font-display text-2xl text-ink-strong">Bienvenida de nuevo</h1>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2 rounded-pill bg-surface p-1.5">
          {(
            [
              { id: 'tipos', label: 'Tipos de uña', icono: 'category' },
              { id: 'fotos', label: 'Fotos', icono: 'photo_library' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPestaña(item.id)}
              className={`flex items-center justify-center gap-1.5 rounded-pill px-3 py-2.5 text-xs font-bold transition-smooth active:scale-[0.97] ${
                pestaña === item.id ? 'bg-white text-primary shadow-soft' : 'text-ink/50'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icono}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div key={pestaña} className="mt-7 tab-panel">
          {pestaña === 'tipos' ? <TiposUniaManager /> : <FotosManager />}
        </div>
      </div>
    </div>
  )
}
