import Link from 'next/link'
import { DesktopNav, MobileTabs } from '@/components/app-nav'
import { ResetDemoButton } from '@/components/reset-demo'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-base font-semibold">
            Happy Class
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              デモ
            </span>
          </Link>
          <DesktopNav />
          <div className="flex items-center gap-1">
            <Link
              href="/admin"
              className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              管理
            </Link>
            <ResetDemoButton />
          </div>
        </div>
      </header>

      {/* pb-24 はスマホの下タブに内容が隠れないため。PC では余白を戻す */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      <MobileTabs />
    </div>
  )
}
