import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchOverlay } from '@/app/context/SearchContext'
import { useTheme } from '@/app/theme/ThemeContext'
import {
  staticDeckRepository,
  staticTopicRepository,
} from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function SearchOverlay() {
  const { closeSearch } = useSearchOverlay()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const topics = staticTopicRepository.listTopics()
  const decks = staticDeckRepository.listDecks()

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return { topics, decks }
    return {
      topics: topics.filter(
        (t) =>
          t.title.toLowerCase().includes(s) ||
          t.category.toLowerCase().includes(s),
      ),
      decks: decks.filter((d) => d.title.toLowerCase().includes(s)),
    }
  }, [q, topics, decks])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSearch])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-16 md:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={closeSearch}
    >
      <div
        className={cn(
          'w-full max-w-lg border bg-alt-surface shadow-2xl rounded-alt',
          theme === 'dark' && 'border-alt-primary/40 shadow-[0_0_24px_rgba(0,255,65,0.08)]',
          theme === 'light' && 'border-alt-border shadow-brutal',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-alt-border p-3">
          <input
            autoFocus
            className="alt-input"
            placeholder="Search topics or decks…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="mt-1 font-mono text-xs text-alt-muted">Esc — close</p>
        </div>
        <ul className="max-h-72 overflow-auto p-2 text-sm">
          {filtered.topics.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="w-full rounded-alt px-2 py-2 text-left text-alt-text hover:bg-alt-surface-elevated"
                onClick={() => {
                  closeSearch()
                  navigate(`/topics/${t.id}`)
                }}
              >
                <span className="font-medium">{t.title}</span>
                <span className="ml-2 text-alt-muted">Topic</span>
              </button>
            </li>
          ))}
          {filtered.decks.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className="w-full rounded-alt px-2 py-2 text-left text-alt-text hover:bg-alt-surface-elevated"
                onClick={() => {
                  closeSearch()
                  navigate(`/review?deckId=${encodeURIComponent(d.id)}`)
                }}
              >
                <span className="font-medium">{d.title}</span>
                <span className="ml-2 text-alt-muted">Deck → Review</span>
              </button>
            </li>
          ))}
          {filtered.topics.length === 0 && filtered.decks.length === 0 && (
            <li className="px-2 py-4 text-center text-alt-muted">
              {q.trim() ? 'No results' : 'No data'}
            </li>
          )}
        </ul>
        <div className="border-t border-alt-border p-2 text-right">
          <button
            type="button"
            className="rounded-alt px-3 py-1 text-sm text-alt-muted hover:bg-alt-surface-elevated"
            onClick={closeSearch}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
