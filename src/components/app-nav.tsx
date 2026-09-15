'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookText, Languages, PenLine, BarChart3, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = { href: string; label: string; icon: LucideIcon }

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/grammar', label: '文法', icon: BookText },
  { href: '/vocab', label: '語彙', icon: Languages },
  { href: '/kanji', label: '漢字', icon: PenLine },
  { href: '/dashboard', label: '進捗', icon: BarChart3 },
]

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// PC: ヘッダー内の横並びリンク。
export function DesktopNav() {
  const pathname = usePathname()
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive(pathname, href)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

// スマホ: 画面下に固定するタブ。親指で押せるよう 1 つ 44px 以上。
export function MobileTabs() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background md:hidden">
      <ul className="mx-auto flex max-w-3xl">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className={cn('size-5', active && 'text-primary')} aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
