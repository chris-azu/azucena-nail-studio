import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminPanelPage } from './AdminPanelPage'

export function AdminPage() {
  const [sesion, setSesion] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(Boolean(data.session)))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => setSesion(Boolean(session)))

    return () => subscription.unsubscribe()
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
