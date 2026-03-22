import { Link, useParams } from 'react-router-dom'
import { staticTopicRepository } from '@/data/repositories/staticRepositories'

export function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicId ? staticTopicRepository.getTopicById(topicId) : undefined

  if (!topic) {
    return (
      <div>
        <p className="text-slate-600">Topic not found.</p>
        <Link to="/topics" className="text-sm underline">
          Back to topics
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link to="/topics" className="text-sm text-slate-600 underline">
          ← Topics
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{topic.title}</h1>
        <p className="text-sm text-slate-500">{topic.category}</p>
        <p className="mt-4 text-slate-700">{topic.description}</p>
      </div>

      <div className="rounded border border-slate-300 bg-white p-4">
        <h2 className="font-semibold text-slate-900">Outline</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
          <li>Core concepts</li>
          <li>Practice cards ({topic.cardCount})</li>
          <li>Quizzes ({topic.quizCount})</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/review?deckId=${encodeURIComponent(topic.deckId)}`}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Start review
        </Link>
        <Link
          to={`/quiz/new?topicId=${encodeURIComponent(topic.id)}`}
          className="rounded border border-slate-300 px-4 py-2 text-sm font-medium"
        >
          Start quiz
        </Link>
      </div>
    </div>
  )
}
