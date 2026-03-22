import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchOverlay } from '@/app/context/SearchContext'
import { staticDeckRepository } from '@/data/repositories/staticRepositories'
import { staticTopicRepository } from '@/data/repositories/staticRepositories'

export function SearchOverlay() {
  const { closeSearch } = useSearchOverlay()
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-slate-300 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 p-3">
          <input
            autoFocus
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Search topics or decks…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">Esc to close</p>
        </div>
        <ul className="max-h-72 overflow-auto p-2 text-sm">
          {filtered.topics.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="w-full rounded px-2 py-2 text-left hover:bg-slate-100"
                onClick={() => {
                  closeSearch()
                  navigate(`/topics/${t.id}`)
                }}
              >
                <span className="font-medium">{t.title}</span>
                <span className="ml-2 text-slate-500">Topic</span>
              </button>
            </li>
          ))}
          {filtered.decks.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className="w-full rounded px-2 py-2 text-left hover:bg-slate-100"
                onClick={() => {
                  closeSearch()
                  navigate(`/review?deckId=${encodeURIComponent(d.id)}`)
                }}
              >
                <span className="font-medium">{d.title}</span>
                <span className="ml-2 text-slate-500">Deck → Review</span>
              </button>
            </li>
          ))}
          {filtered.topics.length === 0 && filtered.decks.length === 0 && (
            <li className="px-2 py-4 text-center text-slate-500">
              {q.trim() ? 'No results' : 'No data'}
            </li>
          )}
        </ul>
        <div className="border-t border-slate-200 p-2 text-right">
          <button
            type="button"
            className="rounded px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
            onClick={closeSearch}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
