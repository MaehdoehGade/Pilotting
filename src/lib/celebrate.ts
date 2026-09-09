/**
 * The celebration burst: droplets pop outward and the target overshoots
 * and settles. Fires when a decision matches what someone actually wanted,
 * spending it or holding onto it look identical, per the brand book's
 * Motion chapter. Call it from any click handler with the element that was
 * clicked; it needs a positioned ancestor with class "celebrate-anchor"
 * (or falls back to the element's own parent).
 */
export function celebrate(target: HTMLElement | null) {
  if (!target) return;
  const anchor = (target.closest(".celebrate-anchor") as HTMLElement) ?? target.parentElement;
  if (!anchor) return;

  const burst = document.createElement("div");
  burst.className = "celebrate-burst";

  const ring = document.createElement("div");
  ring.className = "celebrate-ring";
  burst.appendChild(ring);

  const n = 8;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const dist = 34;
    const drop = document.createElement("div");
    drop.className = "celebrate-drop";
    drop.style.setProperty("--dx", `${(Math.cos(angle) * dist).toFixed(1)}px`);
    drop.style.setProperty("--dy", `${(Math.sin(angle) * dist).toFixed(1)}px`);
    burst.appendChild(drop);
  }

  anchor.appendChild(burst);
  target.classList.add("celebrate-bounce");
  window.setTimeout(() => {
    target.classList.remove("celebrate-bounce");
    burst.remove();
  }, 660);
}
