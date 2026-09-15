import type { Phase } from '@/data/types'
import type { ClassProgressRow } from '@/lib/demo-store'
import { STUDY_TRACKS, trackLabel, type StudyTrack } from '@/lib/tracks'
import { cn } from '@/lib/utils'

type Targets = Partial<Record<StudyTrack, number>>

type Member = {
  userId: string
  displayName: string
  avatarIcon: string
  ratios: Partial<Record<StudyTrack, number>>
  /** 軸全体を 0..1 とした位置 */
  position: number
  phaseName: string
}

// 学習中の分野以外の目標（模試フェーズなど）は落とす。残すと分母 0 で割ることに
// なり、クラス全員がそのフェーズから永久に動かなくなる。
function toTargets(targets: Targets): Targets {
  const out: Targets = {}
  for (const track of STUDY_TRACKS) {
    const raw = targets[track]
    if (typeof raw === 'number' && raw > 0) out[track] = raw
  }
  return out
}

function clamp01(n: number): number {
  return Math.min(Math.max(n, 0), 1)
}

// 'YYYY-MM-DD' から M/D を作る。Date() を通さないのはタイムゾーンでずれないため。
function shortDate(deadline: string): string {
  const [, month, day] = deadline.split('-')
  return month && day ? `${Number(month)}/${Number(day)}` : deadline
}

function buildMembers(rows: ClassProgressRow[], phases: Phase[]): Member[] {
  const byUser = new Map<string, Member>()

  for (const row of rows) {
    let m = byUser.get(row.userId)
    if (!m) {
      m = {
        userId: row.userId,
        displayName: row.displayName,
        avatarIcon: row.avatarIcon,
        ratios: {},
        position: 0,
        phaseName: '',
      }
      byUser.set(row.userId, m)
    }
    if (row.total > 0) m.ratios[row.track] = row.done / row.total
  }

  const parsed = phases.map((p) => ({ phase: p, targets: toTargets(p.targets) }))

  for (const m of byUser.values()) {
    // マーカーが乗る区間は「まだ達成していない最初のフェーズ」。区間内の位置は
    // そのフェーズの各目標に対する達成度の平均。
    let index = parsed.length - 1
    let offset = 1
    for (let i = 0; i < parsed.length; i++) {
      const entries = Object.entries(parsed[i].targets) as [StudyTrack, number][]
      // 測れる目標がないフェーズ（フェーズ4: 模試）は永遠に達成にならないので、
      // ゴールまで飛ばさずその区間の先頭で止める。
      if (entries.length === 0) {
        index = i
        offset = 0
        break
      }
      const per = entries.map(([t, target]) => clamp01((m.ratios[t] ?? 0) / target))
      // フェーズを越えるには全部の目標を満たす必要がある…
      if (per.every((r) => r >= 1)) continue
      index = i
      // …が、区間内の位置は最小値ではなく平均を取る。1 分野を終わらせたら
      // マーカーが動かないと、授業中ずっと止まって見えてしまうため。
      offset = per.reduce((a, b) => a + b, 0) / per.length
      break
    }
    m.position = parsed.length > 0 ? (index + offset) / parsed.length : 0
    m.phaseName = parsed[index]?.phase.name ?? ''
  }

  return [...byUser.values()].sort((a, b) => b.position - a.position)
}

// 近い位置のマーカーはレーンを分けて重ならないようにする。
function assignLanes(members: Member[]): { member: Member; lane: number }[] {
  const placed: { member: Member; lane: number }[] = []
  for (const member of members) {
    const lanes = new Set(
      placed
        .filter((p) => Math.abs(p.member.position - member.position) < 0.07)
        .map((p) => p.lane),
    )
    let lane = 0
    while (lanes.has(lane)) lane++
    placed.push({ member, lane })
  }
  return placed
}

