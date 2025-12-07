import { ArrowRight } from '../utils/icons'

interface LobbyCardProps {
  title: string
  description: string
  buttonText: string
}

export function LobbyCard({ title, description, buttonText }: LobbyCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-purple-500/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-1 text-slate-300">{description}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-500">
          {buttonText}
          <ArrowRight />
        </button>
      </div>
    </div>
  )
}
