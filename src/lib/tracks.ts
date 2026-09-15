import { STUDY_TRACKS, type StudyTrack } from '@/data/types'

export { STUDY_TRACKS }
export type { StudyTrack }

// Nhãn tiếng Nhật chỉ ở tầng hiển thị; dữ liệu luôn dùng key tiếng Anh.
const TRACK_LABELS: Record<StudyTrack, string> = {
  grammar: '文法',
  vocab: '語彙',
  kanji: '漢字',
}

export function isStudyTrack(value: string): value is StudyTrack {
  return (STUDY_TRACKS as readonly string[]).includes(value)
}

export function trackLabel(track: StudyTrack): string {
  return TRACK_LABELS[track]
}
