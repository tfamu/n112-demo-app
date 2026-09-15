'use client'

import { useState } from 'react'
import { Pin, PinOff, Trash2 } from 'lucide-react'
import { DEMO_USER, findProfile } from '@/data/members'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDemoStore } from '@/lib/demo-store'

// クラスはベトナムにあるのでタイムゾーンを固定する。こうしないとサーバーと
// クライアントで違う文字列が出てしまう。
const timeFormat = new Intl.DateTimeFormat('ja-JP', {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Ho_Chi_Minh',
})

export function CommentsPanel({ chapterId }: { chapterId: string }) {
  const { state, addComment, deleteComment, togglePin } = useDemoStore()
  const [text, setText] = useState('')

  const isAdmin = DEMO_USER.role === 'admin'
  const comments = state.comments
    .filter((c) => c.chapterId === chapterId)
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    addComment(chapterId, body)
    setText('')
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:self-start md:overflow-y-auto">
      <h2 className="text-sm font-semibold">コメント（{comments.length}）</h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="この課についての質問やメモ…"
          className="w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Button type="submit" disabled={text.trim().length === 0} className="min-h-11 w-full">
          送信
        </Button>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">この課にはまだコメントがありません。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => {
            const author = findProfile(c.userId)
            const authorName = author?.displayName ?? 'メンバー'
            const canDelete = isAdmin || c.userId === DEMO_USER.id
            return (
              <li
                key={c.id}
                className={cn(
                  'rounded-lg border p-3 text-sm',
                  c.isPinned && 'border-amber-300 bg-amber-50/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <Avatar name={authorName} icon={author?.avatarIcon ?? 'ti-user'} />
                  <span className="min-w-0 flex-1 truncate font-medium">{authorName}</span>
                  {c.isPinned ? (
                    <Pin className="size-3.5 shrink-0 text-amber-600" aria-label="ピン留め済み" />
                  ) : null}
                </div>

                <p className="mt-2 break-words whitespace-pre-line">{c.body}</p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <time dateTime={c.createdAt} className="text-xs text-muted-foreground">
                    {timeFormat.format(new Date(c.createdAt))}
                  </time>
                  <div className="flex items-center gap-1">
                    {isAdmin ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => togglePin(c.id, !c.isPinned)}
                        aria-label={c.isPinned ? 'ピン留めを外す' : 'ピン留めする'}
                        className="size-11"
                      >
                        {c.isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                      </Button>
                    ) : null}
                    {canDelete ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (!confirm('このコメントを削除しますか？')) return
                          deleteComment(c.id)
                        }}
                        aria-label="コメントを削除"
                        className="size-11 text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function Avatar({ name, icon }: { name: string; icon: string }) {
  // progress-timeline のマーカーと同じ規則: 'ti-*'（本番スキーマの既定値、
  // Tabler アイコン名）は頭文字にフォールバック、それ以外は絵文字としてそのまま出す。
  const label = icon.startsWith('ti-') ? name.slice(0, 1).toUpperCase() : icon
  return (
    <span
      aria-hidden
      className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs"
    >
      {label}
    </span>
  )
}
