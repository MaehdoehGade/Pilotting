(() => {
  const { income, fixedTotal, flowySpentSoFar, chestTotal } = ANYDAY_DEMO;
  const unused = Math.max(anydayUnused(), 0);

  const segments = [
    { label: "Fast", amount: fixedTotal, color: "#3f5fa8" },
    { label: "Flyt", amount: flowySpentSoFar, color: "#8f6fc4" },
    { label: "Sparat", amount: chestTotal, color: "#e08fb0" },
    { label: "Kvar", amount: unused, color: "rgba(255,255,255,0.08)" },
  ];

  const bar = document.getElementById("bar");
  const legend = document.getElementById("legend");

  for (const seg of segments) {
    const pct = (seg.amount / income) * 100;
    const div = document.createElement("div");
    div.className = "seg";
    div.style.width = `${pct}%`;
    div.style.background = seg.color;
    bar.appendChild(div);

    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <span class="left">
        <span class="dot" style="background:${seg.color === "rgba(255,255,255,0.08)" ? "#5b6660" : seg.color}"></span>
        <span class="name">${seg.label}</span>
      </span>
      <span class="amount">${anydayFormatSEK(seg.amount)}</span>
    `;
    legend.appendChild(row);
  }
})();
