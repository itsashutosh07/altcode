import type { AnalyticsSummary, Card, Deck, QuizQuestion, Topic } from '@/entities/types'

export type TopicRepository = {
  listTopics(): Topic[]
  getTopicById(id: string): Topic | undefined
}

export type DeckRepository = {
  listDecks(): Deck[]
  getDeckById(id: string): Deck | undefined
  getCardsForDeck(deckId: string): Card[]
  /** Daily review: flatten first N cards across decks (prototype). */
  getDailyReviewCards(maxPerDeck?: number): Card[]
}

export type QuizRepository = {
  listQuestions(): QuizQuestion[]
  getQuestionsForTopics(topicIds: string[]): QuizQuestion[]
}

export type AnalyticsRepository = {
  getSummary(): AnalyticsSummary
}
