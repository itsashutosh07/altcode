import { FormEvent, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveQuizSession } from '@/lib/quizSession'
import { shuffle } from '@/lib/shuffle'
import { staticQuizRepository } from '@/data/repositories/staticRepositories'

const ALL_TOPIC_IDS = ['algorithms', 'system-design', 'react-internals'] as const

export function QuizNewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preTopic = searchParams.get('topicId')

  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    if (preTopic && ALL_TOPIC_IDS.includes(preTopic as (typeof ALL_TOPIC_IDS)[number])) {
      return [preTopic]
    }
    return [...ALL_TOPIC_IDS]
  })
  const [duration, setDuration] = useState(15)
  const [error, setError] = useState('')

  const pool = useMemo(
    () => staticQuizRepository.getQuestionsForTopics(selectedTopics),
    [selectedTopics],
  )

  function toggle(id: string) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (selectedTopics.length === 0) {
      setError('Pick at least one topic.')
      return
    }
    if (pool.length === 0) {
      setError('No questions in pool for this selection.')
      return
    }
    const count = Math.min(4, pool.length)
    const picked = shuffle(pool).slice(0, count)
    const sessionId = `q-${Date.now()}`
    saveQuizSession({
      sessionId,
      questionIds: picked.map((q) => q.id),
      durationMinutes: duration,
      startedAt: Date.now(),
      answers: {},
    })
    navigate(`/quiz/${sessionId}`)
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quiz setup</h1>
        <p className="mt-1 text-sm text-slate-600">v0.1 — static question pool</p>
        <form className="mt-6 space-y-6" onSubmit={onSubmit}>
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Topics</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_TOPIC_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selectedTopics.includes(id)
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                  onClick={() => toggle(id)}
                >
                  {id}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="time">
              Time: {duration} min
            </label>
            <input
              id="time"
              type="range"
              min={5}
              max={45}
              step={5}
              className="mt-2 w-full"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded bg-slate-900 py-3 text-sm font-medium text-white md:w-auto md:px-8"
          >
            Start quiz
          </button>
        </form>
      </div>
      <div className="rounded border border-dashed border-slate-400 bg-slate-50 p-6">
        <h2 className="font-semibold text-slate-900">Summary</h2>
        <p className="mt-2 text-sm text-slate-600">
          Questions available: <strong>{pool.length}</strong>
        </p>
        <p className="text-sm text-slate-600">
          You will get up to <strong>{Math.min(4, pool.length || 0)}</strong> questions.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          Estimated difficulty: {pool.length > 4 ? 'Medium' : 'Short pool'}
        </p>
      </div>
    </div>
  )
}
