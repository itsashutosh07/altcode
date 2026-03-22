import { Link } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { staticTopicRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function TopicsPage() {
  const { theme } = useTheme()
  const topics = staticTopicRepository.listTopics()

  return (
    <div className="space-y-6">
      <h1 className="alt-page-title">Topics</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((t) => (
          <div
            key={t.id}
            className={cn(
              'alt-card p-5',
              theme === 'light' && 'shadow-brutal',
              theme === 'dark' && 'hover:border-alt-primary/60',
            )}
          >
            <p className="text-xs uppercase text-alt-muted">{t.category}</p>
            <h2 className="text-lg font-semibold text-alt-text">{t.title}</h2>
            <p className="mt-2 text-sm text-alt-muted">{t.description}</p>
            <p className="mt-2 font-mono text-xs text-alt-muted">
              {t.cardCount} cards · {t.quizCount} quizzes
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/topics/${t.id}`}
                className="alt-btn-secondary px-3 py-1 text-sm"
              >
                Details
              </Link>
              <Link
                to={`/quiz/new?topicId=${encodeURIComponent(t.id)}`}
                className="alt-btn-primary px-3 py-1 text-sm"
              >
                Quiz
              </Link>
              <Link
                to={`/review?deckId=${encodeURIComponent(t.deckId)}`}
                className="alt-btn-secondary border-dashed px-3 py-1 text-sm"
              >
                Study
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
