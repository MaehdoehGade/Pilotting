# Anyday — Real Cost (browser extension prototype)

The Anyday app helps you look back at a month or project it forward. This
extension is the third piece: it catches the one moment those two can't —
the click itself.

## The idea

Modern checkout is built to remove friction: one click, buy now pay later,
face ID. That's good UX and it also quietly disables the thing that would
normally make you hesitate. Loss aversion only works if the loss is
*represented as a loss* at the moment you decide — and "€45" or "899 kr" on
a checkout button has almost no experiential content. Your brain isn't
comparing the shirt to two dinners and a trip to the cinema; it's comparing
the shirt to a number.

This extension re-attaches the number to something real, right before you
click buy:

- It scans the current page for a checkout-style total (heuristic: currency
  patterns near words like "total", "summa", "att betala", or on a
  cart/checkout-shaped URL).
- It guesses a category from the site (clothing → Shopping, food delivery →
  Mat & fika, travel/fitness → Nöje & resor).
- It shows a small card, in the same visual language as the app: a bubble
  sized to how much of what's *actually left* in your month this purchase
  would take, plus a translation into your own real, recent purchases
  ("≈ 2 × Espresso House") instead of an abstract percentage.

It reuses the exact numbers from `src/data/mockData.ts` (`data.js` is a
hand-kept snapshot) — same income, same categories, same "unused" figure
the app's box shows — so the comparison is provably the same one the app
would make, not a separate invented one.

## Try it

1. Open `chrome://extensions`, enable **Developer mode** (top right).
2. **Load unpacked** → select this `extension/` folder.
3. Visit any checkout-shaped page (or open `test-fixture.html` in this
   folder locally — if it doesn't trigger, toggle **Allow access to file
   URLs** on the extension's card in `chrome://extensions`) — the card
   appears bottom-right once it finds a total.
4. Click the toolbar icon for the popup: a compact version of the app's
   income box (Fast / Flyt / Sparat / Kvar).

## Honesty about scope

This is a demo, not a shipped product:

- Price detection is a heuristic (currency regex + keyword proximity). It
  works well on straightforward checkout pages; it will miss or misfire on
  pages that render totals via canvas, iframes from a different origin, or
  unusual markup.
- The month data is a static snapshot, not live-synced with the app or a
  real account — there's no backend here.
- Category guessing is a hostname keyword list, easy to extend but not
  exhaustive.

The point of this prototype is the interaction and the framing — catching
the decision at the moment it's made, in the user's own terms — not
production-grade page scraping.
