import { LobbyCard } from './components/LobbyCard'
import { ModeCard } from './components/ModeCard'
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

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase text-slate-400">Игровые режимы</p>
                <h2 className="text-2xl font-bold text-slate-50">Без интернета и в одиночку</h2>
                <p className="text-slate-400">Добавили офлайн-возможности и локальный ИИ для быстрых запусков.</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">Новое</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ModeCard
                title="Hot-seat офлайн"
                description="Играйте на одном устройстве: экран передается от рассказчика к угадывающим без подключения к сети."
                badge="Оффлайн"
                accent="emerald"
                items={[
                  'Локальный список заданий и таймер раунда без API.',
                  'Ротация ролей с подсказками, кому передать устройство.',
                  'Подсчет очков и пауза/ресет прямо на устройстве.',
                ]}
              />
              <ModeCard
                title="Одиночный режим с ИИ"
                description="Устройте тренировку: виртуальный напарник генерирует задания и реагирует на ваши ответы."
                badge="ИИ"
                items={[
                  'Набор подсказок и ограниченных подсчетов, имитирующих настоящего игрока.',
                  'Авто-генерация слов по выбранной теме без внешних сервисов.',
                  'Динамическая сложность: чем лучше играете, тем строже ИИ.',
                ]}
              />
            </div>
          </div>
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
