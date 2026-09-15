'use client'

import { useSyncExternalStore } from 'react'
import { QUESTIONS, cardCountOfTrack, trackOfCard } from '@/data/content'
import {
  CLASSMATES,
  CLASSMATE_DONE,
  DEMO_USER,
  SEED_COMMENTS,
  SEED_REVIEWS,
} from '@/data/members'
import type { Comment, ReviewStatus, StudyTrack } from '@/data/types'
import { STUDY_TRACKS } from '@/data/types'

// ---------------------------------------------------------------------------
// Bản thật ghi tiến độ vào Postgres qua Server Action. Bản demo không có DB:
// mọi thay đổi nằm trong một store nhỏ ở module này và được lưu vào localStorage
// của chính trình duyệt đang mở. Xoá localStorage là về lại dữ liệu mẫu.
//
// Dùng useSyncExternalStore thay cho Context: server render luôn ra dữ liệu mẫu,
// localStorage chỉ được nạp sau khi hydrate xong nên HTML hai bên không lệch.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'n112-demo/v1'

type ReviewEntry = { status: ReviewStatus; missCount: number }
type AttemptEntry = { score: number; total: number; finishedAt: string }

export type DemoState = {
  reviews: Record<string, ReviewEntry>
  attempts: Record<string, AttemptEntry>
  comments: Comment[]
}

export type QuestionResult = {
  questionId: string
  correctIndex: number
  chosenIndex: number | null
  isCorrect: boolean
  explanation: string | null
}

export type QuizResult = {
  score: number
  total: number
  results: QuestionResult[]
}

export type MarkResult = { applied: ReviewStatus; blocked: boolean }

function seedState(): DemoState {
  const reviews: Record<string, ReviewEntry> = {}
  for (const [cardId, status] of Object.entries(SEED_REVIEWS)) {
    reviews[cardId] = { status, missCount: status === 'weak' ? 1 : 0 }
  }
  return { reviews, attempts: {}, comments: [...SEED_COMMENTS] }
}

// Snapshot dùng cho server render — phải là CÙNG một object mỗi lần gọi, nếu
// không useSyncExternalStore sẽ render vô hạn.
const SEED_SNAPSHOT = seedState()

let current: DemoState = SEED_SNAPSHOT
let storageLoaded = false
const listeners = new Set<() => void>()

function readStorage(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const { reviews, attempts, comments } = parsed as Partial<DemoState>
    return {
      reviews: reviews ?? {},
      attempts: attempts ?? {},
      comments: Array.isArray(comments) ? comments : [],
    }
  } catch {
    // Trình duyệt chặn localStorage (chế độ riêng tư) -> cứ chạy với dữ liệu mẫu.
    return null
  }
}

function writeStorage(state: DemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Không lưu được thì thôi, demo vẫn chạy trong phiên hiện tại.
  }
}

