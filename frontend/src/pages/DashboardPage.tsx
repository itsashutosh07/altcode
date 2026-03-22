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

export function DashboardPage() {
  const { theme } = useTheme()
  const decks = staticDeckRepository.listDecks()
  const summary = staticAnalyticsRepository.getSummary()
  const topics = staticTopicRepository.listTopics()
  const topicById = Object.fromEntries(topics.map((t) => [t.id, t]))
  const p = summary.progression
  const grid = heatGrid(31, 10, 7)
  const dailyPct =
    p.dailyGoalTarget > 0
      ? Math.min(100, (p.dailyGoalCurrent / p.dailyGoalTarget) * 100)
      : 0
  const xpPct =
    p.xpNextLevel > 0 ? Math.min(100, (p.xp / p.xpNextLevel) * 100) : 0

  return (
    <div className="gap-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-10">
        <section
          id="daily"
          className={cn(
            'border border-alt-border bg-alt-surface p-6 md:p-8 rounded-alt',
            theme === 'light' && 'angled-panel shadow-brutal',
            theme === 'dark' && 'border-alt-primary/30',
          )}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-alt-muted">
            Daily objective
          </p>
          <h1 className="alt-page-title mt-2">Command center</h1>
          <p className="mt-2 text-sm text-alt-muted">
            {theme === 'dark' ? (
              <>
                <span className="text-alt-primary">&gt; DAILY_GRIND:</span> {p.dailyGoalCurrent}/
                {p.dailyGoalTarget} · Streak {summary.streakDays}d · Due ~{summary.cardsDueToday}{' '}
                cards
              </>
            ) : (
              <>
                Daily goal {p.dailyGoalCurrent}/{p.dailyGoalTarget} · {summary.streakDays}-day streak ·
                ~{summary.cardsDueToday} cards due
              </>
            )}
          </p>
          <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-alt-border">
            <div
              className="h-full bg-alt-primary transition-all"
              style={{ width: `${dailyPct}%` }}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/review?session=daily" className="alt-btn-primary">
              Start daily review
            </Link>
            <Link to="/quiz/new" className="alt-btn-secondary">
              Start quiz
            </Link>
            <Link to="/topics" className="alt-btn-secondary">
              Browse topics
            </Link>
          </div>
        </section>

        <section>
          <h2
            className={cn(
              'mb-3 text-sm font-semibold uppercase tracking-wide text-alt-muted',
              theme === 'dark' && 'font-mono',
            )}
          >
            Decks
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {decks
              .filter((d) => d.id !== 'deck-remediation')
              .map((d) => (
                <div
                  key={d.id}
                  className={cn(
                    'alt-card p-4 transition-shadow',
                    theme === 'dark' &&
                      'hover:border-alt-primary hover:shadow-[0_0_12px_rgba(0,255,65,0.12)]',
                    theme === 'light' && 'hover:shadow-brutal',
                  )}
                >
                  <h3 className="font-medium text-alt-text">{d.title}</h3>
                  <p className="text-sm text-alt-muted">
                    {d.dueCount} due · {d.masteryPercent}% mastery
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={`/quiz/new?topicId=${encodeURIComponent(d.topicId)}`}
                      className="alt-btn-primary px-2 py-1 text-xs"
                    >
                      {theme === 'dark' ? 'EXECUTE' : 'Quiz'}
                    </Link>
                    <Link
                      to={`/review?deckId=${encodeURIComponent(d.id)}`}
                      className="alt-btn-secondary px-2 py-1 text-xs"
                    >
                      {theme === 'dark' ? 'STUDY' : 'Study'}
                    </Link>
                    <Link
                      to={`/topics/${d.topicId}`}
                      className="self-center text-xs text-alt-muted underline"
                    >
                      {theme === 'dark' ? '[OPEN]' : 'Open'}
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2
              className={cn(
                'text-sm font-semibold uppercase tracking-wide text-alt-muted',
                theme === 'dark' && 'font-mono',
              )}
            >
              Recent topics
            </h2>
            <Link to="/topics" className="text-sm font-medium text-alt-primary hover:underline">
              View directory
            </Link>
          </div>
          <div className="overflow-hidden rounded-alt border border-alt-border">
            {decks
              .filter((d) => d.id !== 'deck-remediation')
              .map((d, i, arr) => {
                const topic = topicById[d.topicId]
                const last = i === arr.length - 1
                return (
                  <Link
                    key={d.id}
                    to={`/topics/${d.topicId}`}
                    className={cn(
                      'flex flex-col gap-3 p-5 transition-colors hover:bg-alt-surface-elevated sm:flex-row sm:items-center sm:justify-between',
                      !last && 'border-b border-alt-border',
                    )}
                  >
                    <div>
                      <p className="font-medium text-alt-text">{topic?.title ?? d.title}</p>
                      <p className="text-xs text-alt-muted">
                        {d.dueCount} due · {topic?.cardCount ?? '—'} cards
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:w-48">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-alt-border">
                        <div
                          className="h-full rounded-full bg-alt-primary"
                          style={{ width: `${Math.min(100, d.masteryPercent)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm font-medium text-alt-text">
                        {d.masteryPercent}%
                      </span>
                    </div>
                  </Link>
                )
              })}
          </div>
        </section>
      </div>

      <aside className="mt-10 space-y-8 xl:mt-0">
        <div>
          <h3
            className={cn(
              'mb-3 text-xs font-semibold uppercase tracking-wider text-alt-muted',
              theme === 'dark' && 'font-mono',
            )}
          >
            Activity heatmap
          </h3>
          <div
            className={cn(
              'rounded-alt border border-alt-border bg-alt-surface p-4',
              theme === 'light' && 'shadow-brutal',
            )}
          >
            <div className="flex gap-1 overflow-x-auto pb-1">
              {grid.map((col, ci) => (
                <div key={ci} className="flex min-w-[14px] flex-1 flex-col gap-1">
                  {col.map((level, ri) => (
                    <div
                      key={ri}
                      title={`${level}`}
                      className={cn(
                        'aspect-square w-full rounded-[2px]',
                        heatmapIntensityClass(theme, level),
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-alt-muted">
              <span>Less</span>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((lv) => (
                  <div key={lv} className={heatmapLegendSwatch(theme, lv)} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        <div>
          <h3
            className={cn(
              'mb-3 text-xs font-semibold uppercase tracking-wider text-alt-muted',
              theme === 'dark' && 'font-mono',
            )}
          >
            Level progress
          </h3>
          <div className="alt-card p-4">
            <p className="text-sm text-alt-text">
              Lv {p.level} — {p.title}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-alt-border">
              <div
                className="h-full bg-alt-cyan dark:bg-alt-primary"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-xs text-alt-muted">
              {p.xp.toLocaleString()} / {p.xpNextLevel.toLocaleString()} XP
            </p>
          </div>
        </div>

        <div
          className={cn(
            'rounded-alt border border-dashed border-alt-border bg-alt-surface p-4 text-center',
            theme === 'dark' && 'font-mono text-xs',
          )}
        >
          <p className="text-alt-muted">Leaderboard</p>
          <p className="mt-2 text-sm text-alt-text">Coming soon</p>
        </div>
      </aside>
    </div>
  )
}
