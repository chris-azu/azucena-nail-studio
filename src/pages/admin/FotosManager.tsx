import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { ConfirmModal } from '../../components/ConfirmModal'
import { supabase } from '../../lib/supabase'
import type { Foto } from '../../types'

const BUCKET = 'fotos-galeria'
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAXIMO_BYTES = 5 * 1024 * 1024

type ArchivoSeleccionado = {
  id: string
  archivo: File
  vistaPrevia: string
  nombre: string
  saliendo: boolean
}

export function FotosManager() {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [seleccionados, setSeleccionados] = useState<ArchivoSeleccionado[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState<{ actual: number; total: number } | null>(null)
  const [borrar, setBorrar] = useState<Foto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const entradaArchivos = useRef<HTMLInputElement>(null)
  const vistasPrevias = useRef<Set<string>>(new Set())

  const cargar = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('fotos')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else setFotos((data ?? []) as Foto[])
    setCargando(false)
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  useEffect(() => {
    const vistas = vistasPrevias.current
    return () => {
      vistas.forEach((url) => URL.revokeObjectURL(url))
      vistas.clear()
    }
  }, [])

  const agregarArchivos = (lista: FileList | null) => {
    if (!lista) return

    const nuevos: ArchivoSeleccionado[] = []
    let mensaje: string | null = null

    Array.from(lista).forEach((archivo) => {
      if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        mensaje = `Formato no permitido: ${archivo.name}`
        return
      }
      if (archivo.size > MAXIMO_BYTES) {
        mensaje = `Máximo 5 MB por foto: ${archivo.name}`
        return
      }

      const vistaPrevia = URL.createObjectURL(archivo)
      vistasPrevias.current.add(vistaPrevia)
      nuevos.push({
        id: crypto.randomUUID(),
        archivo,
        vistaPrevia,
        nombre: '',
        saliendo: false,
      })
    })

    if (nuevos.length) setSeleccionados((prev) => [...prev, ...nuevos])
    setError(mensaje)
    if (entradaArchivos.current) entradaArchivos.current.value = ''
  }

  const quitar = (id: string) => {
    const actual = seleccionados.find((item) => item.id === id)
    if (!actual || actual.saliendo) return

    setSeleccionados((prev) =>
      prev.map((item) => (item.id === id ? { ...item, saliendo: true } : item)),
    )

    const demora = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 270
    window.setTimeout(() => {
      setSeleccionados((prev) => {
        const item = prev.find((entrada) => entrada.id === id)
        if (item) {
          URL.revokeObjectURL(item.vistaPrevia)
          vistasPrevias.current.delete(item.vistaPrevia)
        }
        return prev.filter((entrada) => entrada.id !== id)
      })
    }, demora)
  }

  const cambiarNombre = (id: string, nombre: string) => {
    setSeleccionados((prev) =>
      prev.map((item) => (item.id === id ? { ...item, nombre } : item)),
    )
  }

  const subir = async (evento: FormEvent) => {
    evento.preventDefault()
    if (seleccionados.length === 0 || subiendo) return

    setSubiendo(true)
    setError(null)
    setProgreso({ actual: 1, total: seleccionados.length })

    const exitosos = new Set<string>()
    let primerError: string | null = null

    for (let indice = 0; indice < seleccionados.length; indice += 1) {
      const item = seleccionados[indice]
      setProgreso({ actual: indice + 1, total: seleccionados.length })

      const extension = item.archivo.name.split('.').pop() ?? 'jpg'
      const ruta = `${Date.now()}-${crypto.randomUUID()}.${extension}`

      const { error: errUpload } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, item.archivo, { contentType: item.archivo.type, upsert: false })

      if (errUpload) {
        primerError ??= errUpload.message
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(ruta)

      const { error: errInsert } = await supabase.from('fotos').insert({
        nombre: item.nombre.trim() || null,
        url: publicUrl,
        storage_path: ruta,
      })

      if (errInsert) {
        primerError ??= errInsert.message
        await supabase.storage.from(BUCKET).remove([ruta])
        continue
      }

      exitosos.add(item.id)
    }

    seleccionados
      .filter((item) => exitosos.has(item.id))
      .forEach((item) => {
        URL.revokeObjectURL(item.vistaPrevia)
        vistasPrevias.current.delete(item.vistaPrevia)
      })

    setSeleccionados((prev) => prev.filter((item) => !exitosos.has(item.id)))
    setProgreso(null)
    setSubiendo(false)
    if (primerError) setError(primerError)
    await cargar()
  }

  const eliminar = async () => {
    if (!borrar) return

    if (borrar.storage_path) {
      await supabase.storage.from(BUCKET).remove([borrar.storage_path])
    }

    const { error: err } = await supabase.from('fotos').delete().eq('id', borrar.id)
    if (err) setError(err.message)
    setBorrar(null)
    await cargar()
  }

  return (
    <section>
      <div className="rounded-card bg-white p-5 shadow-soft">
        <h2 className="font-display text-xl text-ink-strong">Subir nueva foto</h2>
        <p className="mt-1 text-xs text-ink/60">Formatos JPG, PNG, WEBP o GIF. Máximo 5 MB.</p>

        <form onSubmit={subir} className="mt-4 space-y-3">
          <input
            id="fotos-galeria-input"
            ref={entradaArchivos}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={subiendo}
            onChange={(e) => agregarArchivos(e.target.files)}
          />

          {seleccionados.length === 0 ? (
            <label
              htmlFor="fotos-galeria-input"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-card border border-dashed border-primary/40 bg-canvas px-4 py-5 text-sm font-semibold text-primary transition active:scale-[0.99]"
            >
              <span className="material-symbols-outlined">add_photo_alternate</span>
              Seleccionar imagen
            </label>
          ) : (
            <div className="space-y-2">
              {seleccionados.map((item) => (
                <div
                  key={item.id}
                  className={`${item.saliendo ? 'file-out' : 'file-in'} flex items-center gap-3 rounded-card border border-dashed border-primary/40 bg-canvas px-3 py-2.5`}
                >
                  <img
                    src={item.vistaPrevia}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink-strong">
                      {item.archivo.name}
                    </p>
                    <input
                      className="mt-1.5 w-full rounded-pill border border-outline bg-white/70 px-3 py-1.5 text-xs outline-none transition-smooth focus:border-primary"
                      value={item.nombre}
                      onChange={(e) => cambiarNombre(item.id, e.target.value)}
                      placeholder="Nombre (opcional)"
                      disabled={subiendo}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => quitar(item.id)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/50 transition-smooth hover:text-red-600 active:scale-[0.97]"
                    aria-label={`Quitar ${item.archivo.name}`}
                    disabled={subiendo}
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              ))}

              <label
                htmlFor="fotos-galeria-input"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-card border border-dashed border-primary/40 bg-canvas px-4 py-3 text-xs font-semibold text-primary transition active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Agregar más fotos
              </label>
            </div>
          )}

          <Button
            type="submit"
            completa
            disabled={seleccionados.length === 0 || subiendo}
          >
            {subiendo && progreso
              ? `Subiendo ${progreso.actual} de ${progreso.total}...`
              : 'Agregar a la galería'}
          </Button>
        </form>
      </div>

      {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {cargando ? (
          <p className="col-span-2 py-6 text-center text-sm text-ink/50">Cargando...</p>
        ) : (
          fotos.map((foto) => (
            <article key={foto.id} className="overflow-hidden rounded-card bg-white shadow-soft">
              <div className="relative aspect-square bg-surface-high">
                <img src={foto.url} alt={foto.nombre ?? 'Foto'} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setBorrar(foto)}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-600 shadow-soft transition-smooth active:scale-[0.97]"
                  aria-label={`Eliminar ${foto.nombre ?? 'foto'}`}
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
              <p className="truncate px-3 py-2.5 text-xs font-semibold text-ink-strong">
                {foto.nombre ?? 'Diseño sin nombre'}
              </p>
            </article>
          ))
        )}
      </div>

      {borrar && (
        <ConfirmModal
          titulo="¿Eliminar foto?"
          mensaje={`Se eliminará "${borrar.nombre ?? 'esta foto'}" de la galería.`}
          onCancelar={() => setBorrar(null)}
          onAceptar={() => void eliminar()}
        />
      )}
    </section>
  )
}
