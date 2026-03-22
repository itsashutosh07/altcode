import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import type { QuizQuestion } from '@/entities/types'
import { loadQuizSession } from '@/lib/quizSession'
import {
  staticQuizRepository,
  staticTopicRepository,
} from '@/data/repositories/staticRepositories'
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

  const topics = staticTopicRepository.listTopics()

  const concepts = useMemo(() => {
    const m: Record<string, { ok: number; total: number }> = {}
    for (const r of rows) {
      for (const tid of r.q.topicIds) {
        if (!m[tid]) m[tid] = { ok: 0, total: 0 }
        m[tid].total += 1
        if (r.ok) m[tid].ok += 1
      }
    }
    return Object.entries(m).map(([id, v]) => ({
      id,
      title: topics.find((t) => t.id === id)?.title ?? id,
      ...v,
      weak: v.ok < v.total,
    }))
  }, [rows, topics])

  const missed = rows.filter((r) => !r.ok)
  const correctRows = rows.filter((r) => r.ok)

  const timeUsedSec = useMemo(() => {
    if (!session) return 0
    const cap = session.durationMinutes * 60
    if (session.completedAt) {
      const raw = Math.floor((session.completedAt - session.startedAt) / 1000)
      return Math.min(cap, Math.max(0, raw))
    }
    return cap
  }, [session])

  const xpEarned = useMemo(() => {
    if (rows.length === 0) return 0
    const correct = rows.filter((r) => r.ok).length
    const miss = rows.length - correct
    return score * 2 + correct * 18 + miss * 4
  }, [score, rows])

  const firstMissedId = missed[0]?.q.id
  useEffect(() => {
    setOpenId(firstMissedId ?? null)
  }, [sessionId, firstMissedId])

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

  const scoreColor =
    score >= 70
      ? theme === 'dark'
        ? 'text-alt-primary'
        : 'text-alt-success'
      : 'text-alt-error'

  const completedOn = new Date(
    session.completedAt ?? session.startedAt,
  ).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-[800px] space-y-10 px-1">
      <header className="sticky top-0 z-10 -mx-4 border-b border-alt-border bg-alt-bg/95 px-4 py-3 backdrop-blur-sm md:-mx-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-alt-muted hover:text-alt-text"
        >
          ← Back to dashboard
        </Link>
      </header>

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-alt-text">
            Result Disection
          </h1>
          <p className="mt-2 text-sm text-alt-muted">Completed {completedOn}</p>
        </div>
        <Link
          to="/review?deckId=deck-remediation"
          className={cn(
            'inline-flex shrink-0 items-center justify-center gap-2 rounded-alt px-4 py-2.5 text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'border border-alt-primary text-alt-primary hover:bg-alt-primary/10'
              : 'alt-btn-primary',
          )}
        >
          Generate deck from misses
        </Link>
      </div>

      <div
        className={cn(
          'flex flex-col items-center gap-10 rounded-alt border border-alt-border bg-alt-surface p-8 shadow-sm md:flex-row',
          theme === 'light' && 'shadow-brutal',
        )}
      >
        <div className="flex shrink-0 flex-col items-center text-center">
          <div className={cn('text-6xl font-semibold leading-none tracking-tight', scoreColor)}>
            {score}%
          </div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-alt-muted">
            Overall mastery
          </div>
          <div className="mt-4 flex flex-col gap-1 font-mono text-xs text-alt-muted">
            <span>
              Time used:{' '}
              <span className="text-alt-text">
                {Math.floor(timeUsedSec / 60)}m {(timeUsedSec % 60).toString().padStart(2, '0')}s
              </span>
            </span>
            <span>
              XP earned: <span className="text-alt-primary">+{xpEarned}</span>
            </span>
          </div>
        </div>
        <div className="hidden h-px w-full bg-alt-border md:block md:h-24 md:w-px" />
        <div className="w-full flex-1">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-alt-muted">
            Concept breakdown
          </h3>
          <div className="flex flex-wrap gap-3">
            {concepts.map((c) => (
              <div
                key={c.id}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm',
                  c.weak
                    ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'
                    : 'border-alt-border bg-alt-surface-elevated text-alt-text',
                )}
              >
                <span className="font-medium">{c.title}</span>
                <span className="font-mono text-xs text-alt-muted">
                  {c.ok}/{c.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-alt-muted">
        You answered <strong className="text-alt-text">{correctRows.length}</strong> of{' '}
        <strong className="text-alt-text">{rows.length}</strong> correctly.
      </p>

      {correctRows.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-alt-text">Correct answers</h2>
          <ul className="space-y-2 rounded-alt border border-alt-border bg-alt-surface p-4">
            {correctRows.map(({ q }) => (
              <li
                key={q.id}
                className="flex gap-3 border-b border-alt-border py-2 text-sm last:border-0 last:pb-0 first:pt-0"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-alt-success/20 text-xs font-bold text-alt-success">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-alt-text">{q.prompt}</p>
                  <p className="mt-1 text-alt-muted">
                    <span className="text-alt-success">Optimal:</span> {q.options[q.correctIndex]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {missed.length > 0 ? (
        <section>
          <h2 className="mb-6 text-lg font-semibold text-alt-text">Missed questions detail</h2>
          <div className="space-y-4">
            {missed.map(({ q, picked }, idx) => {
              const open = openId === q.id
              const wrong =
                picked !== undefined ? q.options[picked] : '— (unanswered)'
              const right = q.options[q.correctIndex]
              return (
                <div
                  key={q.id}
                  className={cn(
                    'overflow-hidden rounded-lg border bg-alt-surface shadow-sm',
                    open ? 'border-alt-primary' : 'border-alt-border',
                  )}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between border-b border-alt-border bg-alt-surface-elevated/50 p-5 text-left transition-colors hover:bg-alt-surface-elevated"
                    onClick={() => setOpenId(open ? null : q.id)}
                  >
                    <div className="flex items-start gap-4 pr-4">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                        {idx + 1}
                      </span>
                      <span className="font-medium leading-snug text-alt-text">{q.prompt}</span>
                    </div>
                    <span className="shrink-0 text-alt-muted">{open ? '▲' : '▼'}</span>
                  </button>
                  {open ? (
                    <div className="space-y-6 p-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-alt border border-red-200 bg-red-50/80 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                            Your answer
                          </div>
                          <p className="text-sm text-alt-text">{wrong}</p>
                        </div>
                        <div className="rounded-alt border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            Optimal answer
                          </div>
                          <p className="text-sm text-alt-text">{right}</p>
                        </div>
                      </div>
                      {q.explanation ? (
                        <div className="space-y-4 border-t border-alt-border pt-6 text-sm leading-relaxed text-alt-muted">
                          <h4 className="font-semibold text-alt-text">Explanation</h4>
                          <p>{q.explanation}</p>
                          {q.code ? (
                            <pre className="alt-code-block overflow-x-auto">{q.code}</pre>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>
      ) : (
        <p className="rounded-alt border border-alt-primary/40 bg-alt-primary/5 p-4 text-center text-sm text-alt-muted">
          No misses in this run — strong work.
        </p>
      )}

      <div className="flex flex-wrap gap-3 pb-8">
        <Link to="/dashboard" className="alt-btn-secondary">
          Dashboard
        </Link>
        <Link to="/quiz/new" className="alt-btn-primary">
          Retry quiz
        </Link>
        <Link to="/review?deckId=deck-remediation" className="alt-btn-secondary">
          Remediation deck
        </Link>
      </div>
    </div>
  )
}
