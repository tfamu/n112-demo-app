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
// 本番では Server Action から Postgres に書き込んでいる部分。デモには DB が
// ないので、このモジュール内の小さなストアに持ち、ブラウザの localStorage に
// 保存する。localStorage を消せば初期のダミーデータに戻る。
//
// Context ではなく useSyncExternalStore を使っているのは、サーバー描画は必ず
// ダミーデータのまま、localStorage の読み込みはハイドレーション後にする＝
// サーバーとクライアントの HTML をずらさないため。
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

// サーバー描画用のスナップショット。毎回「同じ」オブジェクトを返さないと
// useSyncExternalStore が無限に再描画するので、ここで一度だけ作る。
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
    // プライベートモードなどで localStorage が使えない場合は
    // ダミーデータのまま動かす。
    return null
  }
}

function writeStorage(state: DemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 保存できなくてもセッション中は動くので握りつぶす。
  }
}

function subscribe(listener: () => void): () => void {
  // 最初の購読＝クライアント側でハイドレーションが終わったタイミング。
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

// --- 更新系（本番の Server Action に当たる部分） -----------------------------

function markCard(cardId: string, status: 'known' | 'learning'): MarkResult {
  // 本番と同じ仕様: クイズで間違えて 'weak' になったカードはフラッシュカード
  // 側では下げられない。クイズで正解して初めて解除される。
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
  // 不正解 -> weak、missCount を 1 増やす。
  for (const cardId of wrongCards) {
    reviews[cardId] = { status: 'weak', missCount: (reviews[cardId]?.missCount ?? 0) + 1 }
  }
  // 正解かつ weak のカード -> known に戻す。missCount は履歴として残す。
  // 同じ回で正解と不正解が混ざったカードは「不正解が勝つ」。
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

/** localStorage を消して、最初のダミーデータに戻す。 */
function reset() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 握りつぶす
  }
  current = seedState()
  for (const listener of listeners) listener()
}

export function useDemoStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { state, markCard, submitQuiz, addComment, deleteComment, togglePin, reset }
}

// --- 集計 --------------------------------------------------------------------

export type TrackProgress = { done: number; total: number; needReview: number }

/** 進捗は「触ったカードの枚数」(status が 'new' 以外) で測る。解いたクイズ数ではない。 */
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

/** RPC get_class_progress() の代わり。自分は実測、クラスメイトは固定値。 */
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
