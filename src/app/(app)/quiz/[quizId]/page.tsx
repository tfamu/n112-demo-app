import { notFound } from 'next/navigation'
import Link from 'next/link'
import { findQuiz, questionsOfQuiz, trackOfChapter } from '@/data/content'
import { shuffle } from '@/lib/shuffle'
import { QuizRunner, type QuizQuestion } from '@/components/quiz-runner'

// Thứ tự câu hỏi được trộn lại mỗi lần vào trang -> không prerender sẵn.
export const dynamic = 'force-dynamic'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const quiz = findQuiz(quizId)
  if (!quiz) notFound()

  // Trộn ngẫu nhiên: các câu cùng card nằm liên tiếp thì đoán được đáp án.
  // Đáp án đúng nằm trong bundle — bản thật chấm ở server, bản demo không có server.
  const questions: QuizQuestion[] = shuffle(
    questionsOfQuiz(quizId).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      choices: q.choices,
    })),
  )

  const track = trackOfChapter(quiz.chapterId)
  const backHref = `/${track}?ch=${encodeURIComponent(quiz.chapterId)}`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Link href={backHref} className="text-sm text-muted-foreground hover:underline">
          ← Về chương
        </Link>
        <h1 className="text-2xl font-semibold">{quiz.title}</h1>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Quiz này chưa có câu hỏi.</p>
      ) : (
        <QuizRunner quizId={quiz.id} questions={questions} backHref={backHref} />
      )}
    </div>
  )
}
