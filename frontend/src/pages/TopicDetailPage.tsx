import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { staticTopicRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

type Tab = 'outline' | 'flashcards' | 'quizzes'

export function TopicDetailPage() {
  const { theme } = useTheme()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicId ? staticTopicRepository.getTopicById(topicId) : undefined
  const [tab, setTab] = useState<Tab>('outline')

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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'outline', label: 'Outline' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quizzes', label: 'Quizzes' },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link to="/topics" className="text-sm text-alt-muted underline">
          ← Topics
        </Link>
        <h1 className="alt-page-title mt-2">{topic.title}</h1>
        <p className="text-sm text-alt-muted">{topic.category}</p>
      </div>

      <div
        className={cn(
          'flex flex-wrap gap-2 border-b border-alt-border pb-2',
          theme === 'dark' && 'font-mono text-xs',
        )}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-alt border px-3 py-1.5 text-sm font-medium transition-colors',
              tab === t.id
                ? theme === 'dark'
                  ? 'border-alt-primary text-alt-primary'
                  : 'border-alt-primary bg-alt-surface text-alt-text shadow-brutal'
                : 'border-transparent text-alt-muted hover:border-alt-border hover:text-alt-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'outline' ? (
        <div
          className={cn(
            'alt-card p-6',
            theme === 'light' && 'angled-panel border-2 shadow-brutal',
          )}
        >
          <p className="text-alt-text">{topic.description}</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-alt-muted">
            <li id="sec-core">Core concepts & patterns</li>
            <li id="sec-cards">Practice deck — {topic.cardCount} cards</li>
            <li id="sec-quiz">Timed quizzes — {topic.quizCount} sessions available</li>
          </ul>
          <p className="mt-4 font-mono text-xs text-alt-muted">
            Est. study time: ~{Math.ceil(topic.cardCount / 10) * 5} min (static estimate)
          </p>
        </div>
      ) : null}

      {tab === 'flashcards' ? (
        <div className="alt-card p-6">
          <p className="text-sm text-alt-muted">
            {topic.cardCount} cards in this module. Spaced repetition session opens in Flashcard
            Focus.
          </p>
          <Link
            to={`/review?deckId=${encodeURIComponent(topic.deckId)}`}
            className="alt-btn-primary mt-4 inline-flex"
          >
            Start review
          </Link>
        </div>
      ) : null}

      {tab === 'quizzes' ? (
        <div className="alt-card p-6">
          <p className="text-sm text-alt-muted">
            {topic.quizCount} quiz template(s) tied to this topic in the static pool.
          </p>
          <Link
            to={`/quiz/new?topicId=${encodeURIComponent(topic.id)}`}
            className="alt-btn-primary mt-4 inline-flex"
          >
            Configure quiz
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-alt-border pt-6">
        <Link to={`/quiz/new?topicId=${encodeURIComponent(topic.id)}`} className="alt-btn-primary">
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
