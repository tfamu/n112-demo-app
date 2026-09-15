'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type ChapterOption = { id: string; label: string }

export function ChapterSelect({
  chapters,
  value,
}: {
  chapters: ChapterOption[]
  value?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  function onChange(id: string | null) {
    if (!id) return
    // 選択を ?ch= に入れる。URL を共有でき、ブラウザの戻るも正しく動く。
    router.push(`${pathname}?ch=${encodeURIComponent(id)}`)
  }

  // Base UI の Select は、SelectValue に id ではなくラベルを出すため items が要る。
  const items = chapters.map((c) => ({ value: c.id, label: c.label }))

  return (
    <Select items={items} value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="課を選択" />
      </SelectTrigger>
      <SelectContent>
        {chapters.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
