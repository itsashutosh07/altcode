import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { staticDeckRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function ReviewPage() {
  const { theme } = useTheme()
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

  const advance = useCallback((nextIndex: number) => {
    setFlipped(false)
    setIndex(nextIndex)
  }, [])

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
        <h1 className="alt-page-title">Review</h1>
        <p className="text-alt-muted">No cards for this session.</p>
        <Link to="/dashboard" className="text-sm text-alt-primary underline">
          Dashboard
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="alt-page-title">Session complete</h1>
        <p className="text-alt-muted">v0.2 — static prototype; no SM-2 yet.</p>
        <Link to="/dashboard" className="alt-btn-primary inline-flex">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const gradeLabels = ['Again', 'Hard', 'Good', 'Easy'] as const
  const darkGradeStyles = [
    'border-alt-error text-alt-error hover:bg-alt-error/10',
    'border-amber-500 text-amber-400 hover:bg-amber-500/10',
    'border-alt-primary text-alt-primary hover:bg-alt-primary/10',
    'border-alt-cyan text-alt-cyan hover:bg-alt-cyan/10',
  ] as const
  const gradeClass = (i: number) =>
    cn(
      'rounded-alt border px-3 py-2 text-sm font-medium transition-colors',
      theme === 'dark' && darkGradeStyles[i],
      theme === 'light' && 'border-alt-border hover:border-alt-primary',
    )

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between text-sm text-alt-muted">
        <Link to="/dashboard" className="font-mono underline hover:text-alt-primary">
          [EXIT]
        </Link>
        <span className="font-mono">
          {index + 1} / {cards.length}
        </span>
        {theme === 'dark' && (
          <span className="font-mono text-alt-cyan">combo: —</span>
        )}
      </div>

      <div
        className={cn(
          'min-h-[280px] cursor-pointer border-2 bg-alt-surface p-8 transition-shadow rounded-alt',
          theme === 'dark' &&
            'border-alt-border shadow-[inset_0_0_0_1px_rgba(51,51,51,1)] hover:border-alt-primary/50',
          theme === 'light' && 'border-alt-border shadow-brutal',
        )}
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
        <p className="text-xs uppercase text-alt-muted">
          {flipped ? 'Answer' : 'Question'}
        </p>
        <p
          className={cn(
            'mt-4 text-lg text-alt-text',
            theme === 'dark' && 'font-mono',
          )}
        >
          {flipped ? card.back : card.front}
        </p>
      </div>

      <p className="text-center font-mono text-xs text-alt-muted">
        Space — flip · 1–4 — grade
      </p>

      {flipped ? (
        <div className="flex flex-wrap justify-center gap-2">
          {gradeLabels.map((label, i) => (
            <button
              key={label}
              type="button"
              className={gradeClass(i)}
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
