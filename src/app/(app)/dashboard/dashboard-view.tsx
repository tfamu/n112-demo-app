'use client'

import type { Phase } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressTimeline } from '@/components/progress-timeline'
import { STUDY_TRACKS, trackLabel, type StudyTrack } from '@/lib/tracks'
import {
  classProgressRows,
  trackProgress,
  useDemoStore,
  type TrackProgress,
} from '@/lib/demo-store'

export function DashboardView({ phases }: { phases: Phase[] }) {
  const { state } = useDemoStore()
  const rows = classProgressRows(state.reviews)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <p className="rounded-xl border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
        Bản demo: toàn bộ nội dung là dữ liệu mẫu, không có đăng nhập và không có
        database. Tiến độ bạn bấm được lưu trong trình duyệt này thôi — bấm{' '}
        <span className="font-medium text-foreground">Đặt lại</span> ở góc trên để
        về trạng thái ban đầu.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tiến độ của bạn</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {STUDY_TRACKS.map((track) => (
            <TrackProgressBar
              key={track}
              track={track}
              progress={trackProgress(state.reviews, track)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cả lớp trên timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressTimeline phases={phases} rows={rows} />
        </CardContent>
      </Card>
    </div>
  )
}

function TrackProgressBar({
  track,
  progress,
}: {
  track: StudyTrack
  progress: TrackProgress
}) {
  const { done, total, needReview } = progress
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-lg font-medium">{trackLabel(track)}</span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {done}/{total}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`Tiến độ ${trackLabel(track)}`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{percent}%</span>
        {needReview > 0 ? (
          <span className="font-medium text-amber-600">cần review: {needReview}</span>
        ) : null}
      </div>
    </div>
  )
}
