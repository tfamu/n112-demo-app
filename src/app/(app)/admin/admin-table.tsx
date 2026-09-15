'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STUDY_TRACKS, trackLabel, type StudyTrack } from '@/lib/tracks'
import { classProgressRows, useDemoStore } from '@/lib/demo-store'

type Row = {
  displayName: string
  byTrack: Partial<Record<StudyTrack, { done: number; total: number }>>
}

export function AdminTable() {
  const { state } = useDemoStore()

  const byUser = new Map<string, Row>()
  for (const r of classProgressRows(state.reviews)) {
    let row = byUser.get(r.userId)
    if (!row) {
      row = { displayName: r.displayName, byTrack: {} }
      byUser.set(r.userId, row)
    }
    row.byTrack[r.track] = { done: r.done, total: r.total }
  }
  const rows = [...byUser.values()].sort((a, b) => a.displayName.localeCompare(b.displayName))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">クラスの進捗</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-md border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-medium">メンバー</th>
                {STUDY_TRACKS.map((t) => (
                  <th key={t} className="py-2 pr-4 font-medium">
                    {trackLabel(t)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.displayName} className="border-b last:border-0">
                  <td className="py-2 pr-4">{row.displayName}</td>
                  {STUDY_TRACKS.map((t) => {
                    const cell = row.byTrack[t]
                    return (
                      <td key={t} className="py-2 pr-4 tabular-nums">
                        {cell ? `${cell.done}/${cell.total}` : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
