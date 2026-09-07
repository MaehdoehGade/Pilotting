import type { Category } from "../data/types";

export type ColorKey = Category["color"];

interface ColorSet {
  hex: string;
  /** Lighter tint of the same hue — hover states, residual/secondary fills. */
  hexSoft: string;
  /** Text/icon color to place on top of `hex` so it stays readable. */
  onHex: string;
}

export const colorSets: Record<ColorKey, ColorSet> = {
  forest: {
    hex: "#4f7a3a",
    hexSoft: "#6f9c58",
    onHex: "#f2efe8",
  },
  navy: {
    hex: "#3f5fa8",
    hexSoft: "#6884c9",
    onHex: "#f2efe8",
  },
  plum: {
    hex: "#8f6fc4",
    hexSoft: "#af97d8",
    onHex: "#f2efe8",
  },
  slate: {
    hex: "#4f8f88",
    hexSoft: "#74b0a9",
    onHex: "#0d1613",
  },
  blush: {
    hex: "#e08fb0",
    hexSoft: "#eab3c8",
    onHex: "#2c1420",
  },
};

/** Reserved for interactive/actionable moments (loan merge CTA, live nudges) —
 * never used for category identity, so it always reads as "do something here". */
export const goldAccent = "#e8a94e";
export const goldAccentSoft = "#f0c37e";
