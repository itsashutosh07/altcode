import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { staticTopicRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function TopicsPage() {
  const { theme } = useTheme()
  const topics = staticTopicRepository.listTopics()
  const categories = useMemo(
    () => [...new Set(topics.map((t) => t.category))].sort(),
    [topics],
  )
  const [category, setCategory] = useState<string | null>(null)
  const filtered = category
    ? topics.filter((t) => t.category === category)
    : topics

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      <aside className="hidden w-[250px] shrink-0 lg:block">
        <p
          className={cn(
            'mb-3 text-xs font-semibold uppercase tracking-wider text-alt-muted',
            theme === 'dark' && 'font-mono',
          )}
        >
          Categories
        </p>
        <nav className="flex flex-col gap-1 border border-alt-border bg-alt-surface p-2 rounded-alt">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={cn(
              'rounded-alt px-3 py-2 text-left text-sm transition-colors',
              category === null
                ? theme === 'dark'
                  ? 'bg-alt-primary/10 text-alt-primary'
                  : 'bg-alt-surface-elevated font-medium text-alt-text shadow-brutal'
                : 'text-alt-muted hover:bg-alt-surface-elevated hover:text-alt-text',
            )}
          >
            All modules
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-alt px-3 py-2 text-left text-sm transition-colors',
                category === c
                  ? theme === 'dark'
                    ? 'bg-alt-primary/10 text-alt-primary'
                    : 'bg-alt-surface-elevated font-medium text-alt-text shadow-brutal'
                  : 'text-alt-muted hover:bg-alt-surface-elevated hover:text-alt-text',
              )}
            >
              {c}
            </button>
          ))}
        </nav>
      </aside>

      <div className="lg:hidden">
        <p className="mb-2 text-xs font-semibold uppercase text-alt-muted">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs',
              category === null ? 'border-alt-primary text-alt-primary' : 'border-alt-border',
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs',
                category === c ? 'border-alt-primary text-alt-primary' : 'border-alt-border',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-6">
        <h1 className="alt-page-title">Topic directory</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((t) => (
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
                  {theme === 'dark' ? '[OPEN]' : 'Details'}
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
    </div>
  )
}
