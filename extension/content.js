(() => {
  const CURRENCY_RE = /(\d[\d\s.,]{1,9}\d|\d)\s?(kr\b|SEK\b|:-|€|\$|£)|(\€|\$|£)\s?(\d[\d.,]{0,9}\d|\d)/i;
  const KEYWORDS = [
    "total", "totalt", "att betala", "summa", "grand total", "amount due",
    "to pay", "sum:", "order total", "cart total", "subtotal", "totalsumma",
  ];
  const URL_HINTS = ["cart", "checkout", "basket", "order", "kassa", "varukorg"];

  let lastShownAmount = null;
  let overlayHost = null;

  function parseAmount(text) {
    const cleaned = text.replace(/[^\d.,]/g, "");
    if (!cleaned) return null;
    // Heuristic: thousands separator is a space or period/comma followed by
    // exactly 3 digits repeating; decimal separator is , or . with 2 digits.
    let normalized = cleaned;
    if (/,\d{2}$/.test(normalized)) normalized = normalized.replace(/\./g, "").replace(",", ".");
    else normalized = normalized.replace(/[.,](?=\d{3}(\D|$))/g, "");
    const value = parseFloat(normalized.replace(",", "."));
    return Number.isFinite(value) ? value : null;
  }

  function nearbyText(el) {
    let node = el;
    let text = "";
    for (let i = 0; i < 3 && node; i++) {
      text += " " + (node.getAttribute?.("aria-label") || "") + " " + (node.className?.toString?.() || "");
      node = node.parentElement;
    }
    text += " " + (el.previousElementSibling?.textContent || "");
    return text.toLowerCase();
  }

  function scoreCandidate(el, matchText) {
    const context = nearbyText(el) + " " + matchText.toLowerCase();
    let score = 0;
    for (const kw of KEYWORDS) {
      if (context.includes(kw)) score += 2;
    }
    if (/total|summa|pris|price/i.test(el.id + " " + el.className)) score += 1;
    return score;
  }

  function findCandidates() {
    const candidates = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.trim().length === 0) return NodeFilter.FILTER_REJECT;
        if (node.nodeValue.length > 60) return NodeFilter.FILTER_REJECT;
        const tag = node.parentElement?.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        return CURRENCY_RE.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (!el || el.offsetParent === null) continue; // skip hidden
      const amount = parseAmount(node.nodeValue.match(CURRENCY_RE)[0]);
      if (!amount || amount < 20 || amount > 200000) continue;
      candidates.push({ el, amount, score: scoreCandidate(el, node.nodeValue) });
    }
    return candidates;
  }

  function pickBestCandidate() {
    const candidates = findCandidates();
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score || b.amount - a.amount);
    const best = candidates[0];
    const urlLooksLikeCheckout = URL_HINTS.some((h) => location.href.toLowerCase().includes(h));
    if (best.score >= 2 || urlLooksLikeCheckout) return best;
    return null;
  }

  function buildOverlay(amount) {
    if (overlayHost) overlayHost.remove();

    const categoryId = anydayGuessCategory(location.hostname);
    const cat = ANYDAY_DEMO.categories[categoryId];
    const unused = anydayUnused();
    const { count, sample } = anydayClosestMatch(categoryId, amount);

    const ratio = unused > 0 ? Math.min(amount / unused, 1.6) : null;

    overlayHost = document.createElement("div");
    overlayHost.style.all = "initial";
    overlayHost.style.position = "fixed";
    overlayHost.style.bottom = "20px";
    overlayHost.style.right = "20px";
    overlayHost.style.zIndex = "2147483647";
    document.documentElement.appendChild(overlayHost);

    const root = overlayHost.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; }
      .card {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        width: 268px;
        background: #1c2924;
        color: #f2efe8;
        border-radius: 20px;
        padding: 16px;
        box-shadow: 0 20px 40px -14px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3);
        animation: pop 0.35s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes pop { from { opacity: 0; transform: translateY(12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
      .eyebrow { font-size: 10px; color: #939c9a; letter-spacing: 0.02em; }
      .amount { font-size: 20px; font-weight: 700; margin: 2px 0 10px; }
      .close { background: rgba(255,255,255,0.1); border: none; color: #939c9a; width: 22px; height: 22px; border-radius: 999px; cursor: pointer; font-size: 13px; line-height: 1; }
      .bubble-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
      .bubble { border-radius: 999px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; flex-shrink: 0; }
      .label { font-size: 12px; color: #d8d4cc; line-height: 1.4; }
      .label b { color: #f2efe8; }
      .compare { font-size: 11px; color: #939c9a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; margin-top: 2px; }
    `;
    root.appendChild(style);

    const bubbleSize = ratio === null ? 54 : Math.round(34 + Math.min(ratio, 1) * 40);
    const overspendNote = unused <= 0
      ? `Du är redan <b>${anydayFormatSEK(-unused)}</b> över för månaden — det här läggs ovanpå det.`
      : ratio >= 1
        ? `Det är <b>mer än allt</b> du har kvar att röra dig med i år (${anydayFormatSEK(unused)}).`
        : `Det är <b>${Math.round(ratio * 100)}%</b> av de ${anydayFormatSEK(unused)} du har kvar den här månaden.`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="top">
        <span class="eyebrow">INNAN DU KLICKAR KÖP · ${cat.name.toUpperCase()}</span>
        <button class="close" aria-label="Stäng">✕</button>
      </div>
      <div class="amount">${anydayFormatSEK(amount)}</div>
      <div class="bubble-row">
        <div class="bubble" style="width:${bubbleSize}px;height:${bubbleSize}px;background:${cat.color};color:${cat.onColor}">
          ${ratio !== null ? Math.round(Math.min(ratio, 1) * 100) + "%" : ""}
        </div>
        <div class="label">${overspendNote}</div>
      </div>
      <div class="compare">≈ ${count} × ${sample.merchant} (${anydayFormatSEK(sample.amount)} st — ett av dina egna köp i år)</div>
    `;
    root.appendChild(card);
    card.querySelector(".close").addEventListener("click", () => overlayHost.remove());
  }

  function scan() {
    const best = pickBestCandidate();
    if (!best) return;
    const rounded = Math.round(best.amount);
    if (rounded === lastShownAmount) return;
    lastShownAmount = rounded;
    buildOverlay(best.amount);
  }

  let debounceTimer = null;
  function scheduleScan() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(scan, 600);
  }

  scheduleScan();
  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
