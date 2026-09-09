/**
 * Snapshot of the same demo month as the Anyday app (src/data/mockData.ts).
 * Not live-synced — this is a demo extension — but every number here is
 * pulled straight from that file, not invented, so the comparisons it
 * makes are exactly the ones the app itself would show.
 */
const ANYDAY_DEMO = {
  income: 32000,
  fixedTotal: 17677, // Boende + Räkningar & lån, incl. scheduled loan payments
  flowySpentSoFar: 9276, // Mat & fika + Shopping + Nöje & resor, so far this month
  chestTotal: 4200, // already moved to the savings chest
  daysElapsed: 16,
  daysInMonth: 30,

  categories: {
    mat: {
      name: "Mat & fika",
      color: "#8f6fc4",
      onColor: "#f2efe8",
      keywords: ["ica", "coop", "hemkop", "hemköp", "willys", "foodora", "wolt", "ubereats", "uber eats", "mcdonald", "max", "espresso", "cafe", "café", "restaurant", "sushi", "pizza"],
      recentPurchases: [
        { merchant: "ICA Maxi", amount: 455 },
        { merchant: "Espresso House", amount: 64 },
        { merchant: "Sushi Yama", amount: 285 },
        { merchant: "Foodora", amount: 245 },
      ],
    },
    shopping: {
      name: "Shopping",
      color: "#e08fb0",
      onColor: "#2c1420",
      keywords: ["zalando", "hm.com", "h&m", "asos", "cdon", "lindex", "zara", "nike", "adidas", "amazon", "ebay", "aliexpress", "shein", "boozt", "nelly", "steam"],
      recentPurchases: [
        { merchant: "Zalando", amount: 899 },
        { merchant: "H&M", amount: 449 },
        { merchant: "CDON", amount: 599 },
        { merchant: "Lindex", amount: 329 },
      ],
    },
    noje: {
      name: "Nöje & resor",
      color: "#4f8f88",
      onColor: "#0d1613",
      keywords: ["sats", "ticketmaster", "sj.se", "flyg", "sas.se", "norwegian", "ryanair", "biljett", "sf.se", "filmstaden", "booking.com", "airbnb", "circle k", "sl.se"],
      recentPurchases: [
        { merchant: "SL Access", amount: 930 },
        { merchant: "SATS", amount: 449 },
        { merchant: "Circle K", amount: 650 },
        { merchant: "Biocheck", amount: 260 },
      ],
    },
  },

  defaultCategory: "shopping",
};

function anydayGuessCategory(hostname) {
  const host = hostname.toLowerCase();
  for (const [id, cat] of Object.entries(ANYDAY_DEMO.categories)) {
    if (cat.keywords.some((k) => host.includes(k))) return id;
  }
  return ANYDAY_DEMO.defaultCategory;
}

function anydayUnused() {
  const { income, fixedTotal, flowySpentSoFar, chestTotal } = ANYDAY_DEMO;
  return income - fixedTotal - flowySpentSoFar - chestTotal;
}

function anydayFormatSEK(n) {
  return `${Math.round(n).toLocaleString("sv-SE")} kr`;
}

/** Find the recent purchase whose own amount, repeated some whole number of
 * times, lands closest to `amount` — so the count and the unit price shown
 * always agree with each other, e.g. "≈ 2 × Espresso House (64 kr st)". */
function anydayClosestMatch(categoryId, amount) {
  const purchases = ANYDAY_DEMO.categories[categoryId].recentPurchases;
  let best = null;
  for (const sample of purchases) {
    const count = Math.max(1, Math.round(amount / sample.amount));
    const error = Math.abs(count * sample.amount - amount);
    if (!best || error < best.error) best = { count, sample, error };
  }
  return { count: best.count, sample: best.sample };
}
