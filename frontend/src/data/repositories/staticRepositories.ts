import type { Card, Deck, QuizQuestion, Topic } from '@/entities/types'
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

export const staticAnalyticsRepository: AnalyticsRepository = {
  getSummary: () => ({
    retentionPercent: analyticsData.retentionPercent,
    cardsDueToday: analyticsData.cardsDueToday,
    streakDays: analyticsData.streakDays,
    forecast: [...analyticsData.forecast],
    heatmap: [...analyticsData.heatmap],
  }),
}
