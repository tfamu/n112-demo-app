import type { Comment, Phase, Profile, ReviewStatus, StudyTrack } from './types'

// ---------------------------------------------------------------------------
// "Lớp học" giả. Bản thật lấy những thứ này từ bảng profiles / phases / comments
// và RPC get_class_progress().
// ---------------------------------------------------------------------------

/** Người đang xem demo. Để role = admin cho xem được cả trang /admin. */
export const DEMO_USER: Profile = {
  id: 'u-demo',
  displayName: 'Bạn (demo)',
  avatarIcon: '🙂',
  role: 'admin',
}

export const CLASSMATES: Profile[] = [
  { id: 'u-linh', displayName: 'Linh', avatarIcon: '🍀', role: 'member' },
  { id: 'u-mai', displayName: 'Mai', avatarIcon: '🌸', role: 'member' },
  { id: 'u-hung', displayName: 'Hùng', avatarIcon: '🐧', role: 'member' },
  // avatar_icon mặc định của schema là 'ti-user' -> để một người dùng giá trị này
  // cho thấy nhánh fallback "chữ cái đầu" của marker.
  { id: 'u-thao', displayName: 'Thảo', avatarIcon: 'ti-user', role: 'member' },
]

/** Số thẻ đã học của từng bạn, cố định — chỉ tiến độ của bạn mới thay đổi. */
export const CLASSMATE_DONE: Record<string, Record<StudyTrack, number>> = {
  'u-linh': { grammar: 10, vocab: 10, kanji: 8 },
  'u-mai': { grammar: 10, vocab: 6, kanji: 4 },
  'u-hung': { grammar: 7, vocab: 3, kanji: 2 },
  'u-thao': { grammar: 4, vocab: 1, kanji: 0 },
}

export const PHASES: Phase[] = [
  { id: 1, name: 'Phase 1', deadline: '2026-08-31', targets: { grammar: 1, vocab: 0.4, kanji: 0.4 } },
  { id: 2, name: 'Phase 2', deadline: '2026-10-15', targets: { grammar: 1, vocab: 0.8, kanji: 0.8 } },
  { id: 3, name: 'Phase 3', deadline: '2026-11-15', targets: { grammar: 1, vocab: 1, kanji: 1 } },
  // Phase thi thử: không có target đo được -> marker dừng ở đầu đoạn này.
  { id: 4, name: 'Phase 4', deadline: '2026-12-05', targets: {} },
]

/** Trạng thái thẻ có sẵn của bạn, để mở demo lên đã có gì đó để xem. */
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
