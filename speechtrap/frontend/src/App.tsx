import { FormEvent, useMemo, useState } from 'react'

import { HotSeat } from './components/HotSeat'
import { LobbyCard } from './components/LobbyCard'
import { ModeCard } from './components/ModeCard'

interface UserPublic {
  id: number
  email: string
  username: string
  rating: number
  created_at: string
}

interface RoomPublic {
  id: number
  code: string
  host_id: number
  difficulty: string
  round_time: number
  rounds: number
  created_at: string
}

interface PlayerStatPublic {
  user_id: number
  games_played: number
  games_won: number
  words_guessed: number
  words_explained: number
  updated_at: string
}

function App() {
  const [actionLog, setActionLog] = useState<string[]>([
    'Зарегистрируйтесь или войдите, чтобы создавать комнаты.',
  ])
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [email, setEmail] = useState('player@example.com')
  const [username, setUsername] = useState('player')
  const [password, setPassword] = useState('secret123')
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserPublic | null>(null)
  const [stats, setStats] = useState<PlayerStatPublic | null>(null)
  const [roomSettings] = useState({ difficulty: 'base', roundTime: 60, rounds: 3 })
  const [createdRoom, setCreatedRoom] = useState<RoomPublic | null>(null)

  const apiBase = useMemo(
    () => import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8000',
    []
  )

  const pushLog = (message: string) => setActionLog((prev) => [message, ...prev].slice(0, 8))

  const withAuthHeaders = (headers: HeadersInit = {}) =>
    token
      ? {
          ...headers,
          Authorization: `Bearer ${token}`,
        }
      : headers

  const handleRegister = async (event?: FormEvent) => {
    event?.preventDefault()
    setActiveAction('register')
    pushLog('Регистрируем нового игрока...')

    try {
      const response = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Не удалось зарегистрировать пользователя')
      }

      const user = (await response.json()) as UserPublic
      setProfile(user)
      pushLog(`Создан аккаунт #${user.id} (${user.username}). Рейтинг: ${user.rating}.`)
      await handleLogin()
    } catch (error) {
      pushLog(`Ошибка регистрации: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

  const handleLogin = async () => {
    setActiveAction('login')
    pushLog('Входим в систему...')

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Неверные учётные данные')
      }

      const data = await response.json()
      setToken(data.access_token)
      pushLog('Токен получен, можно создавать комнаты и обновлять статистику.')
    } catch (error) {
      pushLog(`Не удалось войти: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

  const handleCreateRoom = async () => {
    if (!token) {
      pushLog('Сначала войдите — требуется токен доступа для создания комнаты.')
      return
    }

    setActiveAction('create')
    pushLog('Создаем комнату в базе...')

    try {
      const response = await fetch(`${apiBase}/rooms`, {
        method: 'POST',
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          difficulty: roomSettings.difficulty,
          round_time: roomSettings.roundTime,
          rounds: roomSettings.rounds,
        }),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Ошибка при создании комнаты')
      }

      const room = (await response.json()) as RoomPublic
      setCreatedRoom(room)
      pushLog(
        `Комната #${room.id} создана. Код: ${room.code}. Таймер: ${room.round_time} сек, раунды: ${room.rounds}.`
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

      const room = (await response.json()) as RoomPublic
      pushLog(`Комната найдена: ведущий #${room.host_id}, раунды: ${room.rounds}, сложность: ${room.difficulty}.`)
    } catch (error) {
      pushLog(`Не удалось подключиться: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

  const handleProfile = async () => {
    if (!token) {
      pushLog('Сначала авторизуйтесь, чтобы загрузить профиль.')
      return
    }

    setActiveAction('profile')
    pushLog('Запрашиваем профиль из API...')

    try {
      const response = await fetch(`${apiBase}/auth/me`, { headers: withAuthHeaders() })
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Ошибка запроса профиля')
      }

      const data = (await response.json()) as UserPublic
      setProfile(data)
      pushLog(`Профиль ${data.username}: рейтинг ${data.rating}, создан ${new Date(data.created_at).toLocaleDateString()}.`)
    } catch (error) {
      pushLog(`Не удалось открыть профиль: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

  const handleStats = async () => {
    if (!profile) {
      pushLog('Сначала загрузите профиль пользователя, чтобы получить статистику.')
      return
    }

    setActiveAction('stats')
    pushLog('Загружаем статистику...')

    try {
      const response = await fetch(`${apiBase}/stats/${profile.id}`)
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Статистика отсутствует')
      }

      const playerStats = (await response.json()) as PlayerStatPublic
      setStats(playerStats)
      pushLog(
        `Статистика: игр ${playerStats.games_played}, побед ${playerStats.games_won}, слов угадано ${playerStats.words_guessed}.`
      )
    } catch (error) {
      pushLog(`Не удалось получить статистику: ${(error as Error).message}`)
    } finally {
      setActiveAction(null)
    }
  }

  const handleUpdateStats = async () => {
    if (!profile) {
      pushLog('Получите профиль, чтобы обновить статистику.')
      return
    }

    setActiveAction('stats-update')
    pushLog('Отправляем новую статистику...')

    try {
      const nextStats = {
        games_played: (stats?.games_played ?? 0) + 1,
        games_won: (stats?.games_won ?? 0) + 1,
        words_guessed: (stats?.words_guessed ?? 0) + 3,
        words_explained: (stats?.words_explained ?? 0) + 2,
      }

      const response = await fetch(`${apiBase}/stats/${profile.id}`, {
        method: 'POST',
        headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(nextStats),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Не удалось обновить статистику')
      }

      const updated = (await response.json()) as PlayerStatPublic
      setStats(updated)
      pushLog(
        `Статистика обновлена: игр ${updated.games_played}, побед ${updated.games_won}, слов объяснено ${updated.words_explained}.`
      )
    } catch (error) {
      pushLog(`Ошибка обновления статистики: ${(error as Error).message}`)
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
          <div className="rounded-full bg-purple-500/10 px-4 py-2 text-purple-200">Реальный API</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <HotSeat />
        </div>

        <section className="lg:col-span-2 space-y-4">
          <form
            onSubmit={handleRegister}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-purple-500/10"
          >
            <div className="flex flex-wrap items-end gap-4">
              <div className="grow space-y-2">
                <p className="text-sm uppercase text-slate-400">Регистрация / Вход</p>
                <h2 className="text-2xl font-bold text-slate-50">Заведите аккаунт и получите токен</h2>
                <p className="text-slate-400">Токен нужен, чтобы создавать комнаты и обновлять статистику игрока.</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <label className="flex flex-col text-slate-200">
                  Email
                  <input
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-purple-500 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </label>
                <label className="flex flex-col text-slate-200">
                  Ник
                  <input
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-purple-500 focus:outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col text-slate-200">
                  Пароль
                  <input
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-purple-500 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-500 disabled:opacity-50"
                  disabled={activeAction === 'register'}
                >
                  {activeAction === 'register' ? 'Создание...' : 'Зарегистрировать'}
                </button>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-purple-500/20 transition hover:border-purple-400 disabled:opacity-50"
                  disabled={activeAction === 'login'}
                >
                  {activeAction === 'login' ? 'Входим...' : 'Войти'}
                </button>
              </div>
            </div>
            {token ? (
              <p className="mt-3 text-sm text-emerald-300">Токен получен и сохранен в памяти браузера.</p>
            ) : (
              <p className="mt-3 text-sm text-slate-400">Пока токена нет — нажмите «Войти» после регистрации.</p>
            )}
          </form>

          <LobbyCard
            title="Создание комнаты"
            description="Комнаты живут в базе данных и требуют авторизации. Мы генерируем уникальный код и сохраняем настройки."
            buttonText="Создать комнату"
            onClick={handleCreateRoom}
            isLoading={activeAction === 'create'}
          />
          <LobbyCard
            title="Подключение к комнате"
            description="Проверьте, что код работает: вытащим комнату из API по её уникальному коду."
            buttonText="Присоединиться"
            onClick={handleJoinRoom}
            isLoading={activeAction === 'join'}
          />
          <LobbyCard
            title="Профиль и статистика"
            description="Запрашиваем профиль через защищенный эндпоинт и храним реальную статистику в таблице."
            buttonText="Загрузить профиль"
            onClick={handleProfile}
            isLoading={activeAction === 'profile'}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <ModeCard
              title="Параметры комнаты"
              description="Выберите сложность и длительность раунда перед созданием."
              badge="Игровой процесс"
              accent="emerald"
              items={[
                `Сложность: ${roomSettings.difficulty}`,
                `Раунд: ${roomSettings.roundTime} сек`,
                `Кол-во раундов: ${roomSettings.rounds}`,
              ]}
            />
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-purple-500/10">
              <h4 className="text-lg font-semibold text-slate-50">Статистика игрока</h4>
              {stats ? (
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-200">
                  <div>
                    <dt className="text-slate-400">Игры</dt>
                    <dd className="font-semibold">{stats.games_played}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Победы</dt>
                    <dd className="font-semibold">{stats.games_won}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Угадано</dt>
                    <dd className="font-semibold">{stats.words_guessed}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Объяснено</dt>
                    <dd className="font-semibold">{stats.words_explained}</dd>
                  </div>
                  <div className="col-span-2 text-xs text-slate-400">Обновлено {new Date(stats.updated_at).toLocaleString()}</div>
                </dl>
              ) : (
                <p className="mt-2 text-sm text-slate-400">Статистика появится после загрузки профиля.</p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-full bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 shadow hover:bg-slate-700 disabled:opacity-50"
                  onClick={handleStats}
                  disabled={activeAction === 'stats'}
                >
                  {activeAction === 'stats' ? 'Загрузка...' : 'Получить статистику'}
                </button>
                <button
                  className="rounded-full bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow shadow-purple-500/30 hover:bg-purple-500 disabled:opacity-50"
                  onClick={handleUpdateStats}
                  disabled={activeAction === 'stats-update'}
                >
                  {activeAction === 'stats-update' ? 'Сохраняем...' : 'Добавить победу'}
                </button>
              </div>
            </div>
          </div>

          {createdRoom && (
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5 text-sm text-purple-100">
              <p className="font-semibold">Комната создана:</p>
              <p>
                Код {createdRoom.code}, ведущий #{createdRoom.host_id}, раунды {createdRoom.rounds}, сложность {createdRoom.difficulty}.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Готово к матчу</h3>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">Online</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Все основные механики работают из коробки — создайте аккаунт, откройте комнату и зовите друзей.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li className="rounded-xl border border-slate-800/80 bg-slate-900 px-3 py-2">
                ✅ Регистрация, вход и защищенные запросы через JWT
              </li>
              <li className="rounded-xl border border-slate-800/80 bg-slate-900 px-3 py-2">
                ✅ Комнаты с уникальными кодами, сложностью и таймером
              </li>
              <li className="rounded-xl border border-slate-800/80 bg-slate-900 px-3 py-2">
                ✅ Хранение рейтинга и статистики игроков в базе
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-900 p-4 shadow-lg shadow-purple-500/10">
            <h3 className="text-lg font-semibold">Быстрый старт API</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-300">
              <li>Поднимите стек: <code className="text-purple-300">docker compose up</code></li>
              <li>Откройте <code className="text-purple-300">http://localhost:8000/docs</code></li>
              <li>Протестируйте регистрацию, логин, работу комнат и статистики</li>
            </ol>
            {profile && (
              <div className="mt-3 rounded-xl border border-slate-800/70 bg-slate-950/50 p-3 text-sm text-slate-200">
                <p className="font-semibold">Профиль</p>
                <p>{profile.username} — {profile.email}</p>
                <p className="text-xs text-slate-400">Рейтинг: {profile.rating}</p>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Живые ответы API</h3>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">Live</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Нажмите на действия сверху, и последние события появятся ниже. Бэкенд по умолчанию ожидается на {` ${apiBase}`}.
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
