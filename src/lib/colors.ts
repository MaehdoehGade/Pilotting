import type { Category } from "../data/types";

export type ColorKey = Category["color"];

interface ColorSet {
  hex: string;
  hexSoft: string;
  /** Text/icon color to place on top of `hex` so it stays readable. */
  onHex: string;
}

export const colorSets: Record<ColorKey, ColorSet> = {
  forest: {
    hex: "#384a2c",
    hexSoft: "#4a5f3c",
    onHex: "#f2efe8",
  },
  navy: {
    hex: "#3a486d",
    hexSoft: "#56628a",
    onHex: "#f2efe8",
  },
  plum: {
    hex: "#706688",
    hexSoft: "#8d81a3",
    onHex: "#f2efe8",
  },
  slate: {
    hex: "#727b7a",
    hexSoft: "#939c9a",
    onHex: "#12190f",
  },
  blush: {
    hex: "#c8b2be",
    hexSoft: "#dccbd4",
    onHex: "#12190f",
  },
};

export const accentHex = "#c8b2be";
