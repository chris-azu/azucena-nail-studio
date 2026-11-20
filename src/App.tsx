import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/PublicLayout'
import { AgendarPage } from './pages/AgendarPage'
import { GaleriaPage } from './pages/GaleriaPage'
import { AdminPage } from './pages/admin/AdminPage'

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<GaleriaPage />} />
        <Route path="/agendar" element={<AgendarPage />} />
      </Route>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
