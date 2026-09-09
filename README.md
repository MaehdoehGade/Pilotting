# Everyday

Everyday is an interactive demo of a simple, number-free way to manage a
month's money. No spreadsheets, no columns of numbers: your income pours
into a jar, Fixed costs settle at the bottom, Flowy spend floats on top,
and what's left empty is what's still yours to decide on.

## What's here

Three screens, reachable from the bottom tab bar:

1. **Översikt (Overview)** — money in/out for the month so far, shown as a
   single liquid jar sized by income. Fixed costs (rent, bills, loan
   payments) sink to the bottom because they're already spoken for; flowy,
   changeable spend (food, shopping, fun) floats above it, so the jar itself
   tells you what's easy to adjust. Also surfaces loans held at other
   providers.
2. **Simulera (Simulate)** — projects the rest of the month forward from the
   current daily pace. Slash a projected purchase to commit to skipping it;
   the amount pours straight into what you'd save, with the same
   celebration burst whether you're keeping a purchase you wanted or
   skipping one you didn't.
3. **Sparkista (Savings chest)** — a savings chest with an independent
   double lock, an assigned purpose (e.g. "Resa till Åre"), and a progress
   bar toward a target. Money freed up in the simulator can be moved
   straight into it.

## Brand

The identity system (mark, color, type, motion, voice) lives in a separate
brand book covering the full rationale, not just the tokens. This app is
its systematic application: the liquid jar is the same clip-path technique
as the mark, the celebration burst is the same one used in the brand
book's Motion chapter, and no amount is ever colored by its sign (income
and spend render identically, see `src/index.css` and the `Unjudged` note
in the brand book's Type chapter).

## Data

All data (`src/data/mockData.ts`) is dummy — transactions, categories,
external loans, and a savings chest — served through `src/data/adapter.ts`.
That adapter is the seam for swapping in a real backend (e.g. a Google
Sheet of transactions) later without touching any screen.

## Stack

Vite + React + TypeScript, Tailwind CSS v4 for the design tokens (Ink,
Navy, Line, Paper, Aluminum, Signal, Pulse, Static — see the brand book),
Hanken Grotesk + IBM Plex Mono for type, Framer Motion for the springy
transitions, and lucide-react for outline icons. Illustration is flat
geometric shapes (hills, pines, a minimal skyline), no photography, no
wildlife.

## The browser extension

`extension/` is a companion prototype: a Manifest V3 extension that catches
the moment of a purchase decision itself, not just the review of it
afterward. It detects a checkout total on the current page and shows the
same kind of comparison the app makes — a bubble sized to what's actually
left in your month, plus "≈ 2 × Espresso House" instead of an abstract
number. See `extension/README.md` for the reasoning and how to load it.
It still uses the app's older palette and naming; bringing it in line with
the current brand is on the list, not done yet.

## Running it

```bash
npm install
npm run dev
```

The app is designed mobile-first; on wider viewports it renders inside a
phone-shaped frame.
