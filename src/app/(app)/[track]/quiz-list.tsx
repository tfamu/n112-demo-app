'use client'

import Link from 'next/link'
import type { Quiz } from '@/data/types'
import { useDemoStore } from '@/lib/demo-store'

// 前回のスコアはブラウザ側のストアにあるので、ここはクライアントコンポーネント。
export function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  const { state } = useDemoStore()
  if (quizzes.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">クイズ</h2>
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
                  {latest ? `前回: ${latest.score}/${latest.total}` : '未受験'}
                </p>
              </div>
              <Link
                href={`/quiz/${q.id}`}
                className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                {latest ? 'もう一度' : '開始'}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
