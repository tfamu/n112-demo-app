'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Card, ReviewStatus } from '@/data/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDemoStore } from '@/lib/demo-store'

// 状態を表す色つきの丸。'new'（未登録も含む）はグレー。
const STATUS_META: Record<ReviewStatus, { label: string; dot: string }> = {
  new: { label: '未学習', dot: 'bg-gray-400' },
  learning: { label: '学習中', dot: 'bg-[#FCD34D]' },
  known: { label: '覚えた', dot: 'bg-[#86EFAC]' },
  weak: { label: '要復習', dot: 'bg-[#FCA5A5]' },
}

export function FlashcardDeck({ cards }: { cards: Card[] }) {
  const { state, markCard } = useDemoStore()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // 課を切り替えるとページ側の key={selectedId} でデッキごと作り直されるので、
  // ここの state は自動的にリセットされる。
  const card = cards[index]
  if (!card) return null

  const status = state.reviews[card.id]?.status
  const dotMeta = STATUS_META[status ?? 'new']

  function go(next: number) {
    setIndex((i) => Math.min(Math.max(i + next, 0), cards.length - 1))
    setFlipped(false) // カードを変えたらめくった状態を戻す
    setMessage(null)
  }

  function mark(cardId: string, next: 'known' | 'learning') {
    const res = markCard(cardId, next)
    setMessage(
      res.blocked
        ? 'このカードはクイズで間違えたため「要復習」です。クイズで正解すると解除されます。'
        : null,
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="group/card relative transition-transform duration-200 [perspective:1000px] hover:-translate-y-1">
        {/* 状態の丸はカード上辺の中央。カードと一緒に回らず、hover でラベルが出る */}
        <div className="group absolute -top-2 left-1/2 z-10 -translate-x-1/2">
          <span
            className={cn(
              'block size-4 rounded-full border-2 border-background shadow',
              dotMeta.dot,
            )}
            role="img"
            aria-label={`状態: ${dotMeta.label}`}
          />
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100"
          >
            {dotMeta.label}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label="カードをめくる"
          aria-pressed={flipped}
          className="relative w-full min-h-72 [transform-style:preserve-3d] transition-transform duration-[400ms]"
          style={{ transform: flipped ? 'rotateY(180deg)' : undefined }}
        >
          {/* 表: 文型・語彙だけ。読み方は裏に回す */}
          <span
            aria-hidden={flipped}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[20px] border bg-card p-6 text-center shadow-sm transition-shadow [backface-visibility:hidden] group-hover/card:shadow-xl"
          >
            <span className="font-jp text-3xl font-semibold text-card-foreground">
              {card.front}
            </span>
            <span className="mt-2 text-xs text-muted-foreground">タップでめくる</span>
          </span>

          {/* 裏: 読み方・漢越音 + 意味 + 例文 */}
          <span
            aria-hidden={!flipped}
            className="absolute inset-0 flex flex-col gap-3 overflow-y-auto rounded-[20px] border bg-card p-6 text-left shadow-sm transition-shadow [backface-visibility:hidden] [transform:rotateY(180deg)] group-hover/card:shadow-xl"
          >
            {card.reading || card.hanViet ? (
              <span className="font-jp text-sm text-muted-foreground">
                {card.reading}
                {card.reading && card.hanViet ? ' · ' : null}
                {card.hanViet ? <span className="font-medium">【{card.hanViet}】</span> : null}
              </span>
            ) : null}
            <span className="whitespace-pre-line text-lg font-medium text-card-foreground">
              {card.back}
            </span>
            {card.examples.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {card.examples.map((ex, i) => (
                  <li key={i} className="border-l-2 pl-3 text-sm">
                    <span className="font-jp block">{ex.jp}</span>
                    <span className="block text-muted-foreground">{ex.vi}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </span>
        </button>
      </div>

      {/* 補足パネル: めくったときだけ出す */}
      {flipped && card.extra ? (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">補足</p>
          <div className="whitespace-pre-line">{card.extra}</div>
        </div>
      ) : null}

      {/* 覚えた / まだ: 裏面のときだけ表示。親指で押せるよう 44px 以上。 */}
      {flipped ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Button
              type="button"
              variant={status === 'learning' ? 'default' : 'outline'}
              onClick={() => mark(card.id, 'learning')}
              className="min-h-11 flex-1"
            >
              まだ
            </Button>
            <Button
              type="button"
              variant={status === 'known' ? 'default' : 'outline'}
              onClick={() => mark(card.id, 'known')}
              className="min-h-11 flex-1"
            >
              覚えた
            </Button>
          </div>
          {status === 'weak' ? (
            <p className="text-xs font-medium text-amber-600">要復習（クイズで間違えた）</p>
          ) : null}
          {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
        </div>
      ) : null}

      {/* 前後の移動: カードの下に左右配置、親指で押せる大きさ（44px 以上） */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="前のカード"
          className="size-11"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <span className="text-sm tabular-nums text-muted-foreground">
          {index + 1} / {cards.length}
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => go(1)}
          disabled={index === cards.length - 1}
          aria-label="次のカード"
          className="size-11"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  )
}
