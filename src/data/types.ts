// Kiểu dữ liệu của bản demo. Giữ đúng hình dạng các bảng của bản thật
// (books / chapters / cards / quizzes / questions / profiles / phases / comments)
// nhưng đặt tên field theo camelCase vì ở đây không có Postgres.

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
  /** Âm Hán Việt — chỉ dùng cho thẻ 漢字, thẻ khác để chuỗi rỗng. */
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
  /** Cầu nối quiz <-> flashcard: trả lời sai thì thẻ này bị đánh dấu "cần review". */
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
  /** Phase thi thử không có target đo được -> object rỗng. */
  targets: Partial<Record<StudyTrack, number>>
}

export type Comment = {
  id: string
  chapterId: string
  userId: string
  body: string
  isPinned: boolean
  /** ISO string. */
  createdAt: string
}
