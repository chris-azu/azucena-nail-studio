import { Button } from './Button'

type Props = {
  titulo: string
  mensaje: string
  onCancelar: () => void
  onAceptar: () => void
}

export function ConfirmModal({ titulo, mensaje, onCancelar, onAceptar }: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 animate-fade-in sm:place-items-center">
      <div className="w-full animate-fade-up rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:max-w-sm sm:rounded-[1.75rem]">
        <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-primary-container text-primary">
          <span className="material-symbols-outlined">help_outline</span>
        </div>
        <h2 className="text-center font-display text-xl text-ink-strong">{titulo}</h2>
        <p className="mt-2 text-center text-sm text-ink/70">{mensaje}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variante="outline" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button variante="danger" onClick={onAceptar}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
