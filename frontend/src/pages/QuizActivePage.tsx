import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { loadQuizSession, saveQuizSession } from '@/lib/quizSession'
import { staticQuizRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

type TimerPhase = 'calm' | 'warn' | 'critical'

function timerPhase(ratio: number): TimerPhase {
  if (ratio > 0.5) return 'calm'
  if (ratio > 0.2) return 'warn'
  return 'critical'
}

export function QuizActivePage() {
  const { theme } = useTheme()
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [tick, setTick] = useState(0)

  const session = sessionId ? loadQuizSession(sessionId) : null

  const questions = useMemo(() => {
    if (!session) return []
    const all = staticQuizRepository.listQuestions()
    return session.questionIds
      .map((id) => all.find((q) => q.id === id))
      .filter(Boolean) as ReturnType<
        typeof staticQuizRepository.listQuestions
      >
  }, [session])

  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const answersRef = useRef(answers)
  answersRef.current = answers

  const endedRef = useRef(false)

  const flush = useCallback(
    (next: Record<number, number>, opts?: { complete?: boolean }) => {
      if (!sessionId) return
      const cur = loadQuizSession(sessionId)
      if (!cur) return
      saveQuizSession({
        ...cur,
        answers: next,
        completedAt: opts?.complete ? Date.now() : cur.completedAt,
      })
    },
    [sessionId],
  )

  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!sessionId) return
    endedRef.current = false
    setQIndex(0)
    const s = loadQuizSession(sessionId)
    setAnswers({ ...(s?.answers ?? {}) })
  }, [sessionId])

  const finishToResults = useCallback(() => {
    if (!sessionId) return
    flush(answersRef.current, { complete: true })
    navigate(`/quiz/${sessionId}/results`, { replace: true })
  }, [flush, navigate, sessionId])

  useEffect(() => {
    if (!sessionId || endedRef.current) return
    const s = loadQuizSession(sessionId)
    if (!s || questions.length === 0) return
    const totalSec = s.durationMinutes * 60
    void tick
    const elapsed = Math.floor((Date.now() - s.startedAt) / 1000)
    const remaining = Math.max(0, totalSec - elapsed)
    if (remaining <= 0) {
      endedRef.current = true
      finishToResults()
    }
  }, [tick, sessionId, questions.length, finishToResults])

  if (!sessionId || !session || questions.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-alt-muted">Missing or invalid quiz session.</p>
        <Link to="/quiz/new" className="text-sm text-alt-primary underline">
          New quiz
        </Link>
      </div>
    )
  }

  const totalSec = session.durationMinutes * 60
  void tick
  const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
  const remaining = Math.max(0, totalSec - elapsed)
  const ratio = totalSec > 0 ? remaining / totalSec : 0
  const phase = timerPhase(ratio)

  const q = questions[qIndex]
  const isLast = qIndex >= questions.length - 1
  const selected = answers[qIndex]

  const setAnswer = (opt: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [qIndex]: opt }
      flush(next)
      return next
    })
  }

  const goQuestion = (i: number) => {
    if (i < 0 || i >= questions.length) return
    setQIndex(i)
  }

  const onNext = () => {
    if (selected === undefined) return
    if (isLast) {
      finishToResults()
      return
    }
    setQIndex((i) => i + 1)
  }

  const onPrev = () => goQuestion(qIndex - 1)

  const timerTile = cn(
    'flex items-center gap-2 rounded-alt border px-3 py-1.5 font-mono text-sm font-medium transition-colors duration-300',
    phase === 'calm' &&
      (theme === 'dark'
        ? 'border-alt-border bg-alt-surface text-alt-cyan'
        : 'border-alt-border bg-alt-surface-elevated text-alt-text'),
    phase === 'warn' &&
      'border-amber-500/70 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    phase === 'critical' &&
      'border-alt-error bg-alt-error/15 text-alt-error shadow-[0_0_12px_rgba(255,0,122,0.2)]',
  )

  const navBtn = (i: number) => {
    const answered = answers[i] !== undefined
    const current = i === qIndex
    return (
      <button
        key={i}
        type="button"
        onClick={() => goQuestion(i)}
        className={cn(
          'flex h-9 w-full items-center justify-center rounded text-sm font-medium transition-colors',
            current &&
            'bg-alt-primary font-bold text-white ring-2 ring-alt-primary ring-offset-2 ring-offset-[var(--alt-bg)]',
          !current &&
            answered &&
            'border border-alt-primary/30 bg-alt-primary/10 text-alt-primary hover:bg-alt-primary/20',
          !current &&
            !answered &&
            'border border-alt-border bg-alt-surface-elevated text-alt-muted hover:border-alt-primary/50',
        )}
      >
        {i + 1}
      </button>
    )
  }

  const hints = q.optionHints

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-alt-border bg-alt-surface px-2 py-3 md:px-4">
        <div className="flex min-w-0 items-center gap-2 md:gap-4">
          <Link
            to="/quiz/new"
            className="flex shrink-0 items-center justify-center rounded-alt border border-alt-border p-2 text-alt-text hover:border-alt-primary"
            aria-label="Back"
          >
            ←
          </Link>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-alt-text md:text-lg">
              Practice quiz
            </h2>
            <p className="hidden font-mono text-xs text-alt-muted sm:block">
              AltCode session · {questions.length} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={timerTile} title={`${remaining}s remaining`}>
            <span aria-hidden>⏱</span>
            <span>
              {Math.floor(remaining / 60)}:
              {(remaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <button type="button" className="alt-btn-primary h-9 px-4 text-sm" onClick={finishToResults}>
            Submit
          </button>
        </div>
      </header>

      <div
        className={cn(
          'h-1 w-full overflow-hidden bg-alt-border',
          phase === 'critical' && 'bg-alt-error/30',
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-1000',
            phase === 'calm' &&
              (theme === 'dark'
                ? 'bg-gradient-to-r from-alt-cyan to-alt-primary'
                : 'bg-alt-primary'),
            phase === 'warn' && 'bg-amber-500',
            phase === 'critical' && 'bg-alt-error',
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-4 lg:flex-row lg:gap-12 lg:p-8">
        <main className="mx-auto w-full max-w-[700px] flex-1 flex-col lg:mx-0">
          <div className="flex flex-col gap-3 border-b border-alt-border pb-6">
            <span className="text-sm font-medium uppercase tracking-wider text-alt-muted">
              Question {qIndex + 1} of {questions.length}
            </span>
            <h1
              className={cn(
                'text-2xl font-semibold leading-tight text-alt-text sm:text-3xl',
                theme === 'dark' && 'font-mono',
              )}
            >
              {q.prompt}
            </h1>
            {q.context ? (
              <p className="text-[15px] leading-relaxed text-alt-muted">{q.context}</p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {q.options.map((opt, i) => {
              const on = selected === i
              return (
                <label
                  key={i}
                  className={cn(
                    'group flex cursor-pointer rounded-lg border bg-alt-surface p-5 shadow-sm transition-colors',
                    on
                      ? 'border-2 border-alt-primary bg-alt-primary/5 dark:bg-alt-primary/10'
                      : 'border border-alt-border hover:border-alt-primary/50',
                    theme === 'light' && !on && 'shadow-brutal',
                  )}
                >
                  <div className="flex w-full items-start gap-4">
                    <div className="mt-0.5 flex h-5 items-center">
                      <input
                        type="radio"
                        name="answer"
                        checked={on}
                        onChange={() => setAnswer(i)}
                        className={cn(
                          'h-4 w-4 border-alt-border',
                          theme === 'dark' ? 'bg-alt-surface' : 'bg-white',
                        )}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <span className="font-semibold text-alt-text">{opt}</span>
                      {hints?.[i] ? (
                        <span className="text-sm leading-snug text-alt-muted">{hints[i]}</span>
                      ) : null}
                    </div>
                  </div>
                </label>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-alt-border pt-6 lg:hidden">
            <button
              type="button"
              onClick={onPrev}
              disabled={qIndex === 0}
              className="rounded px-4 py-2 text-sm font-medium text-alt-muted hover:bg-alt-surface-elevated disabled:opacity-30"
            >
              Previous
            </button>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Question ${i + 1}`}
                  onClick={() => goQuestion(i)}
                  className={cn(
                    'size-2 rounded-full',
                    i === qIndex
                      ? 'bg-alt-primary ring-2 ring-alt-primary/30'
                      : answers[i] !== undefined
                        ? 'bg-alt-primary/40'
                        : 'bg-alt-border',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={onNext}
              disabled={selected === undefined}
              className="alt-btn-primary px-4 py-2 text-sm disabled:opacity-40"
            >
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>

          <div className="mt-8 hidden lg:block">
            <button
              type="button"
              disabled={selected === undefined}
              className="alt-btn-primary disabled:opacity-40"
              onClick={onNext}
            >
              {isLast ? 'Finish' : 'Next question'}
            </button>
          </div>
        </main>

        <aside className="hidden w-[220px] shrink-0 lg:flex">
          <div className="sticky top-28 flex w-full flex-col gap-5 rounded-lg border border-alt-border bg-alt-surface p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-alt-muted">
              Question navigator
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, i) => navBtn(i))}
            </div>
            <div className="mt-2 flex flex-col gap-2.5 border-t border-alt-border pt-5 text-xs text-alt-muted">
              <div className="flex items-center gap-3">
                <div className="size-3.5 rounded border border-alt-primary/30 bg-alt-primary/10" />
                Answered
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3.5 rounded bg-alt-primary" />
                Current
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3.5 rounded border border-alt-border bg-alt-surface-elevated" />
                Unanswered
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
