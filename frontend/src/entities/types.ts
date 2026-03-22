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
}

export type AnalyticsSummary = {
  retentionPercent: number
  cardsDueToday: number
  streakDays: number
  forecast: { date: string; count: number }[]
  heatmap: { day: string; intensity: number }[]
}
