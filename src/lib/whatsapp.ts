import type { CitaForm, Foto } from '../types'

const NUMERO_WHATSAPP = '50578792776'

const urlWhatsapp = (mensaje: string) =>
  `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`

export const cotizarWhatsapp = (foto: Foto) =>
  urlWhatsapp(
    `Hola, quiero cotizar este diseño: ${foto.nombre ?? `Diseño ${foto.id.slice(0, 6)}`}`,
  )

export const citaWhatsapp = (cita: CitaForm) =>
  urlWhatsapp(
    `Hola, quiero agendar una cita:\nNombre: ${cita.nombre}\nTeléfono: ${cita.telefono}\nTipo de uña: ${cita.tipo}\nFecha: ${cita.fecha}\nHora: ${cita.hora}`,
  )

export const abrirWhatsapp = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
