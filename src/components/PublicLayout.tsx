import { Outlet, useLocation } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'

export function PublicLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader />
      <main key={location.pathname} className="mx-auto max-w-md animate-fade-up px-5 pb-28 pt-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
