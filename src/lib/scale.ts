export function scaleSizes(
  amounts: number[],
  min = 72,
  max = 136,
): number[] {
  const largest = Math.max(...amounts, 1);
  return amounts.map((a) => {
    const ratio = Math.sqrt(Math.max(a, 0) / largest);
    return Math.round(min + ratio * (max - min));
  });
}