function subscribe(listener: () => void): () => void {
  // Lần đầu có component lắng nghe = đã ở trên client và đã hydrate xong.
  if (!storageLoaded) {
    storageLoaded = true
    const stored = readStorage()
    if (stored) current = stored
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): DemoState {
  return current
}

function getServerSnapshot(): DemoState {
  return SEED_SNAPSHOT
}

function update(next: DemoState) {
  current = next
  writeStorage(next)
  for (const listener of listeners) listener()
}

// --- Hành động (thay cho các Server Action ở bản thật) -----------------------

function markCard(cardId: string, status: 'known' | 'learning'): MarkResult {
  // Luật giữ nguyên từ bản thật: thẻ đang 'weak' (do làm sai quiz) không hạ được
  // qua flashcard, phải làm đúng ở quiz mới bỏ đánh dấu.
  if (current.reviews[cardId]?.status === 'weak') {
    return { applied: 'weak', blocked: true }
  }

  update({
    ...current,
    reviews: {
      ...current.reviews,
      [cardId]: { status, missCount: current.reviews[cardId]?.missCount ?? 0 },
    },
  })
  return { applied: status, blocked: false }
}

function submitQuiz(quizId: string, answers: Record<string, number>): QuizResult {
  const questions = QUESTIONS.filter((q) => q.quizId === quizId)

  let score = 0
  const results: QuestionResult[] = []
  const wrongCards = new Set<string>()
  const correctCards = new Set<string>()

  for (const q of questions) {
    const chosen = q.id in answers ? answers[q.id] : null
    const isCorrect = chosen !== null && chosen === q.answerIndex
    if (isCorrect) {
      score++
      if (q.cardId) correctCards.add(q.cardId)
    } else if (q.cardId) {
      wrongCards.add(q.cardId)
    }
    results.push({
      questionId: q.id,
      correctIndex: q.answerIndex,
      chosenIndex: chosen,
      isCorrect,
      explanation: q.explanation,
    })
  }

  const reviews = { ...current.reviews }
  // Sai -> weak, miss_count + 1.
  for (const cardId of wrongCards) {
    reviews[cardId] = { status: 'weak', missCount: (reviews[cardId]?.missCount ?? 0) + 1 }
  }
  // Đúng mà thẻ đang weak -> gỡ về known, giữ nguyên miss_count làm lịch sử.
  // Thẻ vừa đúng vừa sai trong cùng một lượt thì câu sai "thắng".
  for (const cardId of correctCards) {
    if (wrongCards.has(cardId)) continue
    if (reviews[cardId]?.status === 'weak') {
      reviews[cardId] = { status: 'known', missCount: reviews[cardId].missCount }
    }
  }

  update({
    ...current,
    reviews,
    attempts: {
      ...current.attempts,
      [quizId]: { score, total: questions.length, finishedAt: new Date().toISOString() },
    },
  })

  return { score, total: questions.length, results }
}

function addComment(chapterId: string, body: string) {
  const comment: Comment = {
    id: `cm-local-${Date.now()}`,
    chapterId,
    userId: DEMO_USER.id,
    body,
    isPinned: false,
    createdAt: new Date().toISOString(),
  }
  update({ ...current, comments: [...current.comments, comment] })
}

function deleteComment(commentId: string) {
  update({ ...current, comments: current.comments.filter((c) => c.id !== commentId) })
}

function togglePin(commentId: string, pinned: boolean) {
  update({
    ...current,
    comments: current.comments.map((c) => (c.id === commentId ? { ...c, isPinned: pinned } : c)),
  })
}

/** Xoá localStorage và trả demo về đúng dữ liệu mẫu ban đầu. */
function reset() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // bỏ qua
  }
  current = seedState()
  for (const listener of listeners) listener()
}

export function useDemoStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { state, markCard, submitQuiz, addComment, deleteComment, togglePin, reset }
}

// --- Số liệu dẫn xuất --------------------------------------------------------

export type TrackProgress = { done: number; total: number; needReview: number }

/** Tiến độ đo bằng SỐ THẺ đã đụng tới (status khác 'new'), không phải số quiz. */
export function trackProgress(
  reviews: Record<string, ReviewEntry>,
  track: StudyTrack,
): TrackProgress {
  let done = 0
  let needReview = 0
  for (const [cardId, entry] of Object.entries(reviews)) {
    if (trackOfCard(cardId) !== track) continue
    if (entry.status !== 'new') done++
    if (entry.status === 'weak') needReview++
  }
  return { done, total: cardCountOfTrack(track), needReview }
}

export type ClassProgressRow = {
  userId: string
  displayName: string
  avatarIcon: string
  track: StudyTrack
  done: number
  total: number
}

/** Thay cho RPC get_class_progress(): bạn thì tính thật, bạn cùng lớp thì cố định. */
export function classProgressRows(reviews: Record<string, ReviewEntry>): ClassProgressRow[] {
  const rows: ClassProgressRow[] = []

  for (const track of STUDY_TRACKS) {
    const mine = trackProgress(reviews, track)
    rows.push({
      userId: DEMO_USER.id,
      displayName: DEMO_USER.displayName,
      avatarIcon: DEMO_USER.avatarIcon,
      track,
      done: mine.done,
      total: mine.total,
    })

    for (const mate of CLASSMATES) {
      rows.push({
        userId: mate.id,
        displayName: mate.displayName,
        avatarIcon: mate.avatarIcon,
        track,
        done: CLASSMATE_DONE[mate.id]?.[track] ?? 0,
        total: cardCountOfTrack(track),
      })
    }
  }

  return rows
}
