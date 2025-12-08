import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { tabooDeck, type TabooCard } from '../utils/deck'

const defaultRoundSeconds = 60

type DifficultyFilter = 'all' | 'base' | 'medium' | 'hard'

const difficultyLabels: Record<DifficultyFilter, string> = {
  all: 'Все уровни',
  base: 'База',
  medium: 'Средние',
  hard: 'Сложные',
}

export function HotSeat() {
  const [roundLength, setRoundLength] = useState(defaultRoundSeconds)
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [currentCard, setCurrentCard] = useState<TabooCard | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(defaultRoundSeconds)
  const [guessed, setGuessed] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  const usedCardsRef = useRef<Set<number>>(new Set())
  const timerRef = useRef<number | null>(null)

  const availableDeck = useMemo(
    () => (difficulty === 'all' ? tabooDeck : tabooDeck.filter((card) => card.difficulty === difficulty)),
    [difficulty]
  )

  const drawCard = useCallback((): TabooCard => {
    if (!availableDeck.length) {
      return tabooDeck[0]
    }

    const pool = availableDeck.filter((card) => !usedCardsRef.current.has(card.id))
    const source = pool.length ? pool : availableDeck
    if (!pool.length) {
      usedCardsRef.current.clear()
    }
    const pick = source[Math.floor(Math.random() * source.length)]
    usedCardsRef.current.add(pick.id)
    return pick
  }, [availableDeck])

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((seconds) => {
          if (seconds <= 1) {
            stopTimer()
            setIsActive(false)
            setBestScore((prev) => Math.max(prev, guessed))
            return 0
          }
          return seconds - 1
        })
      }, 1000)
    }

    return () => stopTimer()
  }, [isActive, guessed])

  useEffect(() => {
    setCurrentCard(drawCard())
  }, [drawCard])

  const startRound = () => {
    usedCardsRef.current.clear()
    setGuessed(0)
    setSkipped(0)
    setTimeLeft(roundLength)
    setCurrentCard(drawCard())
    setIsActive(true)
  }

  const stopRound = () => {
    stopTimer()
    setIsActive(false)
    setBestScore((prev) => Math.max(prev, guessed))
  }

  const handleGuess = () => {
    if (!isActive) return
    setGuessed((score) => score + 1)
    setCurrentCard(drawCard())
  }

  const handleSkip = () => {
    if (!isActive) return
    setSkipped((count) => count + 1)
    setCurrentCard(drawCard())
  }

  const progress = Math.max(0, Math.round((timeLeft / roundLength) * 100))

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 shadow-lg shadow-emerald-500/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-emerald-300">Горячий стул</p>
          <h2 className="text-2xl font-bold text-white">Играй прямо сейчас</h2>
          <p className="text-sm text-slate-300">Локальный раунд: объясняй слова, не называя запретные.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Боевой режим
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-inner shadow-emerald-500/10">
            <div className="flex items-center justify-between text-xs uppercase text-slate-400">
              <span>Раунд {roundLength} сек</span>
              <span>Сложность: {difficultyLabels[difficulty]}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div
                style={{ width: `${progress}%` }}
                className={`h-2 rounded-full ${progress > 50 ? 'bg-emerald-400' : 'bg-amber-400'}`}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-slate-300">Осталось времени</p>
                <p className="text-3xl font-bold text-white">{timeLeft.toString().padStart(2, '0')} сек</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={startRound}
                  className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white shadow shadow-emerald-500/40 transition hover:bg-emerald-500"
                >
                  {isActive ? 'Перезапустить' : 'Старт раунда'}
                </button>
                <button
                  onClick={stopRound}
                  disabled={!isActive}
                  className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-semibold text-slate-100 shadow transition hover:border-emerald-400 disabled:opacity-50"
                >
                  Стоп
                </button>
              </div>
            </div>
          </div>

          {currentCard && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow shadow-emerald-500/20">
              <div className="flex items-center justify-between text-xs uppercase text-emerald-200">
                <span>{currentCard.difficulty === 'base' ? 'Простое' : currentCard.difficulty === 'medium' ? 'Продвинутое' : 'Хард'}</span>
                <span>Не произноси:</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-3xl font-black text-white">{currentCard.term}</h3>
                <ul className="flex flex-wrap gap-2 text-sm text-emerald-100">
                  {currentCard.taboo.map((word) => (
                    <li key={word} className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-100">
                      {word}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex gap-2 text-sm font-semibold">
                <button
                  onClick={handleGuess}
                  disabled={!isActive}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-white shadow shadow-emerald-500/40 transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  Угадано +1
                </button>
                <button
                  onClick={handleSkip}
                  disabled={!isActive}
                  className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-emerald-100 shadow transition hover:border-emerald-200 disabled:opacity-50"
                >
                  Пасс
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow shadow-emerald-500/10">
          <h3 className="text-lg font-semibold text-white">Результаты раунда</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div>
              <dt className="text-slate-400">Угадано</dt>
              <dd className="text-2xl font-bold text-emerald-300">{guessed}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Пасс</dt>
              <dd className="text-2xl font-bold text-amber-300">{skipped}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Лучший результат</dt>
              <dd className="text-xl font-bold text-emerald-200">{bestScore}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Статус</dt>
              <dd className="text-sm font-semibold text-white">{isActive ? 'Раунд идёт' : 'Пауза'}</dd>
            </div>
          </dl>

          <div className="space-y-2 text-sm">
            <p className="text-slate-400">Фильтр сложности</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(difficultyLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setDifficulty(value as DifficultyFilter)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    difficulty === value
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <label className="text-slate-400" htmlFor="roundLength">
              Длительность раунда: {roundLength} сек
            </label>
            <input
              id="roundLength"
              type="range"
              min={30}
              max={120}
              step={15}
              value={roundLength}
              onChange={(event) => setRoundLength(Number(event.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          <p className="rounded-lg bg-slate-900/70 p-3 text-xs text-slate-400">
            Запускайте раунды для локальной игры «горячий стул»: объясняйте термины друзьям, следите за таймером и счётом без всякого отладочного UI.
          </p>
        </div>
      </div>
    </section>
  )
}
