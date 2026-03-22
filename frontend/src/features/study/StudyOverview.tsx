import { Link } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import {
  staticAnalyticsRepository,
  staticDeckRepository,
  staticTopicRepository,
} from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'
import { heatGrid } from '@/shared/lib/heatGrid'
import {
  heatmapIntensityClass,
  heatmapLegendSwatch,
} from '@/shared/lib/heatmapStyles'

type StudyOverviewProps = {
  variant: 'quiz' | 'review'
  /** Rendered below stats + heatmap (e.g. quiz setup form). */
  trailing?: React.ReactNode
}

export function StudyOverview({ variant, trailing }: StudyOverviewProps) {
  const { theme } = useTheme()
  const s = staticAnalyticsRepository.getSummary()
  const decks = staticDeckRepository.listDecks()
  const topics = staticTopicRepository.listTopics()
  const topicById = Object.fromEntries(topics.map((t) => [t.id, t]))
  const grid = heatGrid(31, 5, 7)

  const goalTitle =
    variant === 'quiz'
      ? 'Start a timed quiz run'
      : `${s.cardsDueToday} flashcards due today`
  const goalBody =
    variant === 'quiz'
      ? 'Pick topics and duration below, then lock in your session.'
      : `Keep your ${s.streakDays}-day streak going. You're building mastery across decks.`
  const primaryHref = variant === 'quiz' ? '#quiz-setup' : '/review?session=daily'
  const primaryLabel = variant === 'quiz' ? 'Jump to quiz setup' : 'Start daily review'

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row">
      <div className="flex flex-1 flex-col gap-10">
        <section>
          <div
            className={cn(
              'flex flex-col gap-6 rounded-alt border border-alt-border bg-alt-surface p-6 sm:flex-row sm:items-center sm:justify-between md:p-8',
              theme === 'light' && 'shadow-brutal',
            )}
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium uppercase tracking-wider text-alt-muted">
                {variant === 'quiz' ? 'Quiz goal' : 'Daily goal'}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-alt-text md:text-3xl">
                {goalTitle}
              </h2>
              <p className="text-base text-alt-muted">{goalBody}</p>
            </div>
            {variant === 'quiz' ? (
              <a
                href={primaryHref}
                className="alt-btn-primary flex h-10 min-w-[160px] shrink-0 items-center justify-center whitespace-nowrap"
              >
                {primaryLabel}
              </a>
            ) : (
              <Link
                to={primaryHref}
                className="alt-btn-primary flex h-10 min-w-[160px] shrink-0 items-center justify-center whitespace-nowrap"
              >
                {primaryLabel}
              </Link>
            )}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-alt-text">
              Recent topics
            </h3>
            <Link
              to="/topics"
              className="text-sm font-medium text-alt-primary hover:underline"
            >
              View all directory
            </Link>
          </div>
          <div className="overflow-hidden rounded-alt border border-alt-border">
            {decks.map((d, i) => {
              const topic = topicById[d.topicId]
              const last = i === decks.length - 1
              return (
                <Link
                  key={d.id}
                  to={
                    variant === 'quiz'
                      ? `/quiz/new?topicId=${encodeURIComponent(d.topicId)}`
                      : `/review?deckId=${encodeURIComponent(d.id)}`
                  }
                  className={cn(
                    'group flex flex-col gap-4 p-5 transition-colors hover:bg-alt-surface-elevated sm:flex-row sm:items-center sm:justify-between',
                    !last && 'border-b border-alt-border',
                  )}
                >
                  <div className="flex w-full flex-col gap-1 sm:w-1/2">
                    <span className="font-medium text-alt-text group-hover:text-alt-primary">
                      {topic?.title ?? d.title}
                    </span>
                    <span className="text-xs text-alt-muted">
                      {d.dueCount} due • {topic?.cardCount ?? '—'} cards • mastery {d.masteryPercent}%
                    </span>
                  </div>
                  <div className="flex w-full items-center gap-4 sm:w-1/2 sm:justify-end">
                    <div className="h-1.5 max-w-[200px] flex-1 overflow-hidden rounded-full bg-alt-border">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          d.masteryPercent >= 100
                            ? 'bg-alt-success'
                            : 'bg-alt-primary',
                        )}
                        style={{ width: `${Math.min(100, d.masteryPercent)}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        'min-w-[40px] text-right text-sm font-medium',
                        d.masteryPercent >= 100 ? 'text-alt-success' : 'text-alt-text',
                      )}
                    >
                      {d.masteryPercent}%
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      <aside className="flex w-full flex-col gap-10 lg:w-[320px] lg:shrink-0">
        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-alt-muted">
            Global stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                ['Cards mastered', String(s.cardsMastered.toLocaleString())],
                ['Current streak', `${s.streakDays} days`, 'text-alt-primary'],
                ['Avg retention', `${s.retentionPercent}%`, 'text-alt-success'],
                ['Quizzes taken', String(s.quizzesTaken)],
              ] as const
            ).map(([label, value, valClass]) => (
              <div
                key={label}
                className={cn(
                  'flex flex-col gap-1 rounded-alt border border-alt-border bg-alt-surface p-4',
                  theme === 'light' && 'shadow-brutal',
                )}
              >
                <span className="text-xs font-medium uppercase tracking-wide text-alt-muted">
                  {label}
                </span>
                <span
                  className={cn('font-mono text-2xl font-bold text-alt-text', valClass)}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="hidden md:block">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-alt-muted">
            30-day activity
          </h3>
          <div
            className={cn(
              'rounded-alt border border-alt-border bg-alt-surface p-5',
              theme === 'light' && 'shadow-brutal',
            )}
          >
            <div className="flex gap-1">
              {grid.map((col, ci) => (
                <div key={ci} className="flex flex-1 flex-col gap-1">
                  {col.map((level, ri) => (
                    <div
                      key={ri}
                      title={`${level} intensity`}
                      className={cn(
                        'aspect-square w-full rounded-[2px]',
                        heatmapIntensityClass(theme, level),
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-alt-muted">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((lv) => (
                  <div key={lv} className={heatmapLegendSwatch(theme, lv)} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </section>

        {trailing ? <div id={variant === 'quiz' ? 'quiz-setup' : undefined}>{trailing}</div> : null}
      </aside>
    </div>
  )
}
