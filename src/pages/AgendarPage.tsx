import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Reveal } from '../components/Reveal'
import { TIPO_REFERENCIA } from '../lib/constantes'
import { supabase } from '../lib/supabase'
import { abrirWhatsapp, citaWhatsapp } from '../lib/whatsapp'
import type { CampoCita, CitaForm, TiposUnia } from '../types'

const formularioVacio: CitaForm = {
  nombre: '',
  telefono: '',
  tipo: '',
  fecha: '',
  hora: '',
}

export function AgendarPage() {
  const [form, setForm] = useState<CitaForm>(formularioVacio)
  const [errores, setErrores] = useState<Partial<Record<CampoCita, string>>>({})
  const [tipos, setTipos] = useState<TiposUnia[]>([])
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    let activo = true
    supabase
      .from('tipos_unia')
      .select('*')
      .order('es_fijo', { ascending: true })
      .order('nombre', { ascending: true })
      .then(({ data }) => {
        if (activo) setTipos((data ?? []) as TiposUnia[])
      })
    return () => {
      activo = false
    }
  }, [])

  const tiposVisibles = tipos.some((tipo) => tipo.nombre === TIPO_REFERENCIA)
    ? tipos
    : [...tipos, { id: 'referencia', nombre: TIPO_REFERENCIA, es_fijo: true, created_at: '' }]

  const actualizar = (campo: CampoCita, valor: string) => {
    const valorFinal = campo === 'telefono' ? valor.replace(/\D/g, '').slice(0, 8) : valor
    setForm((prev) => ({ ...prev, [campo]: valorFinal }))
    setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  const claseCampo = (campo: CampoCita) =>
    `w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm text-ink-strong outline-none transition placeholder:text-ink/35 focus:border-primary focus:ring-2 focus:ring-primary-container/60 ${
      errores[campo]
        ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200/60'
        : 'border-outline'
    }`

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()

    const nuevosErrores: Partial<Record<CampoCita, string>> = {}
    ;(Object.keys(form) as CampoCita[]).forEach((campo) => {
      if (!form[campo].trim()) nuevosErrores[campo] = 'Este campo es obligatorio'
    })

    if (!nuevosErrores.telefono && !/^\d{8}$/.test(form.telefono)) {
      nuevosErrores.telefono = 'Ingresa un número de 8 dígitos'
    }

    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    abrirWhatsapp(citaWhatsapp(form))
    setEnviado(true)
  }

  if (enviado) {
    return (
      <section className="tab-panel pt-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-container text-primary shadow-pill">
          <span className="material-symbols-outlined text-3xl">check</span>
        </div>
        <h1 className="mt-5 font-display text-3xl text-ink-strong">¡Cita enviada!</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink/70">
          Abrimos WhatsApp con los datos de tu cita. Te confirmaremos la disponibilidad muy pronto.
        </p>
        <Button
          className="mt-8"
          variante="outline"
          onClick={() => {
            setForm(formularioVacio)
            setEnviado(false)
          }}
        >
          Agendar otra cita
        </Button>
      </section>
    )
  }

  return (
    <section>
      <Reveal>
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary/70">Reservas</p>
        <h1 className="mt-1 font-display text-3xl leading-tight text-ink-strong">Agenda tu cita</h1>
        <p className="mt-2 text-sm text-ink/70">
          Completa los datos y te enviaremos la solicitud por WhatsApp.
        </p>
      </Reveal>

      <form onSubmit={enviar} className="mt-7 space-y-5">
        <Reveal delay={60}>
          <Field etiqueta="Nombre" error={errores.nombre}>
            <input
              className={claseCampo('nombre')}
              value={form.nombre}
              onChange={(e) => actualizar('nombre', e.target.value)}
              placeholder="Tu nombre completo"
            />
          </Field>
        </Reveal>

        <Reveal delay={120}>
          <Field etiqueta="Teléfono" error={errores.telefono}>
            <input
              className={claseCampo('telefono')}
              value={form.telefono}
              onChange={(e) => actualizar('telefono', e.target.value)}
              placeholder="Ej. 78792776"
              inputMode="numeric"
              maxLength={8}
              pattern="[0-9]{8}"
              autoComplete="tel-national"
            />
          </Field>
        </Reveal>

        <Reveal delay={180}>
          <Field etiqueta="Tipo de uña" error={errores.tipo}>
            <select
              className={claseCampo('tipo')}
              value={form.tipo}
              onChange={(e) => actualizar('tipo', e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              {tiposVisibles.map((tipo) => (
                <option key={tipo.id} value={tipo.nombre}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </Field>
        </Reveal>

        <Reveal delay={240}>
          <div className="grid grid-cols-2 gap-4">
            <Field etiqueta="Fecha" error={errores.fecha}>
              <input
                type="date"
                className={claseCampo('fecha')}
                value={form.fecha}
                onChange={(e) => actualizar('fecha', e.target.value)}
              />
            </Field>
            <Field etiqueta="Hora" error={errores.hora}>
              <input
                type="time"
                className={claseCampo('hora')}
                value={form.hora}
                onChange={(e) => actualizar('hora', e.target.value)}
              />
            </Field>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <Button type="submit" completa className="mt-2">
            <span className="material-symbols-outlined text-lg">send</span>
            Enviar cita
          </Button>
        </Reveal>
      </form>
    </section>
  )
}
