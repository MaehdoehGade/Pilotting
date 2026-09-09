import { motion } from "framer-motion";
import { Lock, PiggyBank, Waves, Wallet } from "lucide-react";
import type { SpendGroup } from "../data/types";
import { colorSets } from "../lib/colors";
import { formatSEK } from "../lib/money";

const VB_W = 390;
const VB_H = 180;
const JAR_LEFT = 145;
const JAR_RIGHT = 245;
const JAR_TOP = 14;
const JAR_BOTTOM = 166;
const JAR_H = JAR_BOTTOM - JAR_TOP;
const WAVE_AMP = 4;

/**
 * The one jar, sized by income, that both Overview and Simulate render.
 * Money pours in and sinks: Fixed settles at the bottom (it's already
 * spoken for), Flowy floats on top of it. What's left empty at the top is
 * unused. If a screen's total exceeds income there's no room left to draw,
 * so an overflow banner takes over instead of stretching the jar.
 */
export function MonthBox({
  income,
  fixedTotal,
  flowyTotal,
  savedTotal,
  showFigures,
  onSelectGroup,
  onSelectSaved,
}: {
  income: number;
  fixedTotal: number;
  flowyTotal: number;
  savedTotal: number;
  showFigures: boolean;
  onSelectGroup: (group: SpendGroup) => void;
  onSelectSaved: () => void;
}) {
  const allocated = fixedTotal + flowyTotal;
  const overflow = Math.max(allocated - income, 0);
  const unused = Math.max(income - allocated, 0);

  // Normal: fractions of income, leaving empty headspace for what's unused.
  // Overflowing: no headspace left, the jar reads full, split by ratio.
  const fixedFrac = overflow > 0 ? fixedTotal / allocated : fixedTotal / income;
  const flowyFrac = overflow > 0 ? flowyTotal / allocated : flowyTotal / income;

  const fixedH = fixedFrac * JAR_H;
  const flowyH = flowyFrac * JAR_H;
  const boundaryY = JAR_BOTTOM - fixedH;
  const waveY = boundaryY - flowyH;
  const midX = (JAR_LEFT + JAR_RIGHT) / 2;
  const q1x = JAR_LEFT + (JAR_RIGHT - JAR_LEFT) / 4;

  const fixedColor = colorSets.navy.hex;
  const flowyColor = colorSets.plum.hex;

  const flowyPath = `M${JAR_LEFT},${boundaryY} L${JAR_LEFT},${waveY} Q${q1x},${waveY - WAVE_AMP} ${midX},${waveY} T${JAR_RIGHT},${waveY} L${JAR_RIGHT},${boundaryY} Z`;

  return (
    <div>
      {overflow > 0 && (
        <div className="mb-2 flex items-center justify-center rounded-xl bg-static/15 py-1.5">
          <span className="font-mono text-[11px] font-semibold text-static">Överdrag {formatSEK(overflow)}</span>
        </div>
      )}

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" style={{ height: VB_H }} aria-hidden>
        <defs>
          <clipPath id="jarClip">
            <rect x={JAR_LEFT} y={JAR_TOP} width={JAR_RIGHT - JAR_LEFT} height={JAR_H} rx={16} />
          </clipPath>
        </defs>
        <rect
          x={JAR_LEFT}
          y={JAR_TOP}
          width={JAR_RIGHT - JAR_LEFT}
          height={JAR_H}
          rx={16}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={2}
        />
        <g clipPath="url(#jarClip)">
          <motion.rect
            x={JAR_LEFT}
            width={JAR_RIGHT - JAR_LEFT}
            fill={fixedColor}
            initial={false}
            animate={{ y: boundaryY, height: JAR_BOTTOM - boundaryY }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <motion.path
            fill={flowyColor}
            initial={false}
            animate={{ d: flowyPath }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </g>
      </svg>

      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={() => onSelectGroup("fixed")}
          className="flex items-center justify-between rounded-2xl bg-navy-2 px-3.5 py-2.5"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: fixedColor }}>
              <Lock className="h-3.5 w-3.5" strokeWidth={2} style={{ color: colorSets.navy.onHex }} />
            </span>
            <span className="text-[13px] font-medium text-paper">Fast</span>
          </span>
          {showFigures && <span className="font-mono text-[13px] font-semibold text-paper">{formatSEK(fixedTotal)}</span>}
        </button>

        <button
          onClick={() => onSelectGroup("flowy")}
          className="flex items-center justify-between rounded-2xl bg-navy-2 px-3.5 py-2.5"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: flowyColor }}>
              <Waves className="h-3.5 w-3.5" strokeWidth={2} style={{ color: colorSets.plum.onHex }} />
            </span>
            <span className="text-[13px] font-medium text-paper">Flyt</span>
          </span>
          {showFigures && <span className="font-mono text-[13px] font-semibold text-paper">{formatSEK(flowyTotal)}</span>}
        </button>

        {unused > 0 && (
          <div className="flex items-center justify-between rounded-2xl border border-dashed border-line px-3.5 py-2.5">
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-2">
                <Wallet className="h-3.5 w-3.5 text-aluminum" strokeWidth={2} />
              </span>
              <span className="text-[13px] font-medium text-aluminum">Oanvänt</span>
            </span>
            {showFigures && <span className="font-mono text-[13px] font-semibold text-aluminum">{formatSEK(unused)}</span>}
          </div>
        )}

        {savedTotal > 0 && (
          <button
            onClick={onSelectSaved}
            className="flex items-center justify-between rounded-2xl bg-navy-2 px-3.5 py-2.5"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal">
                <PiggyBank className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
              </span>
              <span className="text-[13px] font-medium text-paper">Sparat</span>
            </span>
            {showFigures && <span className="font-mono text-[13px] font-semibold text-paper">{formatSEK(savedTotal)}</span>}
          </button>
        )}
      </div>
    </div>
  );
}
