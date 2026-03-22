import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import type { QuizQuestion } from '@/entities/types'
import { loadQuizSession } from '@/lib/quizSession'
import { staticQuizRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

type ResultRow = { q: QuizQuestion; ok: boolean; picked?: number }

export function QuizResultsPage() {
  const { theme } = useTheme()
  const { sessionId } = useParams<{ sessionId: string }>()
  const [openId, setOpenId] = useState<string | null>(null)

  const session = sessionId ? loadQuizSession(sessionId) : null

  const { score, rows } = useMemo(() => {
    if (!session) return { score: 0, rows: [] as ResultRow[] }
    const questions = staticQuizRepository.listQuestions()
    const list = session.questionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter(Boolean) as ReturnType<typeof staticQuizRepository.listQuestions>

    let correct = 0
    const rows = list.map((q, i) => {
      const picked = session.answers[i]
      const ok = picked === q.correctIndex
      if (ok) correct += 1
      return { q, ok, picked }
    })
    const score = list.length ? Math.round((correct / list.length) * 100) : 0
    return { score, rows }
  }, [session])

  if (!sessionId || !session) {
    return (
      <div>
        <p className="text-alt-muted">No results.</p>
        <Link to="/quiz/new" className="text-sm text-alt-primary underline">
          Start quiz
        </Link>
      </div>
    )
  }

  const missed = rows.filter((r) => !r.ok)
  const scoreColor =
    score >= 70
      ? theme === 'dark'
        ? 'text-alt-primary'
        : 'text-alt-success'
      : 'text-alt-error'

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="alt-page-title">Result disection</h1>
        <p className={cn('mt-2 text-4xl font-bold', scoreColor)}>{score}%</p>
        <p className="text-sm text-alt-muted">
          {rows.filter((r) => r.ok).length} / {rows.length} correct
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard" className="alt-btn-secondary">
          Dashboard
        </Link>
        <Link to="/quiz/new" className="alt-btn-secondary">
          Retry quiz
        </Link>
        <Link to={`/review?deckId=deck-algo`} className="alt-btn-primary">
          Review deck (stub)
        </Link>
      </div>

      <section>
        <h2
          className={cn(
            'mb-2 text-sm font-semibold uppercase text-alt-muted',
            theme === 'dark' && 'font-mono',
          )}
        >
          Missed ({missed.length})
        </h2>
        <ul className="mt-2 space-y-2">
          {missed.map(({ q, picked }) => (
            <li key={q.id} className="alt-card overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-alt-text"
                onClick={() => setOpenId((id) => (id === q.id ? null : q.id))}
              >
                <span className="font-medium">{q.prompt.slice(0, 80)}…</span>
                <span className="text-alt-muted">{openId === q.id ? '−' : '+'}</span>
              </button>
              {openId === q.id ? (
                <div className="border-t border-alt-border px-4 py-3 text-sm text-alt-muted">
                  <p>Correct: {q.options[q.correctIndex]}</p>
                  {picked !== undefined ? (
                    <p className="mt-1">You chose: {q.options[picked]}</p>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
