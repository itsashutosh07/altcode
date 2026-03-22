import { FormEvent, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { StudyOverview } from '@/features/study/StudyOverview'
import { saveQuizSession } from '@/lib/quizSession'
import { shuffle } from '@/lib/shuffle'
import { staticQuizRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

const ALL_TOPIC_IDS = ['algorithms', 'system-design', 'react-internals'] as const

export function QuizNewPage() {
  const { theme } = useTheme()
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

  const setupForm = (
    <div
      className={cn(
        'alt-card p-6',
        theme === 'light' && 'shadow-brutal',
        theme === 'dark' && 'border-alt-border',
      )}
    >
      <h2 className="text-lg font-semibold text-alt-text">Quiz setup</h2>
      <p className="mt-1 text-sm text-alt-muted">
        Configure session — static pool, prototype UI.
      </p>
      <form className="mt-6 space-y-6" onSubmit={onSubmit}>
        <fieldset>
          <legend
            className={cn(
              'text-sm font-medium text-alt-text',
              theme === 'dark' && 'font-mono uppercase tracking-wide',
            )}
          >
            Topics
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALL_TOPIC_IDS.map((id) => {
              const on = selectedTopics.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    'rounded-alt border px-3 py-1 text-sm transition-colors',
                    on &&
                      (theme === 'dark'
                        ? 'border-alt-primary bg-alt-primary/10 text-alt-primary'
                        : 'border-alt-primary bg-alt-surface text-alt-text shadow-brutal'),
                    !on &&
                      'border-alt-border bg-alt-surface text-alt-muted hover:border-alt-border hover:text-alt-text',
                  )}
                  onClick={() => toggle(id)}
                >
                  {id}
                </button>
              )
            })}
          </div>
        </fieldset>
        <div>
          <label className="text-sm font-medium text-alt-text" htmlFor="time">
            Time: {duration} min
          </label>
            <input
              id="time"
              type="range"
              min={5}
              max={60}
              step={5}
            className={cn(
              'mt-2 w-full',
              theme === 'dark' ? 'accent-alt-cyan' : 'accent-alt-primary',
            )}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
        {error ? (
          <p className="text-sm text-alt-error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="alt-btn-primary w-full">
          Start quiz
        </button>
      </form>
      <div className="mt-6 border-t border-alt-border pt-4 text-sm text-alt-muted">
        <p>
          Questions available:{' '}
          <strong className="text-alt-text">{pool.length}</strong> · drawn:{' '}
          <strong className="text-alt-text">{Math.min(4, pool.length || 0)}</strong>
        </p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <StudyOverview variant="quiz" trailing={setupForm} />
    </div>
  )
}
