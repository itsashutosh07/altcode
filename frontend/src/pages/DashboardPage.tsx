import { Link } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import {
  staticAnalyticsRepository,
  staticDeckRepository,
} from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function DashboardPage() {
  const { theme } = useTheme()
  const decks = staticDeckRepository.listDecks()
  const summary = staticAnalyticsRepository.getSummary()

  return (
    <div className="space-y-8">
      <div
        className={cn(
          'border border-alt-border bg-alt-surface p-6 rounded-alt',
          theme === 'light' && 'angled-panel shadow-brutal',
          theme === 'dark' && 'border-alt-primary/30',
        )}
      >
        <h1 className="alt-page-title">Dashboard</h1>
        <p className="mt-2 text-sm text-alt-muted">
          Streak <span className="text-alt-primary">{summary.streakDays}d</span> · Due
          today ~{summary.cardsDueToday} cards
        </p>
        <p className="mt-4 font-mono text-xs text-alt-muted">
          Priority: Quiz first, then flashcards (v0.2 IA)
        </p>
      </div>

      {/* CTAs: quiz first (PRD priority) */}
      <div className="flex flex-wrap gap-3">
        <Link to="/quiz/new" className="alt-btn-primary">
          Start quiz
        </Link>
        <Link to="/review?session=daily" className="alt-btn-secondary">
          Start daily review
        </Link>
        <Link to="/topics" className="alt-btn-secondary">
          Browse topics
        </Link>
      </div>

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
          {decks.map((d) => (
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
                  Quiz
                </Link>
                <Link
                  to={`/review?deckId=${encodeURIComponent(d.id)}`}
                  className="alt-btn-secondary px-2 py-1 text-xs"
                >
                  Study
                </Link>
                <Link
                  to={`/topics/${d.topicId}`}
                  className="self-center text-xs text-alt-muted underline"
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2
          className={cn(
            'mb-2 text-sm font-semibold uppercase tracking-wide text-alt-muted',
            theme === 'dark' && 'font-mono',
          )}
        >
          Activity (static)
        </h2>
        <div className="flex gap-1">
          {summary.heatmap.map((h, i) => (
            <div
              key={i}
              title={`${h.day}: ${h.intensity}`}
              className={cn(
                'h-8 w-8 rounded-alt',
                theme === 'dark' && 'bg-alt-primary/80',
                theme === 'light' && 'bg-alt-primary/60',
              )}
              style={{ opacity: 0.25 + h.intensity * 0.18 }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
