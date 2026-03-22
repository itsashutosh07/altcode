import { Link } from 'react-router-dom'
import { staticTopicRepository } from '@/data/repositories/staticRepositories'

export function TopicsPage() {
  const topics = staticTopicRepository.listTopics()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Topics</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((t) => (
          <div
            key={t.id}
            className="rounded border border-slate-300 bg-white p-5 shadow-sm"
          >
            <p className="text-xs uppercase text-slate-500">{t.category}</p>
            <h2 className="text-lg font-semibold text-slate-900">{t.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.description}</p>
            <p className="mt-2 text-xs text-slate-500">
              {t.cardCount} cards · {t.quizCount} quizzes
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/topics/${t.id}`}
                className="rounded border border-slate-300 px-3 py-1 text-sm"
              >
                Details
              </Link>
              <Link
                to={`/review?deckId=${encodeURIComponent(t.deckId)}`}
                className="rounded bg-slate-800 px-3 py-1 text-sm text-white"
              >
                Study
              </Link>
              <Link
                to={`/quiz/new?topicId=${encodeURIComponent(t.id)}`}
                className="rounded border border-dashed border-slate-400 px-3 py-1 text-sm"
              >
                Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
