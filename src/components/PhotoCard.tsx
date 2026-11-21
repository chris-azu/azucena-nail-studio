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
      <p className="absolute inset-x-3 bottom-[60px] truncate text-[13px] font-semibold leading-4 text-ink-strong drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
        {foto.nombre ?? 'Diseño sin nombre'}
      </p>
      <div className="glass-card absolute bottom-2 left-2 right-2 max-h-[30%] px-2.5 py-2">
        <button
          type="button"
          onClick={() => abrirWhatsapp(cotizarWhatsapp(foto))}
          className="btn-neu-whatsapp flex h-[30px] w-full items-center justify-center gap-1 rounded-pill px-3 py-1.5 text-[12px] font-bold leading-none active:scale-[0.97] sm:h-[34px]"
        >
          <span className="material-symbols-outlined text-[16px] leading-none">chat</span>
          <span className="sm:hidden">Cotizar</span>
          <span className="hidden sm:inline">Cotizar por WhatsApp</span>
        </button>
      </div>
    </article>
  )
}
