'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDemoStore, type QuizResult } from '@/lib/demo-store'

export type QuizQuestion = { id: string; prompt: string; choices: string[] }

export function QuizRunner({
  quizId,
  questions,
  backHref,
}: {
  quizId: string
  questions: QuizQuestion[]
  backHref: string
}) {
  const { submitQuiz } = useDemoStore()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  const submitted = result !== null
  const allAnswered = questions.every((q) => q.id in answers)
  // Map kết quả theo questionId để tra nhanh khi render mặt đã chấm.
  const resultById = new Map((result?.results ?? []).map((r) => [r.questionId, r]))

  function choose(questionId: string, index: number) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: index }))
  }

  function retry() {
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {submitted && result ? (
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Kết quả</p>
          <p className="text-3xl font-semibold tabular-nums">
            {result.score} / {result.total}
          </p>
        </div>
      ) : null}

      <ol className="flex flex-col gap-4">
        {questions.map((q, qi) => {
          const chosen = answers[q.id]
          const graded = resultById.get(q.id)
          return (
            <li key={q.id} className="rounded-xl border bg-card p-4">
              <p className="mb-3 font-medium whitespace-pre-line">
                <span className="text-muted-foreground">{qi + 1}. </span>
                <span className="font-jp">{q.prompt}</span>
              </p>
              <div className="flex flex-col gap-2">
                {q.choices.map((choice, ci) => {
                  const isChosen = chosen === ci
                  const isCorrect = graded?.correctIndex === ci
                  // Sau khi chấm: xanh = đáp án đúng, đỏ = mình chọn nhưng sai.
                  const state = !submitted
                    ? isChosen
                      ? 'chosen'
                      : 'idle'
                    : isCorrect
                      ? 'correct'
                      : isChosen
                        ? 'wrong'
                        : 'idle'
                  return (
                    <button
                      key={ci}
                      type="button"
                      onClick={() => choose(q.id, ci)}
                      disabled={submitted}
                      aria-pressed={isChosen}
                      className={cn(
                        'flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                        state === 'idle' && 'bg-background',
                        state === 'chosen' && 'border-primary bg-primary/10',
                        state === 'correct' && 'border-[#86EFAC] bg-[#86EFAC]/25 text-foreground',
                        state === 'wrong' && 'border-[#FCA5A5] bg-[#FCA5A5]/25 text-foreground',
                        !submitted && 'active:bg-muted',
                      )}
                    >
                      <span className="font-jp flex-1">{choice}</span>
                      {state === 'correct' ? <Check className="size-4 shrink-0" /> : null}
                      {state === 'wrong' ? <X className="size-4 shrink-0" /> : null}
                    </button>
                  )
                })}
              </div>

              {submitted && graded?.explanation ? (
                <p className="mt-3 rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-line">
                  {graded.explanation}
                </p>
              ) : null}
            </li>
          )
        })}
      </ol>

      {!submitted ? (
        <Button
          type="button"
          onClick={() => setResult(submitQuiz(quizId, answers))}
          disabled={!allAnswered}
          className="min-h-11"
        >
          {allAnswered
            ? 'Nộp bài'
            : `Còn ${questions.length - Object.keys(answers).length} câu chưa trả lời`}
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={retry} className="min-h-11 flex-1">
            Làm lại
          </Button>
          <Button render={<Link href={backHref} />} nativeButton={false} className="min-h-11 flex-1">
            Về chương
          </Button>
        </div>
      )}
    </div>
  )
}
