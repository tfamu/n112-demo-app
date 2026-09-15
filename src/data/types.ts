// デモ版のデータ型。本番と同じテーブル構成
// (books / chapters / cards / quizzes / questions / profiles / phases / comments)
// をそのまま写しているが、ここには Postgres がないのでフィールド名は camelCase。

export const STUDY_TRACKS = ['grammar', 'vocab', 'kanji'] as const
export type StudyTrack = (typeof STUDY_TRACKS)[number]

export type ReviewStatus = 'new' | 'learning' | 'known' | 'weak'
export type UserRole = 'admin' | 'member'

export type Example = { jp: string; vi: string }

export type Book = {
  id: string
  track: StudyTrack
  title: string
  sortOrder: number
}

export type Chapter = {
  id: string
  bookId: string
  code: string
  title: string
  sortOrder: number
}

export type Card = {
  id: string
  chapterId: string
  front: string
  reading: string | null
  /** 漢越音（ベトナム語話者向けの音読みの手がかり）。漢字カード以外は空文字。 */
  hanViet: string
  back: string
  examples: Example[]
  extra: string | null
  sortOrder: number
}

export type Quiz = {
  id: string
  chapterId: string
  title: string
  sortOrder: number
}

export type Question = {
  id: string
  quizId: string
  /** クイズとカードの橋渡し。間違えるとこのカードが「要復習」になる。 */
  cardId: string | null
  prompt: string
  choices: string[]
  answerIndex: number
  explanation: string | null
  sortOrder: number
}

export type Profile = {
  id: string
  displayName: string
  avatarIcon: string
  role: UserRole
}

export type Phase = {
  id: number
  name: string
  /** 'YYYY-MM-DD' */
  deadline: string
  /** 模試フェーズには測れる目標がないので空オブジェクト。 */
  targets: Partial<Record<StudyTrack, number>>
}

export type Comment = {
  id: string
  chapterId: string
  userId: string
  body: string
  /** ISO 文字列。 */
  createdAt: string
  isPinned: boolean
}
