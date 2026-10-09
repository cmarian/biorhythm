// ---------- Helpers ----------
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

function findCriticalDays(data) {
  const critical = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const cur = data[i];
    // physical zero‑crossing
    if ((prev.physical >= 0 && cur.physical < 0) ||
        (prev.physical <= 0 && cur.physical > 0))
      critical.push({ day: cur.day, type: 'physical' });
    // emotional zero‑crossing
    if ((prev.emotional >= 0 && cur.emotional < 0) ||
        (prev.emotional <= 0 && cur.emotional > 0))
      critical.push({ day: cur.day, type: 'emotional' });
    // intellectual zero‑crossing
    if ((prev.intellectual >= 0 && cur.intellectual < 0) ||
        (prev.intellectual <= 0 && cur.intellectual > 0))
      critical.push({ day: cur.day, type: 'intellectual' });
  }
  return critical;
}

// ---------- Render chart ----------
function renderChart(data) {
  const ctx = document.getElementById('biorhythmChart').getContext('2d');

  const days = data.map(d => d.day);
  const physical = data.map(d => d.physical);
  const emotional = data.map(d => d.emotional);
  const intellectual = data.map(d => d.intellectual);

  const allVals = [...physical, ...emotional, ...intellectual];
  const min = Math.min(...allVals) - 0.1;
  const max = Math.max(...allVals) + 0.1;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Physical (23 d)',
          data: physical,
          borderColor: '#e85d3e',
          backgroundColor: 'rgba(232,93,62,0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Emotional (28 d)',
          data: emotional,
          borderColor: '#f5a623',
          backgroundColor: 'rgba(245,166,35,0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Intellectual (33 d)',
          data: intellectual,
          borderColor: '#2a9d8f',
          backgroundColor: 'rgba(42,157,143,0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      hover: { mode: 'index' },
      scales: {
        y: { min, max, display: true, title: { display: true, text: 'Cycle value' }, ticks: { stepSize: 0.2 } },
        x: { title: { display: true, text: 'Days relative to today' } }
      },
      plugins: {
        title: {
          display: true,
          text: 'Biorhythm Cycles',
          font: { size: 16 }
        }
      }
    }
  });
}

// ---------- UI interaction ----------
document.getElementById('biorhythm-form').addEventListener('submit', e => {
  e.preventDefault();

  const birth = document.getElementById('birthdate').value;
  const range = parseInt(document.getElementById('range').value, 10) || 90;
  if (!birth) { alert('Please select a birth date.'); return; }

  const cycles = computeCycles(birth, range);
  const critical = findCriticalDays(cycles);

  // ------- Populate text result -------
  const todayEntry = cycles.find(d => d.day === 0);
  const todayPct = [
    `Physical: ${Math.round((todayEntry.physical + 1) * 50)}%`,
    `Emotional: ${Math.round((todayEntry.emotional + 1) * 50)}%`,
    `Intellectual: ${Math.round((todayEntry.intellectual + 1) * 50)}%`
  ].join('<br>');

  document.getElementById('result').innerHTML = todayPct;
  document.getElementById('result').style.display = 'block';

  // ------- Draw chart -------
  renderChart(cycles);

  // ------- Log critical days -------
  if (critical.length) {
    console.log('Critical days detected:', critical);
  }
});
