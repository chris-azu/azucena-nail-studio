import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { supabase } from '../../lib/supabase'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const entrar = async (evento: FormEvent) => {
    evento.preventDefault()
    setCargando(true)
    setError(null)

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-safe">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm font-semibold text-primary">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Galería
          </Link>
          <img src="/logo-azucena.png" alt="" className="h-9 w-9 rounded-full object-cover" />
        </header>

        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white shadow-soft">
            <img src="/logo-azucena.png" alt="Azucena Nail Studio" className="h-16 w-16 rounded-full" />
          </div>
          <h1 className="mt-6 text-center font-display text-3xl text-ink-strong">
            Bienvenida de nuevo
          </h1>
          <p className="mt-2 text-center text-sm text-ink/70">
            Ingresa tus credenciales de administrador
          </p>

          <form onSubmit={entrar} className="mt-9 space-y-5">
            <Field etiqueta="Usuario">
              <input
                type="email"
                autoComplete="username"
                className="w-full rounded-pill border border-outline bg-white/70 px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </Field>

            <Field etiqueta="Contraseña">
              <div className="relative">
                <input
                  type={mostrar ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full rounded-pill border border-outline bg-white/70 px-5 py-3.5 pr-14 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrar((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50"
                  aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {mostrar ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </Field>

            {error && (
              <p className="rounded-2xl bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>
            )}

            <Button type="submit" completa disabled={cargando} variante="outline" className="mt-2">
              {cargando ? 'Entrando...' : 'Entrar al panel'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
