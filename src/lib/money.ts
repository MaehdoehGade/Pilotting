const formatter = new Intl.NumberFormat("sv-SE", {
  maximumFractionDigits: 0,
});

export function formatSEK(value: number): string {
  return `${formatter.format(Math.round(value))} kr`;
}

export function formatSigned(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatSEK(value)}`;
}
