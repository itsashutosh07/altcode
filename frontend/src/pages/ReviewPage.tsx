import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { StudyOverview } from '@/features/study/StudyOverview'
import {
  staticAnalyticsRepository,
  staticDeckRepository,
} from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function ReviewPage() {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const session = searchParams.get('session')
  const deckId = searchParams.get('deckId')

  const isHub = !session && !deckId

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
  const [graded, setGraded] = useState(0)

  const card = cards[index]
  const done = cards.length > 0 && index >= cards.length

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
    setGraded(0)
  }, [session, deckId, cards.length])

  const advance = useCallback(
    (nextIndex: number) => {
      setFlipped(false)
      if (nextIndex > index) setGraded((g) => g + 1)
      setIndex(nextIndex)
    },
    [index],
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

  const summary = staticAnalyticsRepository.getSummary()

  if (isHub) {
    return (
      <div className="space-y-8">
        <StudyOverview variant="review" />
        <p className="text-center text-sm text-alt-muted">
          Pick a deck from recent topics,{' '}
          <Link to="/topics" className="text-alt-primary underline">
            browse all topics
          </Link>
          , or start a{' '}
          <Link to="/review?session=daily" className="text-alt-primary underline">
            daily review
          </Link>
          .
        </p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="alt-page-title">Review</h1>
        <p className="text-alt-muted">No cards for this session.</p>
        <Link to="/review" className="text-sm text-alt-primary underline">
          Flashcards overview
        </Link>
      </div>
    )
  }

  const xpGained = cards.length * 12 + graded * 3

  if (done) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <h1 className="alt-page-title">Session complete</h1>
        <div className="alt-card border-alt-primary/40 p-6 text-left">
          <p className="text-sm text-alt-muted">Session summary (static v1)</p>
          <p className="mt-2 text-2xl font-bold text-alt-primary">+{xpGained} XP</p>
          <p className="mt-2 text-sm text-alt-text">
            Cards reviewed: {cards.length} · Grades logged: {graded}
          </p>
          <p className="mt-2 text-sm text-alt-muted">
            Streak (account): {summary.streakDays} days · SM-2 scheduling ships with backend phase.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="alt-btn-primary inline-flex">
            Dashboard
          </Link>
          <Link to="/review" className="alt-btn-secondary inline-flex">
            Flashcards home
          </Link>
        </div>
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

  const progressPct = ((index + 1) / cards.length) * 100

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-alt-border">
        <div
          className="h-full bg-alt-primary transition-all duration-300 dark:bg-gradient-to-r dark:from-alt-cyan dark:to-alt-primary"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-alt-muted">
        <Link to="/review" className="font-mono underline hover:text-alt-primary">
          [← OVERVIEW]
        </Link>
        <span className="font-mono">
          {index + 1} / {cards.length}
        </span>
        {theme === 'dark' ? (
          <span className="font-mono text-alt-cyan">
            combo: {graded > 0 ? graded : '—'}
          </span>
        ) : (
          <span className="text-xs text-alt-muted">
            Streak this session: {graded > 0 ? graded : '—'}
          </span>
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
