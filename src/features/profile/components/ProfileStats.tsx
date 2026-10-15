interface ProfileStatsProps {
  logCount: number
  spotCount: number
}

export default function ProfileStats({ logCount, spotCount }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-(--radius-md) border border-slate-200 p-4 text-center">
        <p className="text-2xl font-bold text-(--color-ink)">{logCount}</p>
        <p className="text-sm text-(--color-ink-muted)">Logs</p>
      </div>
      <div className="rounded-(--radius-md) border border-slate-200 p-4 text-center">
        <p className="text-2xl font-bold text-(--color-ink)">{spotCount}</p>
        <p className="text-sm text-(--color-ink-muted)">Spots</p>
      </div>
    </div>
  )
}
