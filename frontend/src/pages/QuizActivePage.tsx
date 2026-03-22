import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { StoredQuizSession } from '@/lib/quizSession'
import { loadQuizSession, saveQuizSession } from '@/lib/quizSession'
import { staticQuizRepository } from '@/data/repositories/staticRepositories'

export function QuizActivePage() {
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
        <p className="text-slate-600">Missing or invalid quiz session.</p>
        <Link to="/quiz/new" className="text-sm underline">
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div
        className="h-2 w-full overflow-hidden rounded bg-slate-200"
        title={`${remaining}s left`}
      >
        <div
          className="h-full bg-amber-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-slate-600">
        <span>
          Q{qIndex + 1} / {questions.length}
        </span>
        <span className="font-mono">
          {Math.floor(remaining / 60)}:
          {(remaining % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <div className="rounded border border-slate-300 bg-white p-6 shadow-sm">
        <p className="text-lg text-slate-900">{q.prompt}</p>
        {q.code ? (
          <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 font-mono text-sm text-slate-100">
            {q.code}
          </pre>
        ) : null}
      </div>
      <ul className="space-y-2">
        {q.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              className={`w-full rounded border px-4 py-3 text-left text-sm ${
                selected === i
                  ? 'border-slate-900 bg-slate-100'
                  : 'border-slate-300 bg-white hover:bg-slate-50'
              }`}
              onClick={() => setSelected(i)}
            >
              <span className="font-mono text-slate-500">{String.fromCharCode(65 + i)}.</span>{' '}
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={selected === null}
        className="rounded bg-slate-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-40"
        onClick={onNext}
      >
        {isLast ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}
