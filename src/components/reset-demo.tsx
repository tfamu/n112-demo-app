'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/lib/demo-store'

/** Xoá localStorage và trả demo về đúng dữ liệu mẫu ban đầu. */
export function ResetDemoButton() {
  const { reset } = useDemoStore()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        if (!confirm('Đặt lại toàn bộ tiến độ và bình luận của bản demo?')) return
        reset()
      }}
      aria-label="Đặt lại dữ liệu demo"
    >
      <RotateCcw className="size-4" />
      <span className="hidden sm:inline">Đặt lại</span>
    </Button>
  )
}
