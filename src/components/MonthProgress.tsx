export function MonthProgress({ fraction }: { fraction: number }) {
  const pct = Math.max(0, Math.min(fraction, 1)) * 100;
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
      <div
        className="h-full rounded-full bg-blush"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
