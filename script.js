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

/*  Helper: map sine (‑1…+1) to a 0‑100 % value  */
function cyclePct(value) {
  return Math.round(((value + 1) / 2) * 100);
}

/*  ====  CHART.JS RENDERER  ==== */
function renderChart(data) {
  const ctx = document.getElementById('biorhythmChart').getContext('2d');
  const days = data.map(d => d.day);
  const physical = data.map(d => d.physical);
  const emotional = data.map(d => d.emotional);
  const intellectual = data.map(d => d.intellectual);

  const min = Math.min(...physical, ...emotional, ...intellectual) - 0.2;
  const max = Math.max(...physical, ...emotional, ...intellectual) + 0.2;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Physical (23 d)',
          data: physical,
          borderColor: '#7eccab',
          backgroundColor: 'rgba(126,204,171,0.15)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Emotional (28 d)',
          data: emotional,
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(251,107,107,0.15)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Intellectual (33 d)',
          data: intellectual,
          borderColor: '#ffe66d',
          backgroundColor: 'rgba(255,230,109,0.15)',
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
        y: { min, max, display: true,
             title: { display: true, text: 'Cycle value' },
             ticks: { stepSize: 0.2 } },
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

/*  ====  UI HANDLER – form submit  ==== */
document.getElementById('biorhythm-form').addEventListener('submit', e => {
  e.preventDefault();

  const birth = document.getElementById('birthdate').value;
  const range = parseInt(document.getElementById('range').value, 10) || 90;
  if (!birth) { alert('Pick a birth date.'); return; }

  const cycles = computeCycles(birth, range);

  // -------  Today’s entry (day 0)  -------
  const today = cycles.find(d => d.day === 0);
  if (!today) today = cycles[0]; // fallback (should rarely happen)

  // -------  Fill the three percentage tiles  -------
  const tiles = document.querySelectorAll('.tile');
  tiles[0].querySelector('.pct').textContent = `${cyclePct(today.physical)}%`;
  tiles[0].querySelector('.name').textContent = 'Physical';

  tiles[1].querySelector('.pct').textContent = `${cyclePct(today.emotional)}%`;
  tiles[1].querySelector('.name').textContent = 'Emotional';

  tiles[2].querySelector('.pct').textContent = `${cyclePct(today.intellectual)}%`;
  tiles[2].querySelector('.name').textContent = 'Intellectual';

  // -------  Render the sine‑wave chart  -------
  renderChart(cycles);
});

/*  OPTIONAL: a tiny confetti burst after each calculate click  */
function burstConfetti() {
  const colors = ['#7eccab','#ff6b6b','#ffe66d'];
  const container = document.createElement('div');
  container.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:9999;
  `;
  document.body.appendChild(container);

  const pieces = 30;
  for (let i = 0; i < pieces; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;width:10px;height:10px;
      background:${colors[Math.random()*3|0];
      };border-radius:${i%2?'2px':'50%'};
      left:${Math.random()*100}%;top:-10px;
      opacity:1;animation:confettiFall 1.2s ease-out forwards;
    `;
    container.appendChild(p);
  }
  setTimeout(() => container.remove(), 1300);
}
const style = document.createElement('style');
style.textContent = `
  @keyframes confettiFall{
    0%   {transform:translateY(-10px)rotate(0deg);opacity:1;}
    100% {transform:translateY(130vh)rotate(360deg);opacity:0;}
  }
`;
document.head.appendChild(style);
