import { Link } from 'react-router-dom'
import {
  staticAnalyticsRepository,
  staticDeckRepository,
} from '@/data/repositories/staticRepositories'

export function DashboardPage() {
  const decks = staticDeckRepository.listDecks()
  const summary = staticAnalyticsRepository.getSummary()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Streak {summary.streakDays}d · Due today ~{summary.cardsDueToday} cards
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/review?session=daily"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Start daily review
        </Link>
        <Link
          to="/topics"
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
        >
          Browse topics
        </Link>
        <Link
          to="/quiz/new"
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
        >
          Start quiz
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Decks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {decks.map((d) => (
            <div
              key={d.id}
              className="rounded border border-slate-300 bg-white p-4 shadow-sm"
            >
              <h3 className="font-medium text-slate-900">{d.title}</h3>
              <p className="text-sm text-slate-600">
                {d.dueCount} due · {d.masteryPercent}% mastery
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/topics/${d.topicId}`}
                  className="text-sm text-slate-700 underline"
                >
                  Open
                </Link>
                <Link
                  to={`/review?deckId=${encodeURIComponent(d.id)}`}
                  className="rounded border border-slate-800 px-2 py-1 text-xs font-medium"
                >
                  Study
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Activity (static)
        </h2>
        <div className="flex gap-1">
          {summary.heatmap.map((h, i) => (
            <div
              key={i}
              title={`${h.day}: ${h.intensity}`}
              className="h-8 w-8 rounded-sm bg-slate-300"
              style={{ opacity: 0.3 + h.intensity * 0.15 }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
