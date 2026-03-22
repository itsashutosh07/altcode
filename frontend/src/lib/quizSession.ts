export type StoredQuizSession = {
  sessionId: string
  questionIds: string[]
  durationMinutes: number
  startedAt: number
  /** index in questionIds order -> selected option index */
  answers: Record<number, number>
}

const key = (sessionId: string) => `altcode_quiz_${sessionId}`

export function saveQuizSession(session: StoredQuizSession): void {
  sessionStorage.setItem(key(session.sessionId), JSON.stringify(session))
}

export function loadQuizSession(sessionId: string): StoredQuizSession | null {
  const raw = sessionStorage.getItem(key(sessionId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredQuizSession
  } catch {
    return null
  }
}

export function clearQuizSession(sessionId: string): void {
  sessionStorage.removeItem(key(sessionId))
}
