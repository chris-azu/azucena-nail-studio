import type { Foto } from '../types'
import { abrirWhatsapp, cotizarWhatsapp } from '../lib/whatsapp'

export function PhotoCard({ foto }: { foto: Foto }) {
  return (
    <article className="relative overflow-hidden rounded-card bg-white shadow-soft transition-smooth hover:shadow-soft">
      <div className="aspect-square overflow-hidden bg-surface-high">
        <img
          src={foto.url}
          alt={foto.nombre ?? 'Diseño de uñas'}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth hover:scale-[1.03]"
        />
      </div>
      <div className="glass-card absolute inset-x-3 bottom-3 space-y-3 p-3.5">
        <p className="truncate font-display text-base text-ink-strong drop-shadow-sm">
          {foto.nombre ?? 'Diseño sin nombre'}
        </p>
        <button
          type="button"
          onClick={() => abrirWhatsapp(cotizarWhatsapp(foto))}
          className="btn-neu-whatsapp flex w-full items-center justify-center gap-1.5 rounded-pill px-3 py-2.5 text-xs font-bold active:scale-[0.97]"
        >
          <span className="material-symbols-outlined text-base">chat</span>
          Cotizar por WhatsApp
        </button>
      </div>
    </article>
  )
}
