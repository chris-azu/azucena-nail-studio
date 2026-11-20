import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ConfirmModal } from '../../components/ConfirmModal'
import { supabase } from '../../lib/supabase'
import type { TiposUnia } from '../../types'

export function TiposUniaManager() {
  const [tipos, setTipos] = useState<TiposUnia[]>([])
  const [nuevo, setNuevo] = useState('')
  const [editando, setEditando] = useState<string | null>(null)
  const [valorEdicion, setValorEdicion] = useState('')
  const [borrar, setBorrar] = useState<TiposUnia | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('tipos_unia')
      .select('*')
      .order('nombre', { ascending: true })

    if (err) setError(err.message)
    else setTipos((data ?? []) as TiposUnia[])
    setCargando(false)
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const agregar = async (evento: FormEvent) => {
    evento.preventDefault()
    const nombre = nuevo.trim()
    if (!nombre) return

    const { error: err } = await supabase.from('tipos_unia').insert({ nombre })
    if (err) {
      setError(err.message)
      return
    }
    setNuevo('')
    setError(null)
    await cargar()
  }

  const guardar = async (id: string) => {
    const nombre = valorEdicion.trim()
    if (!nombre) return

    const { error: err } = await supabase.from('tipos_unia').update({ nombre }).eq('id', id)
    if (err) {
      setError(err.message)
      return
    }
    setEditando(null)
    setError(null)
    await cargar()
  }

  const eliminar = async () => {
    if (!borrar) return
    const { error: err } = await supabase.from('tipos_unia').delete().eq('id', borrar.id)
    if (err) setError(err.message)
    setBorrar(null)
    await cargar()
  }

  return (
    <section>
      <div className="rounded-card bg-white p-5 shadow-soft">
        <h2 className="font-display text-xl text-ink-strong">Gestiona los tipos de uña</h2>
        <p className="mt-1 text-xs text-ink/60">Se muestran en el formulario de citas.</p>

        <form onSubmit={agregar} className="mt-4 flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-pill border border-outline bg-canvas px-4 py-2.5 text-sm outline-none focus:border-primary"
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            placeholder="Nuevo tipo"
          />
          <button
            type="submit"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white transition active:scale-95"
            aria-label="Agregar tipo"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </form>
      </div>

      {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-4 space-y-2.5">
        {cargando ? (
          <p className="py-6 text-center text-sm text-ink/50">Cargando...</p>
        ) : (
          tipos.map((tipo) => (
            <div
              key={tipo.id}
              className="flex items-center gap-3 rounded-card bg-white p-3.5 shadow-soft"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-container text-primary">
                <span className="material-symbols-outlined text-lg">spa</span>
              </span>

              {editando === tipo.id ? (
                <input
                  autoFocus
                  className="min-w-0 flex-1 rounded-pill border border-primary bg-canvas px-3 py-2 text-sm outline-none"
                  value={valorEdicion}
                  onChange={(e) => setValorEdicion(e.target.value)}
                />
              ) : (
                <p className="min-w-0 flex-1 truncate font-display text-base text-ink-strong">
                  {tipo.nombre}
                </p>
              )}

              {editando === tipo.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => void guardar(tipo.id)}
                    className="text-primary"
                    aria-label="Guardar"
                  >
                    <span className="material-symbols-outlined">check</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditando(null)}
                    className="text-ink/40"
                    aria-label="Cancelar"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(tipo.id)
                      setValorEdicion(tipo.nombre)
                    }}
                    className="text-primary"
                    aria-label={`Editar ${tipo.nombre}`}
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBorrar(tipo)}
                    className="text-red-500"
                    aria-label={`Eliminar ${tipo.nombre}`}
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {borrar && (
        <ConfirmModal
          titulo="¿Eliminar tipo?"
          mensaje={`Se eliminará "${borrar.nombre}" de las opciones de citas.`}
          onCancelar={() => setBorrar(null)}
          onAceptar={() => void eliminar()}
        />
      )}
    </section>
  )
}
