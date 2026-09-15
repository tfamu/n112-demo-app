'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/lib/demo-store'

/** localStorage を消して、デモを最初のダミーデータに戻す。 */
export function ResetDemoButton() {
  const { reset } = useDemoStore()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        if (!confirm('デモの学習状況とコメントをすべて初期状態に戻しますか？')) return
        reset()
      }}
      aria-label="デモデータをリセット"
    >
      <RotateCcw className="size-4" />
      <span className="hidden sm:inline">リセット</span>
    </Button>
  )
}
