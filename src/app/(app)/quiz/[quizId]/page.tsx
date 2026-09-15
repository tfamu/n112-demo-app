import { notFound } from 'next/navigation'
import Link from 'next/link'
import { findQuiz, questionsOfQuiz, trackOfChapter } from '@/data/content'
import { shuffle } from '@/lib/shuffle'
import { QuizRunner, type QuizQuestion } from '@/components/quiz-runner'

// 開くたびに問題順を変えるので、事前レンダリングはしない。
export const dynamic = 'force-dynamic'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const quiz = findQuiz(quizId)
  if (!quiz) notFound()

  // 順番をシャッフルする。同じカードから作った問題が並ぶと答えが読めてしまうため。
  // なお正解はバンドルに含まれる。本番はサーバーで採点しているが、デモにサーバーはない。
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
          ← 課に戻る
        </Link>
        <h1 className="text-2xl font-semibold">{quiz.title}</h1>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">このクイズには問題がありません。</p>
      ) : (
        <QuizRunner quizId={quiz.id} questions={questions} backHref={backHref} />
      )}
    </div>
  )
}
