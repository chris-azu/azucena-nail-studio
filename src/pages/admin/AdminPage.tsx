import { useEffect, useState } from 'react'
import { ADMIN_EMAIL } from '../../lib/constantes'
import { supabase } from '../../lib/supabase'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminPanelPage } from './AdminPanelPage'

export function AdminPage() {
  const [sesion, setSesion] = useState<boolean | null>(null)

  useEffect(() => {
    let activo = true
    const aplicarSesion = (session: { user?: { email?: string } } | null) => {
      if (!activo) return
      if (!session || session.user?.email !== ADMIN_EMAIL) {
        if (session) void supabase.auth.signOut()
        setSesion(false)
        return
      }
      setSesion(true)
    }

    supabase.auth.getSession().then(({ data }) => aplicarSesion(data.session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => aplicarSesion(session))

    return () => {
      activo = false
      subscription.unsubscribe()
    }
  }, [])

  if (sesion === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-primary">
        <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
      </div>
    )
  }

  if (!sesion) return <AdminLoginPage />

  return <AdminPanelPage onLogout={() => supabase.auth.signOut()} />
}
