export interface TreemapInput {
  id: string;
  value: number;
}

export interface TreemapRect extends TreemapInput {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Squarified treemap (Bruls/Huizing/van Wijk). Every returned rect's area is
 * proportional to its value / sum(values), and the rects exactly tile the
 * given w×h box — so if the caller includes a "leftover" leaf, the whole
 * box always sums to the true total, not just to whatever was spent.
 */
export function squarify(
  items: TreemapInput[],
  x: number,
  y: number,
  w: number,
  h: number,
): TreemapRect[] {
  const positive = items.filter((i) => i.value > 0);
  const total = positive.reduce((s, i) => s + i.value, 0);
  if (total <= 0 || positive.length === 0 || w <= 0 || h <= 0) return [];

  const sorted = [...positive].sort((a, b) => b.value - a.value);
  const scale = (w * h) / total;
  const scaled = sorted.map((i) => ({ ...i, area: i.value * scale }));

  const result: TreemapRect[] = [];
  layout(scaled, x, y, w, h, result);
  return result;
}

interface ScaledItem extends TreemapInput {
  area: number;
}

function layout(
  items: ScaledItem[],
  x: number,
  y: number,
  w: number,
  h: number,
  result: TreemapRect[],
) {
  if (items.length === 0) return;
  if (items.length === 1) {
    result.push({ id: items[0].id, value: items[0].value, x, y, w, h });
    return;
  }

  const shortSide = Math.min(w, h);
  const row: ScaledItem[] = [items[0]];
  let rowArea = items[0].area;
  let i = 1;
  while (i < items.length) {
    const candidateArea = rowArea + items[i].area;
    const currentWorst = worstRatio(row, rowArea, shortSide);
    const nextWorst = worstRatio([...row, items[i]], candidateArea, shortSide);
    if (nextWorst <= currentWorst) {
      row.push(items[i]);
      rowArea = candidateArea;
      i++;
    } else {
      break;
    }
  }

  const rowLength = rowArea / shortSide;
  const remaining = items.slice(row.length);

  if (w >= h) {
    let cy = y;
    for (const it of row) {
      const itemHeight = it.area / rowLength;
      result.push({ id: it.id, value: it.value, x, y: cy, w: rowLength, h: itemHeight });
      cy += itemHeight;
    }
    layout(remaining, x + rowLength, y, w - rowLength, h, result);
  } else {
    let cx = x;
    for (const it of row) {
      const itemWidth = it.area / rowLength;
      result.push({ id: it.id, value: it.value, x: cx, y, w: itemWidth, h: rowLength });
      cx += itemWidth;
    }
    layout(remaining, x, y + rowLength, w, h - rowLength, result);
  }
}

function worstRatio(row: ScaledItem[], rowAreaSum: number, shortSide: number): number {
  const rowLength = rowAreaSum / shortSide;
  let worst = 1;
  for (const it of row) {
    const itemLen = it.area / rowLength;
    const ratio = Math.max(rowLength / itemLen, itemLen / rowLength);
    if (ratio > worst) worst = ratio;
  }
  return worst;
}
