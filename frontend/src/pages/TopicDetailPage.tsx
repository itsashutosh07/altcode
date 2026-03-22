import { Link, useParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { staticTopicRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function TopicDetailPage() {
  const { theme } = useTheme()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicId ? staticTopicRepository.getTopicById(topicId) : undefined

  if (!topic) {
    return (
      <div>
        <p className="text-alt-muted">Topic not found.</p>
        <Link to="/topics" className="text-sm text-alt-primary underline">
          Back to topics
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link to="/topics" className="text-sm text-alt-muted underline">
          ← Topics
        </Link>
        <h1 className="alt-page-title mt-2">{topic.title}</h1>
        <p className="text-sm text-alt-muted">{topic.category}</p>
        <p className="mt-4 text-alt-text">{topic.description}</p>
      </div>

      <div
        className={cn(
          'alt-card p-4',
          theme === 'light' && 'angled-panel border-2',
        )}
      >
        <h2 className="font-semibold text-alt-text">Outline</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-alt-muted">
          <li>Core concepts</li>
          <li>Practice cards ({topic.cardCount})</li>
          <li>Quizzes ({topic.quizCount})</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/quiz/new?topicId=${encodeURIComponent(topic.id)}`}
          className="alt-btn-primary"
        >
          Start quiz
        </Link>
        <Link
          to={`/review?deckId=${encodeURIComponent(topic.deckId)}`}
          className="alt-btn-secondary"
        >
          Start review
        </Link>
      </div>
    </div>
  )
}
