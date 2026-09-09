export function MonthProgress({
  today,
  daysInMonth,
  light,
}: {
  today: number;
  daysInMonth: number;
  /** Use light text — this bar sits over the photo backdrop on Overview. */
  light?: boolean;
}) {
  const pct = Math.max(0, Math.min(today / daysInMonth, 1)) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-aluminum" style={{ width: `${pct}%` }} />
      </div>
      <span
        className={`shrink-0 font-mono text-[10px] font-medium tabular-nums ${
          light ? "text-paper/80" : "text-aluminum"
        }`}
      >
        Dag {today}/{daysInMonth}
      </span>
    </div>
  );
}
