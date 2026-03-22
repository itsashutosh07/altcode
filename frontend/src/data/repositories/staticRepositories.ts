import type {
  ActivityMatrixConfig,
  Card,
  Deck,
  Forecast14Bar,
  ProgressionSnapshot,
  QuizQuestion,
  Topic,
} from '@/entities/types'
import analyticsData from '@/data/static/analytics.json'
import cardsData from '@/data/static/cards.json'
import decksData from '@/data/static/decks.json'
import quizData from '@/data/static/quiz-questions.json'
import topicsData from '@/data/static/topics.json'
import type {
  AnalyticsRepository,
  DeckRepository,
  QuizRepository,
  TopicRepository,
} from './interfaces'

const topics = topicsData.topics as Topic[]
const decks = decksData.decks as Deck[]
const cardsByDeck = cardsData as Record<string, Card[]>
const questions = quizData.questions as QuizQuestion[]

export const staticTopicRepository: TopicRepository = {
  listTopics: () => [...topics],
  getTopicById: (id) => topics.find((t) => t.id === id),
}

export const staticDeckRepository: DeckRepository = {
  listDecks: () => [...decks],
  getDeckById: (id) => decks.find((d) => d.id === id),
  getCardsForDeck: (deckId) => [...(cardsByDeck[deckId] ?? [])],
  getDailyReviewCards: (maxPerDeck = 2) => {
    const out: Card[] = []
    for (const d of decks) {
      const chunk = (cardsByDeck[d.id] ?? []).slice(0, maxPerDeck)
      out.push(...chunk)
    }
    return out
  },
}

export const staticQuizRepository: QuizRepository = {
  listQuestions: () => [...questions],
  getQuestionsForTopics: (topicIds) => {
    if (topicIds.length === 0) return []
    return questions.filter((q) => q.topicIds.some((t) => topicIds.includes(t)))
  },
}

const rawAnalytics = analyticsData as typeof analyticsData & {
  retentionDeltaPct?: number
  cardsLearned?: number
  deckProgressPct?: number
  avgTimePerCardSec?: number
  avgTimeDeltaSec?: number
  quizzesTaken?: number
  cardsMastered?: number
  forecast14?: Forecast14Bar[]
  activityMatrix?: ActivityMatrixConfig
  progression?: ProgressionSnapshot
}

const DEFAULT_PROGRESSION: ProgressionSnapshot = {
  level: 1,
  title: 'Initiate',
  xp: 0,
  xpNextLevel: 1000,
  dailyGoalCurrent: 0,
  dailyGoalTarget: 20,
}

export const staticAnalyticsRepository: AnalyticsRepository = {
  getSummary: () => ({
    retentionPercent: rawAnalytics.retentionPercent,
    retentionDeltaPct: rawAnalytics.retentionDeltaPct ?? 0,
    cardsDueToday: rawAnalytics.cardsDueToday,
    streakDays: rawAnalytics.streakDays,
    cardsLearned: rawAnalytics.cardsLearned ?? 0,
    deckProgressPct: rawAnalytics.deckProgressPct ?? 0,
    avgTimePerCardSec: rawAnalytics.avgTimePerCardSec ?? 0,
    avgTimeDeltaSec: rawAnalytics.avgTimeDeltaSec ?? 0,
    quizzesTaken: rawAnalytics.quizzesTaken ?? 0,
    cardsMastered: rawAnalytics.cardsMastered ?? 0,
    forecast: [...rawAnalytics.forecast],
    forecast14: [...(rawAnalytics.forecast14 ?? [])],
    heatmap: [...rawAnalytics.heatmap],
    activityMatrix: rawAnalytics.activityMatrix ?? {
      weekCount: 24,
      datalinkWeekIndex: 15,
      seed: 42,
    },
    progression: rawAnalytics.progression ?? DEFAULT_PROGRESSION,
  }),
}
