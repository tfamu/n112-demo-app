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
    // Ghi lựa chọn vào ?ch= để share link được và nút Back hoạt động đúng.
    router.push(`${pathname}?ch=${encodeURIComponent(id)}`)
  }

  // Base UI Select cần `items` để SelectValue hiện label thay vì value (id).
  const items = chapters.map((c) => ({ value: c.id, label: c.label }))

  return (
    <Select items={items} value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Chọn chương" />
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
