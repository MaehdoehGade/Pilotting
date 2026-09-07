import type { Category } from "../data/types";

export type ColorKey = Category["color"];

interface ColorSet {
  bg: string;
  bgSoft: string;
  text: string;
  border: string;
  hex: string;
  hexSoft: string;
}

export const colorSets: Record<ColorKey, ColorSet> = {
  forest: {
    bg: "bg-forest",
    bgSoft: "bg-forest-soft",
    text: "text-forest",
    border: "border-forest",
    hex: "#202e17",
    hexSoft: "#384a2c",
  },
  navy: {
    bg: "bg-navy",
    bgSoft: "bg-navy-soft",
    text: "text-navy",
    border: "border-navy",
    hex: "#3a486d",
    hexSoft: "#56628a",
  },
  plum: {
    bg: "bg-plum",
    bgSoft: "bg-plum-soft",
    text: "text-plum",
    border: "border-plum",
    hex: "#706688",
    hexSoft: "#8d81a3",
  },
  slate: {
    bg: "bg-slate",
    bgSoft: "bg-slate-soft",
    text: "text-slate",
    border: "border-slate",
    hex: "#727b7a",
    hexSoft: "#939c9a",
  },
  blush: {
    bg: "bg-blush",
    bgSoft: "bg-blush-soft",
    text: "text-blush",
    border: "border-blush",
    hex: "#c8b2be",
    hexSoft: "#dccbd4",
  },
};
