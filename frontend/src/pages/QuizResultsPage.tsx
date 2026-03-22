import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { QuizQuestion } from '@/entities/types'
import { loadQuizSession } from '@/lib/quizSession'
import { staticQuizRepository } from '@/data/repositories/staticRepositories'

type ResultRow = { q: QuizQuestion; ok: boolean; picked?: number }

export function QuizResultsPage() {
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
        <p className="text-slate-600">No results.</p>
        <Link to="/quiz/new" className="text-sm underline">
          Start quiz
        </Link>
      </div>
    )
  }

  const missed = rows.filter((r) => !r.ok)

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Result disection</h1>
        <p className={`mt-2 text-4xl font-bold ${score >= 70 ? 'text-emerald-700' : 'text-red-700'}`}>
          {score}%
        </p>
        <p className="text-sm text-slate-600">
          {rows.filter((r) => r.ok).length} / {rows.length} correct
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/dashboard"
          className="rounded border border-slate-300 px-4 py-2 text-sm"
        >
          Dashboard
        </Link>
        <Link
          to="/quiz/new"
          className="rounded border border-slate-300 px-4 py-2 text-sm"
        >
          Retry quiz
        </Link>
        <Link
          to={`/review?deckId=deck-algo`}
          className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Review deck (stub)
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase text-slate-500">
          Missed ({missed.length})
        </h2>
        <ul className="mt-2 space-y-2">
          {missed.map(({ q, picked }) => (
            <li key={q.id} className="rounded border border-slate-200 bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm"
                onClick={() => setOpenId((id) => (id === q.id ? null : q.id))}
              >
                <span className="font-medium text-slate-900">{q.prompt.slice(0, 80)}…</span>
                <span className="text-slate-400">{openId === q.id ? '−' : '+'}</span>
              </button>
              {openId === q.id ? (
                <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
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