export function ProgressTimeline({
  phases,
  rows,
}: {
  phases: Phase[]
  rows: ClassProgressRow[]
}) {
  if (phases.length === 0) {
    return <p className="text-sm text-muted-foreground">フェーズがありません。</p>
  }

  const members = buildMembers(rows, phases)
  const placed = assignLanes(members)
  // レーン数に上限を設ける。全員が 0 地点に固まるとレーンが増え続け、スマホでは
  // フェーズ名の場所を食い潰す。上限を超えたら多少重なるがそれは許容する。
  const laneCount = Math.min(Math.max(1, ...placed.map((p) => p.lane + 1)), 4)
  const mobileLanes = Math.min(laneCount, 3)
  const n = phases.length

  return (
    <div className="flex flex-col gap-4">
      {/* ---------- スマホ: 縦軸（既定） ---------- */}
      {/* 左の列をマーカーのレーンに使い、軸とフェーズ名は右に置く。 */}
      <div className="flex gap-2 md:hidden" style={{ paddingTop: '8px' }}>
        <div className="relative shrink-0" style={{ width: `${mobileLanes * 34}px` }}>
          {placed.map(({ member, lane }) => (
            <div
              key={member.userId}
              className="absolute -translate-y-1/2"
              style={{
                top: `${member.position * 100}%`,
                right: `${Math.min(lane, mobileLanes - 1) * 34}px`,
              }}
            >
              <MemberMarker member={member} />
            </div>
          ))}
        </div>

        <div
          className="relative w-0.5 shrink-0 rounded bg-border"
          style={{ height: `${n * 84}px` }}
        >
          {phases.map((p, i) => (
            <div
              key={p.id}
              className="absolute left-0 flex -translate-y-1/2 items-center gap-2"
              style={{ top: `${((i + 1) / n) * 100}%` }}
            >
              <span className="-ml-[5px] size-2.5 shrink-0 rounded-full bg-primary" />
              <PhaseLabel phase={p} />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- PC: 横軸 ---------- */}
      {/* px-14 はラベル幅(w-24)の半分 + 余白。100% 地点のフェーズ4 がはみ出さないように。 */}
      <div className="hidden px-14 md:block">
        <div className="relative" style={{ height: `${laneCount * 34 + 84}px` }}>
          <div className="absolute inset-x-0 h-0.5 rounded bg-border" style={{ bottom: '62px' }} />

          {/* 丸は軸に直接置く。ラベルと同じ要素にまとめると、ラベルの長さの違いで
              丸が線からずれてしまう。 */}
          {phases.map((p, i) => (
            <span
              key={`dot-${p.id}`}
              className="absolute size-2.5 -translate-x-1/2 rounded-full bg-primary"
              style={{ left: `${((i + 1) / n) * 100}%`, bottom: '58px' }}
            />
          ))}

          {phases.map((p, i) => (
            <div
              key={`label-${p.id}`}
              className="absolute bottom-0 -translate-x-1/2"
              style={{ left: `${((i + 1) / n) * 100}%` }}
            >
              <PhaseLabel phase={p} center />
            </div>
          ))}

          {placed.map(({ member, lane }) => (
            <div
              key={member.userId}
              className="absolute -translate-x-1/2"
              style={{
                left: `${member.position * 100}%`,
                bottom: `${72 + lane * 34}px`,
              }}
            >
              <MemberMarker member={member} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        マーカーは「まだ達成していないフェーズ」の区間に置かれ、区間内の位置はその
        フェーズの目標に対する達成度の平均です。次のフェーズへ進むには、目標を
        すべて満たす必要があります。
      </p>
    </div>
  )
}

function PhaseLabel({ phase, center }: { phase: Phase; center?: boolean }) {
  const entries = Object.entries(toTargets(phase.targets)) as [StudyTrack, number][]

  return (
    <div
      className={cn(
        'flex flex-col leading-tight',
        // 幅を固定して折り返させる。PC ではラベルが 4 つ並び、スマホでは
        // マーカー列のあと 180px ほどしか残らないため。
        center ? 'w-24 items-center text-center' : 'w-40',
      )}
    >
      <span className="text-xs font-medium">
        {phase.name} · {shortDate(phase.deadline)}
      </span>
      <span className="text-[11px] leading-snug text-muted-foreground">
        {entries.length > 0
          ? entries.map(([t, v]) => `${trackLabel(t)} ${Math.round(v * 100)}%`).join(' · ')
          : '模試'}
      </span>
    </div>
  )
}

function MemberMarker({ member }: { member: Member }) {
  // 'ti-*'（本番スキーマの既定値）は頭文字にフォールバック、
  // それ以外は絵文字としてそのまま出す。
  const label = member.avatarIcon.startsWith('ti-')
    ? member.displayName.slice(0, 1).toUpperCase()
    : member.avatarIcon

  const done = Object.values(member.ratios)
  const percent =
    done.length > 0 ? Math.round((done.reduce((a, b) => a + b, 0) / done.length) * 100) : 0

  return (
    <span
      title={`${member.displayName} — ${member.phaseName}、平均 ${percent}%`}
      className="flex size-8 items-center justify-center rounded-full border bg-background text-sm shadow-sm"
    >
      {label}
    </span>
  )
}
