import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import type { StoredQuizSession } from '@/lib/quizSession'
import { loadQuizSession, saveQuizSession } from '@/lib/quizSession'
import { staticQuizRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

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
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setQIndex(0)
    setSelected(null)
  }, [sessionId])

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
  const q = questions[qIndex]
  const isLast = qIndex >= questions.length - 1

  function persistAnswer(optionIndex: number) {
    if (!session) return
    const next: StoredQuizSession = {
      sessionId: session.sessionId,
      questionIds: [...session.questionIds],
      durationMinutes: session.durationMinutes,
      startedAt: session.startedAt,
      answers: { ...session.answers, [qIndex]: optionIndex },
    }
    saveQuizSession(next)
  }

  function onNext() {
    if (selected === null) return
    persistAnswer(selected)
    if (isLast) {
      navigate(`/quiz/${sessionId}/results`, { replace: true })
      return
    }
    setQIndex((i) => i + 1)
    setSelected(null)
  }

  const pct = totalSec > 0 ? (remaining / totalSec) * 100 : 0

  const timerBarClass =
    theme === 'dark'
      ? 'bg-gradient-to-r from-alt-cyan to-alt-primary'
      : 'bg-alt-primary'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div
        className={cn(
          'h-2 w-full overflow-hidden rounded-alt bg-alt-border',
          theme === 'dark' && 'ring-1 ring-alt-cyan/30',
        )}
        title={`${remaining}s left`}
      >
        <div
          className={cn('h-full transition-all', timerBarClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-alt-muted">
        <span className={theme === 'dark' ? 'font-mono' : ''}>
          Q{qIndex + 1} / {questions.length}
        </span>
        <span className="font-mono text-alt-cyan">{theme === 'dark' ? 'T-' : ''}
          {Math.floor(remaining / 60)}:
          {(remaining % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <div
        className={cn(
          'alt-card p-6 shadow-none',
          theme === 'dark' && 'border-alt-border shadow-[inset_0_0_0_1px_rgba(51,51,51,1)]',
          theme === 'light' && 'shadow-brutal',
        )}
      >
        <p className={cn('text-lg text-alt-text', theme === 'dark' && 'font-mono')}>
          {q.prompt}
        </p>
        {q.code ? <pre className="alt-code-block mt-4">{q.code}</pre> : null}
      </div>
      <ul className="space-y-2">
        {q.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              className={cn(
                'w-full rounded-alt border px-4 py-3 text-left text-sm transition-colors',
                selected === i
                  ? theme === 'dark'
                    ? 'border-alt-primary bg-alt-primary/10 text-alt-primary'
                    : 'border-alt-primary bg-alt-surface-elevated text-alt-text shadow-brutal'
                  : 'border-alt-border bg-alt-surface hover:border-alt-primary/60',
              )}
              onClick={() => setSelected(i)}
            >
              <span className="font-mono text-alt-muted">{String.fromCharCode(65 + i)}.</span>{' '}
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={selected === null}
        className="alt-btn-primary disabled:pointer-events-none disabled:opacity-40"
        onClick={onNext}
      >
        {isLast ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}
