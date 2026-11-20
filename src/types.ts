export type TiposUnia = {
  id: string
  nombre: string
  created_at: string
}

export type Foto = {
  id: string
  nombre: string | null
  url: string
  storage_path: string | null
  created_at: string
}

export type CitaForm = {
  nombre: string
  telefono: string
  tipo: string
  fecha: string
  hora: string
}

export type CampoCita = keyof CitaForm
