import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { staticDeckRepository } from '@/data/repositories/staticRepositories'

export function ReviewPage() {
  const [searchParams] = useSearchParams()
  const session = searchParams.get('session')
  const deckId = searchParams.get('deckId')

  const cards = useMemo(() => {
    if (session === 'daily') {
      return staticDeckRepository.getDailyReviewCards(2)
    }
    if (deckId) {
      return staticDeckRepository.getCardsForDeck(deckId)
    }
    return []
  }, [session, deckId])

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const card = cards[index]
  const done = cards.length > 0 && index >= cards.length

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [session, deckId, cards.length])

  const advance = useCallback(
    (nextIndex: number) => {
      setFlipped(false)
      setIndex(nextIndex)
    },
    [],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || !card) return
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
      if (!flipped) return
      const g = Number(e.key)
      if (g >= 1 && g <= 4) {
        e.preventDefault()
        advance(index + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, flipped, index, advance, done])

  if (cards.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Review</h1>
        <p className="text-slate-600">No cards for this session (check deckId or daily).</p>
        <Link to="/dashboard" className="text-sm underline">
          Dashboard
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-xl font-bold">Session complete</h1>
        <p className="text-slate-600">v0.1 — no SM-2 persistence yet.</p>
        <Link
          to="/dashboard"
          className="inline-block rounded bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link to="/dashboard" className="underline">
          Exit
        </Link>
        <span>
          {index + 1} / {cards.length}
        </span>
      </div>
      <div
        className="min-h-[240px] cursor-pointer rounded-lg border-2 border-slate-400 bg-white p-8 shadow-sm"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setFlipped((f) => !f)
          }
        }}
      >
        <p className="text-xs uppercase text-slate-500">
          {flipped ? 'Answer' : 'Question'}
        </p>
        <p className="mt-4 text-lg text-slate-900">
          {flipped ? card.back : card.front}
        </p>
        {card.code ? (
          <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 font-mono text-sm text-slate-100">
            {card.code}
          </pre>
        ) : null}
      </div>
      <p className="text-center text-xs text-slate-500">
        Space — flip · after flip, 1–4 — grade &amp; next
      </p>
      {flipped ? (
        <div className="flex flex-wrap justify-center gap-2">
          {(['Again', 'Hard', 'Good', 'Easy'] as const).map((label, i) => (
            <button
              key={label}
              type="button"
              className="rounded border border-slate-400 px-3 py-2 text-sm"
              onClick={() => advance(index + 1)}
            >
              [{i + 1}] {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
