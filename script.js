// Biorhythm Calculator (vanilla JS)
// Cycles: physical 23d, emotional 28d, intellectual 33d
// Value = sin(2π * days / period)

function sinCycle(days, period) {
  return Math.sin((2 * Math.PI * days) / period);
}

function daysSinceBirth(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  const diffTime = Math.abs(today - birth);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function computeCycles(birthDate, range) {
  const start = -range;
  const end = range;
  const result = [];
  for (let d = start; d <= end; d++) {
    const day = daysSinceBirth(birthDate) + d;
    const physical = sinCycle(day, 23);
    const emotional = sinCycle(day, 28);
    const intellectual = sinCycle(day, 33);
    result.push({ day, physical, emotional, intellectual });
  }
  return result;
}

function formatCycleValue(val) {
  const pct = Math.round((val + 1) * 50); // 0..100
  return pct + '%';
}

document.getElementById('calculate').addEventListener('click', () => {
  const birth = document.getElementById('birthdate').value;
  const range = parseInt(document.getElementById('range').value, 10) || 60;
  if (!birth) {
    alert('Please select a birth date.');
    return;
  }
  const cycles = computeCycles(birth, range);
  const html = [
    `Physical cycle (23d): ${formatCycleValue(cycles[0].physical)} at day ${cycles[0].day}`,
    `Emotional cycle (28d): ${formatCycleValue(cycles[0].emotional)} at day ${cycles[0].day}`,
    `Intellectual cycle (33d): ${formatCycleValue(cycles[0].intellectual)} at day ${cycles[0].day}`,
  ].join('<br>');
  document.getElementById('result').innerHTML = html;
  document.getElementById('result').hidden = false;
});
