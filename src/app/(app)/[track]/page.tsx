import { notFound } from 'next/navigation'
import { cardsOfChapter, chaptersOfTrack, quizzesOfChapter } from '@/data/content'
import { isStudyTrack, trackLabel } from '@/lib/tracks'
import { FlashcardDeck } from '@/components/flashcard'
import { CommentsPanel } from '@/components/comments-panel'
import { ChapterSelect, type ChapterOption } from './chapter-select'
import { QuizList } from './quiz-list'

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ track: string }>
  searchParams: Promise<{ ch?: string }>
}) {
  const { track } = await params
  if (!isStudyTrack(track)) notFound()

  const { ch } = await searchParams
  const chapters = chaptersOfTrack(track)

  const options: ChapterOption[] = chapters.map((c) => ({
    id: c.id,
    label: `${c.code} · ${c.title}`,
  }))

  // Chương đang chọn: từ ?ch=, nếu không hợp lệ thì lấy chương đầu.
  const selectedId = ch && chapters.some((c) => c.id === ch) ? ch : chapters[0]?.id

  const cards = selectedId ? cardsOfChapter(selectedId) : []
  const quizzes = selectedId ? quizzesOfChapter(selectedId) : []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{trackLabel(track)}</h1>
        {options.length > 0 ? <ChapterSelect chapters={options} value={selectedId} /> : null}
      </div>

      {options.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có chương nào cho mảng này.</p>
      ) : (
        // Mobile: 1 cột, bình luận nằm dưới card. Desktop: bình luận ở rìa phải.
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="flex flex-col gap-4">
            {cards.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chương này chưa có thẻ nào.</p>
            ) : (
              <FlashcardDeck key={selectedId} cards={cards} />
            )}
            <QuizList quizzes={quizzes} />
          </div>
          {selectedId ? <CommentsPanel key={selectedId} chapterId={selectedId} /> : null}
        </div>
      )}
    </div>
  )
}
