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

/*  ====  Helper: map sine value (-1→+1) to a 0‑100 %  ==== */
function cyclePct(value) {
  // value∈[-1,1] → 0‑100%
  return Math.round(((value + 1) / 2) * 100);
}

/*  ====  UI HANDLER – form submit  ==== */
document.getElementById('biorhythm-form').addEventListener('submit', e => {
  e.preventDefault();

  const birth = document.getElementById('birthdate').value;
  const range = parseInt(document.getElementById('range').value, 10) || 60;
  if (!birth) { alert('Pick a birth date.'); return; }

  const cycles = computeCycles(birth, range);

  // Take the entry that corresponds to “today” (day 0 in the array)
  const today = cycles.find(d => d.day === 0);
  if (!today) {
    // fallback: just use the first entry (should rarely happen)
    today = cycles[0];
  }

  // -------  Fill the three tiles  -------
  const tiles = document.querySelectorAll('.tile');
  tiles[0].querySelector('.pct').textContent = `${cyclePct(today.physical)}%`;
  tiles[0].querySelector('.name').textContent = 'Physical';

  tiles[1].querySelector('.pct').textContent = `${cyclePct(today.emotional)}%`;
  tiles[1].querySelector('.name').textContent = 'Emotional';

  tiles[2].querySelector('.pct').textContent = `${cyclePct(today.intellectual)}%`;
  tiles[2].querySelector('.name').textContent = 'Intellectual';

  // optional: tiny confetti burst (pure CSS, no library)
  burstConfetti();
});

/*  ====  Very tiny confetti effect (no external lib)  ==== */
function burstConfetti() {
  const colors = ['#e91e63','#ff9800','#ffc107','#00d2d3','#4facfe'];
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0'; container.style.left = '0';
  container.style.width = '100%'; container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const pieces = 30;
  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('div');
    piece.style.position = 'absolute';
    piece.style.width = piece.style.height = '10px';
    piece.style.background = colors[Math.random()*colors.length|0];
    piece.style.borderRadius = i%2 ? '2px' : '50%'; // mix squares & circles
    piece.style.left = (Math.random()*100)+'%';
    piece.style.top = '-10px';
    piece.style.opacity = '1';
    piece.style.animation = 'confettiFall 1.2s ease-out forwards';
    container.appendChild(piece);
  }

  // remove after animation
  setTimeout(() => { container.remove(); }, 1300);
}

/*  Add the keyframe for the confetti (inject once) */
const style = document.createElement('style');
style.textContent = `
  @keyframes confettiFall{
    0%   {transform:translateY(-10px) rotate(0deg);opacity:1;}
    100% {transform:translateY(130vh) rotate(360deg);opacity:0;}
  }
`;
document.head.appendChild(style);
