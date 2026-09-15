import type { Comment, Phase, Profile, ReviewStatus, StudyTrack } from './types'

// ---------------------------------------------------------------------------
// ダミーの「クラス」。本番ではこれらを profiles / phases / comments テーブルと
// RPC get_class_progress() から取得している。
// ---------------------------------------------------------------------------

/** デモを見ている人。/admin も見られるように role は admin にしてある。 */
export const DEMO_USER: Profile = {
  id: 'u-demo',
  displayName: 'あなた（デモ）',
  avatarIcon: '🙂',
  role: 'admin',
}

export const CLASSMATES: Profile[] = [
  { id: 'u-linh', displayName: 'Linh', avatarIcon: '🍀', role: 'member' },
  { id: 'u-mai', displayName: 'Mai', avatarIcon: '🌸', role: 'member' },
  { id: 'u-hung', displayName: 'Hùng', avatarIcon: '🐧', role: 'member' },
  // 本番スキーマの avatar_icon の既定値は 'ti-user'。マーカーの
  // 「頭文字にフォールバックする」分岐を見せるため 1 人だけこの値にしている。
  { id: 'u-thao', displayName: 'Thảo', avatarIcon: 'ti-user', role: 'member' },
]

/** クラスメイトの学習済み枚数は固定。動くのは自分の進捗だけ。 */
export const CLASSMATE_DONE: Record<string, Record<StudyTrack, number>> = {
  'u-linh': { grammar: 10, vocab: 10, kanji: 8 },
  'u-mai': { grammar: 10, vocab: 6, kanji: 4 },
  'u-hung': { grammar: 7, vocab: 3, kanji: 2 },
  'u-thao': { grammar: 4, vocab: 1, kanji: 0 },
}

export const PHASES: Phase[] = [
  { id: 1, name: 'フェーズ1', deadline: '2026-08-31', targets: { grammar: 1, vocab: 0.4, kanji: 0.4 } },
  { id: 2, name: 'フェーズ2', deadline: '2026-10-15', targets: { grammar: 1, vocab: 0.8, kanji: 0.8 } },
  { id: 3, name: 'フェーズ3', deadline: '2026-11-15', targets: { grammar: 1, vocab: 1, kanji: 1 } },
  // 模試フェーズ: 測れる目標がないので、マーカーはこの区間の先頭で止まる。
  { id: 4, name: 'フェーズ4', deadline: '2026-12-05', targets: {} },
]

/** 開いた直後から何か見えるように、自分のカード状態を少しだけ用意しておく。 */
export const SEED_REVIEWS: Record<string, ReviewStatus> = {
  'cd-g1-1': 'known',
  'cd-g1-2': 'known',
  'cd-g1-3': 'learning',
  'cd-g1-4': 'weak',
  'cd-g2-1': 'known',
  'cd-v1-1': 'known',
  'cd-v1-2': 'learning',
  'cd-k1-1': 'known',
}

// コメント本文がベトナム語なのは、クラスの参加者がベトナム語話者だから。
// 学習者が実際に書く文章として、そのまま残している。
export const SEED_COMMENTS: Comment[] = [
  {
    id: 'cm-1',
    chapterId: 'ch-g1',
    userId: 'u-demo',
    body: 'Lưu ý chung cả chương: 「をものともせず」 mang sắc thái khen, 「をよそに」 mang ý chê. Đề thi hay đánh vào đúng chỗ này.',
    isPinned: true,
    createdAt: '2026-07-12T02:10:00.000Z',
  },
  {
    id: 'cm-2',
    chapterId: 'ch-g1',
    userId: 'u-mai',
    body: 'Câu 「彼女の気持ちは想像に難くない」 em đọc mãi vẫn thấy ngược ngược. Có phải luôn đi với 想像 không ạ?',
    isPinned: false,
    createdAt: '2026-07-12T13:45:00.000Z',
  },
  {
    id: 'cm-3',
    chapterId: 'ch-g1',
    userId: 'u-hung',
    body: 'Gần như luôn. Mình chỉ gặp thêm 察するに難くない thôi.',
    isPinned: false,
    createdAt: '2026-07-12T14:02:00.000Z',
  },
  {
    id: 'cm-4',
    chapterId: 'ch-v2',
    userId: 'u-linh',
    body: '潔い đọc là いさぎよい nhé cả nhà, mình sai câu này 3 lần rồi 😂',
    isPinned: false,
    createdAt: '2026-07-19T09:30:00.000Z',
  },
  {
    id: 'cm-5',
    chapterId: 'ch-k1',
    userId: 'u-thao',
    body: '遂行 với 遂に đọc khác nhau, ai hay nhầm thì ghi riêng ra một chỗ.',
    isPinned: false,
    createdAt: '2026-07-20T01:15:00.000Z',
  },
]

const ALL_PROFILES = [DEMO_USER, ...CLASSMATES]

export function findProfile(userId: string): Profile | undefined {
  return ALL_PROFILES.find((p) => p.id === userId)
}
