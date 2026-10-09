/*  ====  Biorhythm CALCULATION  ==== */
function sinCycle(days, period) {
  return Math.sin((2 * Math.PI * days) / period);
}

function daysSinceBirth(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  const diffMs = Math.abs(today - birth);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function computeCycles(birthDate, rangeDays) {
  const todayOffset = daysSinceBirth(birthDate);
  const data = [];
  for (let i = -rangeDays; i <= rangeDays; i++) {
    const day = todayOffset + i;
    data.push({
      day,
      physical: sinCycle(day, 23),
      emotional: sinCycle(day, 28),
      intellectual: sinCycle(day, 33)
    });
  }
  return data;
}

/*  Map sine value (‑1…+1) → 0‑100 %  */
function cyclePct(value) {
  return Math.round(((value + 1) / 2) * 100);
}

/*  ====  UI HANDLER  ==== */
document.getElementById('biorhythm-form').addEventListener('submit', e => {
  e.preventDefault();

  const birth = document.getElementById('birthdate').value.trim();
  const range = parseInt(document.getElementById('range').value, 10) || 60;

  if (!birth || !/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
    alert('Enter a valid date in YYYY‑MM‑DD format.');
    return;
  }
  if (range < 1) {
    alert('Days to show must be at least 1.');
    return;
  }

  const cycles = computeCycles(birth, range);
  const today = cycles.find(d => d.day === 0) || cycles[0];

  const pctPhysical    = cyclePct(today.physical);
  const pctEmotional   = cyclePct(today.emotional);
  const pctIntellectual = cyclePct(today.intellectual);

  const out = document.getElementById('result');
  out.innerHTML = `
    <div class="tile"><div class="pct">${pctPhysical}%</div>Physical</div>
    <div class="tile"><div class="pct">${pctEmotional}%</div>Emotional</div>
    <div class="tile"><div class="pct">${pctIntellectual}%</div>Intellectual</div>
  `;
});
