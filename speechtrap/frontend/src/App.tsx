import { LobbyCard } from './components/LobbyCard'
import { Roadmap } from './components/Roadmap'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-sm uppercase text-slate-400">Онлайн Taboo</p>
            <h1 className="text-3xl font-bold">SpeechTrap 🎯</h1>
            <p className="text-slate-400">Командная игра в реальном времени с рейтингом и гибкими комнатами</p>
          </div>
          <div className="rounded-full bg-purple-500/10 px-4 py-2 text-purple-200">v0.1.0</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          <LobbyCard
            title="Соберите друзей"
            description="Создавайте комнаты до 8 игроков, настраивайте сложность слов, таймер и количество раундов."
            buttonText="Создать комнату"
          />
          <LobbyCard
            title="Играйте в реальном времени"
            description="Описание слов, запретные слова и WebSocket-синхронизация — всё готово для динамичных партий."
            buttonText="Присоединиться"
          />
          <LobbyCard
            title="Следите за рейтингом"
            description="Система рейтингов и статистика игроков фиксирует победы, угаданные и объясненные слова."
            buttonText="Открыть профиль"
          />
        </section>

        <aside className="space-y-4">
          <Roadmap />
          <div className="rounded-2xl bg-slate-900 p-4 shadow-lg shadow-purple-500/10">
            <h3 className="text-lg font-semibold">Быстрый старт API</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-300">
              <li>Поднимите стек: <code className="text-purple-300">docker compose up</code></li>
              <li>Откройте <code className="text-purple-300">http://localhost:8000/docs</code></li>
              <li>Протестируйте регистрацию, логин и работу комнат</li>
            </ol>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
