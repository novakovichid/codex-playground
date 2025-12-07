import { useMemo, useState } from 'react'

import { LobbyCard } from './components/LobbyCard'
import { ModeCard } from './components/ModeCard'
import { Roadmap } from './components/Roadmap'

function App() {
  const [actionLog, setActionLog] = useState<string[]>([
    'API подсказки появятся после нажатия кнопок ниже.',
  ])
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const apiBase = useMemo(
    () => import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8000',
    []
  )

  const pushLog = (message: string) =>
    setActionLog((prev) => [message, ...prev].slice(0, 5))

  const handleCreateRoom = async () => {
    setActiveAction('create')
    pushLog('Создаем комнату с настройками по умолчанию...')

    try {
      const response = await fetch(`${apiBase}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty: 'medium', round_time: 60, rounds: 3 }),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Ошибка при создании комнаты')
      }

      const room = await response.json()
      pushLog(
        `Комната #${room.id} создана. Код: ${room.code}. Раунд: ${room.round_time} сек, сложность: ${room.difficulty}.`
      )
    } catch (error) {
      pushLog(`Не удалось создать комнату: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

  const handleJoinRoom = async () => {
    const code = window.prompt('Введите код комнаты (6 символов):')?.trim().toUpperCase()
    if (!code) {
      pushLog('Код не введён — подключение отменено.')
      return
    }

    setActiveAction('join')
    pushLog(`Ищем комнату с кодом ${code}...`)

    try {
      const response = await fetch(`${apiBase}/rooms/${code}`)
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Комната не найдена')
      }

      const room = await response.json()
      pushLog(`Комната найдена: ведущий #${room.host_id}, раунды: ${room.rounds}, сложность: ${room.difficulty}.`)
    } catch (error) {
      pushLog(`Не удалось подключиться: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

  const handleProfile = async () => {
    setActiveAction('profile')
    pushLog('Запрашиваем подсказки профиля...')

    try {
      const response = await fetch(`${apiBase}/auth/profile`)
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Ошибка запроса профиля')
      }

      const data = await response.json()
      pushLog(`Ответ API: ${data.message}`)
    } catch (error) {
      pushLog(`Не удалось открыть профиль: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

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
            onClick={handleCreateRoom}
            isLoading={activeAction === 'create'}
          />
          <LobbyCard
            title="Играйте в реальном времени"
            description="Описание слов, запретные слова и WebSocket-синхронизация — всё готово для динамичных партий."
            buttonText="Присоединиться"
            onClick={handleJoinRoom}
            isLoading={activeAction === 'join'}
          />
          <LobbyCard
            title="Следите за рейтингом"
            description="Система рейтингов и статистика игроков фиксирует победы, угаданные и объясненные слова."
            buttonText="Открыть профиль"
            onClick={handleProfile}
            isLoading={activeAction === 'profile'}
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
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Живые ответы API</h3>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Live
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Нажмите на действия сверху, и последние события появятся ниже. Бэкенд по умолчанию ожидается на
              {` ${apiBase}`}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {actionLog.map((entry, index) => (
                <li key={`${entry}-${index}`} className="rounded-xl border border-slate-800/80 bg-slate-900 px-3 py-2">
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
