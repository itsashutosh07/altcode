export type Topic = {
  id: string
  title: string
  category: string
  description: string
  deckId: string
  cardCount: number
  quizCount: number
}

export type Deck = {
  id: string
  title: string
  topicId: string
  dueCount: number
  masteryPercent: number
}

export type Card = {
  id: string
  front: string
  back: string
  code?: string
}

export type QuizQuestion = {
  id: string
  topicIds: string[]
  prompt: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  code?: string
  /** Scenario copy under the prompt (quiz execution). */
  context?: string
  /** One line per option; falls back to empty string. */
  optionHints?: [string, string, string, string]
  /** Shown on result dissection when expanded. */
  explanation?: string
}

export type Forecast14Bar = {
  label: string
  heightPct: number
  tooltip: string
  error?: boolean
}

export type ActivityMatrixConfig = {
  weekCount: number
  datalinkWeekIndex: number
  seed: number
}

/** Static progression snapshot (v1: JSON; later from API). */
export type ProgressionSnapshot = {
  level: number
  title: string
  xp: number
  xpNextLevel: number
  dailyGoalCurrent: number
  dailyGoalTarget: number
}

export type AnalyticsSummary = {
  retentionPercent: number
  retentionDeltaPct: number
  cardsDueToday: number
  streakDays: number
  cardsLearned: number
  deckProgressPct: number
  avgTimePerCardSec: number
  avgTimeDeltaSec: number
  quizzesTaken: number
  cardsMastered: number
  forecast: { date: string; count: number }[]
  forecast14: Forecast14Bar[]
  heatmap: { day: string; intensity: number }[]
  activityMatrix: ActivityMatrixConfig
  progression: ProgressionSnapshot
}
