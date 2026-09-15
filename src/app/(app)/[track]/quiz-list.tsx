'use client'

import Link from 'next/link'
import type { Quiz } from '@/data/types'
import { useDemoStore } from '@/lib/demo-store'

// Điểm lần gần nhất nằm trong store của trình duyệt -> component này phải là client.
export function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  const { state } = useDemoStore()
  if (quizzes.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">Quiz</h2>
      <ul className="flex flex-col gap-2">
        {quizzes.map((q) => {
          const latest = state.attempts[q.id]
          return (
            <li
              key={q.id}
              className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{q.title}</p>
                <p className="text-xs text-muted-foreground">
                  {latest ? `Lần gần nhất: ${latest.score}/${latest.total}` : 'Chưa làm'}
                </p>
              </div>
              <Link
                href={`/quiz/${q.id}`}
                className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                {latest ? 'Làm lại' : 'Bắt đầu'}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
