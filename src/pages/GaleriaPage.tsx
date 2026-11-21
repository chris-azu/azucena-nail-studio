import { useEffect, useState } from 'react'
import { PhotoCard } from '../components/PhotoCard'
import { Reveal } from '../components/Reveal'
import { supabase } from '../lib/supabase'
import type { Foto } from '../types'

export function GaleriaPage() {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let activo = true

    supabase
      .from('fotos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (!activo) return
        if (err) setError(err.message)
        else setFotos((data ?? []) as Foto[])
        setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  return (
    <section>
      <Reveal>
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary/70">Galería</p>
        <h1 className="mt-1 font-display text-3xl leading-tight text-ink-strong">
          Diseños para inspirarte
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          Elige el que te encante y cotízalo directamente por WhatsApp.
        </p>
      </Reveal>

      {error && (
        <p className="mt-6 rounded-card bg-red-50 p-4 text-sm text-red-700">No se pudo cargar la galería: {error}</p>
      )}

      {cargando ? (
        <div className="mt-6 grid grid-cols-2 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative aspect-square animate-fade-up overflow-hidden rounded-card bg-white shadow-soft">
              <div className="absolute inset-0 bg-surface-high" />
              <div className="absolute inset-x-3 bottom-[60px] h-3 rounded-full bg-surface-high/80" />
              <div className="absolute bottom-2 left-2 right-2 h-[46px] max-h-[30%] rounded-card bg-white/30 px-2.5 py-2 backdrop-blur-[10px]">
                <div className="h-[30px] rounded-pill bg-surface-high" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3.5">
          {fotos.map((foto, indice) => (
            <Reveal key={foto.id} delay={Math.min(indice, 10) * 55}>
              <PhotoCard foto={foto} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
