const roadmap = [
  {
    title: 'Hot-seat офлайн',
    description: 'Локальный таймер, очки и смена ролей без интернета.',
    done: true,
  },
  {
    title: 'ИИ-напарник',
    description: 'Тренировочный режим с генерацией слов и оценкой реакций.',
    done: true,
  },
  {
    title: 'Голосовой чат',
    description: 'Передавайте эмоции и ускоряйте объяснение слов.',
    done: false,
  },
  {
    title: 'База слов',
    description: 'Расширенный словарь с сотнями тем и уровней сложности.',
    done: false,
  },
  {
    title: 'Достижения',
    description: 'Коллекция наград за серию побед и сложные слова.',
    done: false,
  },
]

export function Roadmap() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-purple-500/10">
      <h3 className="text-lg font-semibold">Дорожная карта</h3>
      <ul className="mt-3 space-y-3 text-sm text-slate-300">
        {roadmap.map((item) => (
          <li key={item.title} className="flex items-start gap-2">
            <span className={`mt-1 h-3 w-3 rounded-full ${item.done ? 'bg-emerald-400' : 'bg-slate-700'}`} />
            <div>
              <p className="font-medium text-slate-100">{item.title}</p>
              <p className="text-slate-400">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
