import { NavLink } from 'react-router-dom'

const enlaces = [
  { to: '/', label: 'Galería', icono: 'photo_library', end: true },
  { to: '/agendar', label: 'Agendar', icono: 'calendar_month', end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-outline/60 bg-white/90 backdrop-blur-lg pb-safe">
      <div className="mx-auto grid max-w-md grid-cols-2 px-6 pt-2">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            end={enlace.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 text-[11px] font-semibold transition ${
                isActive ? 'text-primary' : 'text-ink/45'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="grid h-8 w-14 place-items-center rounded-pill bg-primary-container/0 transition">
                  <span className="material-symbols-outlined text-[22px]">{enlace.icono}</span>
                </span>
                <span>{enlace.label}</span>
                <span
                  className={`h-1 w-1 rounded-full transition ${isActive ? 'bg-primary' : 'bg-transparent'}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
