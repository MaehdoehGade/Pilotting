# Anyday

Anyday is an interactive demo of a simple, number-free way to manage a
month's money — built for Anyfin. No spreadsheets, no columns of numbers:
spending shows up as tiles and bubbles sized by how much you've spent.

## What's here

Three screens, reachable from the bottom tab bar:

1. **Översikt (Overview)** — money in/out for the month so far, shown as a
   box of tiles and bubbles sized by spend. Fixed costs (rent, bills, loan
   payments) render as square tiles; flowy, changeable spend (food, shopping,
   fun) renders as round bubbles, so the shape alone tells you what's easy to
   adjust. Also surfaces loans held at other providers.
2. **Simulera (Simulate)** — projects the rest of the month forward from the
   current daily pace, with a segmented control per flowy category to dial
   spending down and see the projected end-of-month balance update live.
3. **Sparkista (Savings chest)** — a savings chest with an independent
   double lock, an assigned purpose (e.g. "Resa till Åre"), and a progress
   bar toward a target. Money freed up in the simulator can be moved
   straight into it.

## Data

All data (`src/data/mockData.ts`) is dummy — transactions, categories,
external loans, and a savings chest — served through `src/data/adapter.ts`.
That adapter is the seam for swapping in a real backend (e.g. a Google
Sheet of transactions) later without touching any screen.

## Stack

Vite + React + TypeScript, Tailwind CSS v4 for the design tokens (palette
sampled from the Anyday moodboard, SF Pro font stack), Framer Motion for the
bouncy, candy-crush-style transitions, and lucide-react for outline icons.
Illustration is flat geometric shapes (hills, pines, a minimal skyline) —
no photography, no wildlife.

## The browser extension

`extension/` is a companion prototype: a Manifest V3 extension that catches
the moment of a purchase decision itself, not just the review of it
afterward. It detects a checkout total on the current page and shows the
same kind of comparison the app makes — a bubble sized to what's actually
left in your month, plus "≈ 2 × Espresso House" instead of an abstract
number. See `extension/README.md` for the reasoning and how to load it.

## Running it

```bash
npm install
npm run dev
```

The app is designed mobile-first; on wider viewports it renders inside a
phone-shaped frame.
