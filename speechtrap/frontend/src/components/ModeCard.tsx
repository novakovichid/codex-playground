interface ModeCardProps {
  title: string
  description: string
  badge: string
  items: string[]
  accent?: 'purple' | 'emerald'
}

export function ModeCard({ title, description, badge, items, accent = 'purple' }: ModeCardProps) {
  const accentStyles =
    accent === 'emerald'
      ? 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30'
      : 'bg-purple-500/10 text-purple-200 border-purple-400/30'

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-purple-500/10">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${accentStyles}`}>
          {badge}
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
            <span className="text-slate-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
