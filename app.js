'use strict';

// ── DATA ──────────────────────────────────────────────────────────────────────
const DAYS = [
  {
    label: 'Day 1', title: 'Upper A', sub: 'Push & Pull',
    warmup: 'Arm circles × 20, band pull-aparts × 15, light bar bench × 10',
    exercises: [
      { name: 'Barbell bench press', sets: 4, reps: '6–8', weight: '22kg', rest: 120, note: 'Control the descent 2s down. Main push compound — progressive overload here is priority.' },
      { name: 'Dumbbell row (each arm)', sets: 3, reps: '8–10', weight: '7–8kg DB', rest: 90, note: 'Pull elbow to hip, full stretch at bottom.' },
      { name: 'Dumbbell overhead press', sets: 3, reps: '8–10', weight: '5–6kg DBs', rest: 90, note: 'Seated for stability. Don\'t flare elbows too wide.' },
      { name: 'Incline dumbbell curl', sets: 3, reps: '10–12', weight: '6kg DBs', rest: 60, note: 'Incline position gives a longer bicep stretch — better growth.' },
      { name: 'Tricep pushdown', sets: 3, reps: '10–12', weight: 'Light–medium', rest: 60, note: 'Elbows pinned. Full extension at bottom.' },
    ]
  },
  {
    label: 'Day 2', title: 'Lower A', sub: 'Quad Focus',
    warmup: 'Leg swings × 20, bodyweight squats × 15, glute bridges × 15',
    exercises: [
      { name: 'Barbell back squat', sets: 4, reps: '6–8', weight: '22–25kg', rest: 150, note: 'Depth to parallel. Chest up, knees tracking toes.' },
      { name: 'Leg press', sets: 3, reps: '10–12', weight: '45–50kg', rest: 120, note: 'Feet shoulder-width. Don\'t lock knees fully at top.' },
      { name: 'Romanian deadlift', sets: 3, reps: '8–10', weight: '30–35kg bar', rest: 90, note: 'Hinge at hips, slight knee bend. Feel the hamstring stretch.' },
      { name: 'Leg extension', sets: 3, reps: '12–15', weight: 'Light–medium', rest: 60, note: 'Quad isolation finisher. Full extension, 1s hold at top.' },
      { name: 'Standing calf raise', sets: 4, reps: '12–15', weight: 'BW or +10kg', rest: 45, note: 'Full range — all the way up and down. Slow tempo.' },
    ]
  },
  {
    label: 'Day 3', title: 'Upper B', sub: 'Back & Shoulder Heavy',
    warmup: 'Band pull-aparts × 20, face pulls × 15, lat stretch 30s each side',
    exercises: [
      { name: 'Bent-over barbell row', sets: 4, reps: '6–8', weight: '30–35kg', rest: 120, note: 'Hinge to ~45°, row to lower chest. Heaviest back compound of the week.' },
      { name: 'Dumbbell bench press', sets: 3, reps: '8–10', weight: '12–14kg DBs', rest: 90, note: 'Different angle to barbell — hits chest fibres differently.' },
      { name: 'Lateral raise', sets: 4, reps: '12–15', weight: '4–5kg DBs', rest: 60, note: 'Raise to shoulder height only. Light weight, strict form.' },
      { name: 'EZ bar curl', sets: 3, reps: '8–10', weight: '15–17kg bar', rest: 60, note: 'Heavier curl variation. No swinging.' },
      { name: 'Overhead tricep extension', sets: 3, reps: '10–12', weight: '10–12kg DB', rest: 60, note: 'One heavy DB, both hands. Long head stretch = arm size.' },
    ]
  },
  {
    label: 'Day 4', title: 'Lower B', sub: 'Hinge & Glute Focus',
    warmup: 'Hip circles × 20, glute bridges × 20, light RDL × 10',
    exercises: [
      { name: 'Conventional deadlift', sets: 4, reps: '5–6', weight: '40–45kg', rest: 180, note: 'Heaviest lift of the week. Full hip extension at top, controlled descent.' },
      { name: 'Bulgarian split squat', sets: 3, reps: '8–10 each', weight: 'BW or 5kg DBs', rest: 90, note: 'Rear foot elevated on bench. Key for single-leg strength and glute size.' },
      { name: 'Leg curl', sets: 3, reps: '10–12', weight: 'Medium', rest: 60, note: 'Hamstring isolation. Curl all the way to your glute.' },
      { name: 'Hip thrust', sets: 4, reps: '10–12', weight: '20–30kg on lap', rest: 90, note: 'Back on bench, bar across hips. Full glute squeeze at top.' },
      { name: 'Plank', sets: 3, reps: '30–45 sec', weight: 'Bodyweight', rest: 45, note: 'Core stability to protect your lower back under heavier loads.' },
    ]
  }
];

const MEALS = [
  { name: 'Breakfast', desc: '3 eggs + toast + glass of milk', protein: '~35g protein' },
  { name: 'Morning snack', desc: 'Greek yoghurt + banana', protein: '~15g protein' },
  { name: 'Lunch', desc: 'Chicken + rice + veggies', protein: '~45g protein' },
  { name: 'Afternoon snack', desc: 'Protein shake + fruit', protein: '~30g protein' },
  { name: 'Dinner', desc: 'Beef/fish + potatoes + greens', protein: '~40g protein' },
];

// ── STATE ────────────────────────────────────────────────────────────────────
let state = {
  currentDay: 0,
  durationMins: 60,
  setsDone: {},      // key: `${dayIdx}-${exIdx}-${setIdx}`
  timers: {},        // key: `${dayIdx}-${exIdx}`
  weightLog: [],     // [{date, weight}]
  workoutLog: [],    // [{date, dayLabel, duration, setsCompleted}]
  mealChecks: {},    // key: `${todayStr}-${mealIdx}`
};

// ── STORAGE ──────────────────────────────────────────────────────────────────
function save() {
  const toSave = { weightLog: state.weightLog, workoutLog: state.workoutLog };
  try { localStorage.setItem('ironlog', JSON.stringify(toSave)); } catch(e){}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('ironlog') || '{}');
    if (d.weightLog) state.weightLog = d.weightLog;
    if (d.workoutLog) state.workoutLog = d.workoutLog;
  } catch(e){}
}

// ── GREETING ─────────────────────────────────────────────────────────────────
function setGreeting() {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = g;
}

// ── DURATION ─────────────────────────────────────────────────────────────────
function setDuration(mins) {
  state.durationMins = mins;
  document.querySelectorAll('.dur-btn').forEach(b => {
    b.classList.toggle('active', +b.dataset.mins === mins);
  });
  renderWorkoutArea();
}

// ── EXERCISES TO SHOW (time-based) ───────────────────────────────────────────
function getExercisesForDuration(dayIdx, mins) {
  const day = DAYS[dayIdx];
  const warmupMins = 5;
  const cooldownMins = 3;
  const available = mins - warmupMins - cooldownMins;
  // ~3.5 min per set (45s work + ~2.5min rest average)
  const maxSets = Math.floor(available / 3.5);
  let total = 0;
  const included = [];
  for (const ex of day.exercises) {
    if (total + ex.sets <= maxSets) {
      included.push(ex);
      total += ex.sets;
    } else {
      // partial: include with reduced sets if at least 2
      const remaining = maxSets - total;
      if (remaining >= 2) {
        included.push({ ...ex, sets: remaining });
        total += remaining;
      }
      break;
    }
  }
  const skipped = day.exercises.slice(included.length);
  return { included, skipped };
}

// ── WORKOUT AREA ─────────────────────────────────────────────────────────────
function renderWorkoutArea() {
  const area = document.getElementById('workoutArea');
  const { included, skipped } = getExercisesForDuration(state.currentDay, state.durationMins);
  const day = DAYS[state.currentDay];

  let total = included.reduce((a, e) => a + e.sets, 0);
  let done = 0;
  included.forEach((ex, ei) => {
    for (let s = 0; s < ex.sets; s++) {
      if (state.setsDone[`${state.currentDay}-${ei}-${s}`]) done++;
    }
  });
  const pct = total ? Math.round((done / total) * 100) : 0;

  let html = `
    <div class="workout-progress">
      <div class="progress-label"><span>Progress</span><strong>${done}/${total} sets</strong></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="warmup-banner"><strong>Warm-up:</strong> ${day.warmup}</div>`;

  if (skipped.length) {
    const names = skipped.map(e => e.name).join(', ');
    html += `<div class="skipped-note">⏱ For ${state.durationMins} min, skipping: <strong>${names}</strong>. Increase time to include them.</div>`;
  }

  included.forEach((ex, ei) => {
    const allDone = Array.from({length: ex.sets}, (_,s) => state.setsDone[`${state.currentDay}-${ei}-${s}`]).every(Boolean);
    const mRest = Math.floor(ex.rest / 60), sRest = ex.rest % 60;
    const timeStr = mRest + ':' + String(sRest).padStart(2,'0');
    const timerKey = `${state.currentDay}-${ei}`;
    const isRunning = !!state.timers[timerKey];

    html += `<div class="ex-card${allDone ? ' all-done' : ''}" id="excard-${ei}">
      <div class="ex-card-header">
        <div class="ex-card-name">${ex.name}</div>
        <div class="ex-badge">${ex.sets} × ${ex.reps}</div>
      </div>
      <div class="ex-card-body">
        <div class="ex-weight-row"><span class="ex-weight">${ex.weight}</span></div>
        <div class="ex-note">${ex.note}</div>
        <div class="sets-row">`;
    for (let s = 0; s < ex.sets; s++) {
      const isDone = state.setsDone[`${state.currentDay}-${ei}-${s}`];
      html += `<div class="set-box${isDone?' done':''}" onclick="toggleSet(${ei},${s})">
        ${isDone ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : (s+1)}
      </div>`;
    }
    html += `</div>
        <div class="rest-row">
          <button class="rest-btn${isRunning?' running':''}" id="rest-btn-${ei}" onclick="toggleTimer(${ei},${ex.rest})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${isRunning ? 'Pause rest' : 'Start rest'}
          </button>
          <span class="timer-text${isRunning?' running':''}" id="timer-${ei}">${isRunning ? formatTime(state.timers[timerKey].remaining) : timeStr}</span>
        </div>
      </div>
    </div>`;
  });

  // Complete button
  if (pct === 100) {
    html += `<button class="modal-save" style="width:100%;margin-top:0.5rem;font-size:16px;padding:16px" onclick="completeWorkout()">Complete workout 🏁</button>`;
  }

  area.innerHTML = html;
}

function toggleSet(exIdx, setIdx) {
  const key = `${state.currentDay}-${exIdx}-${setIdx}`;
  state.setsDone[key] = !state.setsDone[key];
  renderWorkoutArea();
  renderDayGrid();
}

// ── TIMERS ───────────────────────────────────────────────────────────────────
function formatTime(secs) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return m + ':' + String(s).padStart(2,'0');
}

function toggleTimer(exIdx, restSecs) {
  const key = `${state.currentDay}-${exIdx}`;
  if (state.timers[key]) {
    clearInterval(state.timers[key].interval);
    delete state.timers[key];
    updateTimerEl(exIdx, restSecs, false);
    return;
  }
  let remaining = restSecs;
  const interval = setInterval(() => {
    remaining--;
    state.timers[key].remaining = remaining;
    updateTimerEl(exIdx, remaining, true);
    if (remaining <= 0) {
      clearInterval(interval);
      delete state.timers[key];
      updateTimerEl(exIdx, restSecs, false);
      // vibrate
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, 1000);
  state.timers[key] = { interval, remaining };
  updateTimerEl(exIdx, remaining, true);
}

function updateTimerEl(exIdx, secs, running) {
  const btn = document.getElementById(`rest-btn-${exIdx}`);
  const disp = document.getElementById(`timer-${exIdx}`);
  if (!btn || !disp) return;
  disp.textContent = formatTime(secs);
  disp.className = 'timer-text' + (running ? ' running' : '');
  btn.className = 'rest-btn' + (running ? ' running' : '');
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${running ? 'Pause rest' : 'Start rest'}`;
}

// ── DAY GRID ─────────────────────────────────────────────────────────────────
function renderDayGrid() {
  const grid = document.getElementById('dayGrid');
  grid.innerHTML = DAYS.map((d, i) => {
    const setsInDay = d.exercises.reduce((a, e) => a + e.sets, 0);
    const doneSets = Object.keys(state.setsDone).filter(k => k.startsWith(`${i}-`) && state.setsDone[k]).length;
    const isComplete = doneSets >= setsInDay && doneSets > 0;
    return `<div class="day-card${i === state.currentDay ? ' active' : ''}" onclick="selectDay(${i})">
      <div class="day-card-num">0${i+1}</div>
      <div class="day-card-title">${d.title}</div>
      <div class="day-card-sub">${d.sub}</div>
      ${isComplete ? '<span class="day-card-done">✓ Done</span>' : ''}
    </div>`;
  }).join('');
}

function selectDay(i) {
  // clear timers
  Object.values(state.timers).forEach(t => clearInterval(t.interval));
  state.timers = {};
  state.currentDay = i;
  renderDayGrid();
  renderWorkoutArea();
}

// ── COMPLETE WORKOUT ─────────────────────────────────────────────────────────
function completeWorkout() {
  const day = DAYS[state.currentDay];
  const { included } = getExercisesForDuration(state.currentDay, state.durationMins);
  const totalSets = included.reduce((a, e) => a + e.sets, 0);
  const entry = {
    date: new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' }),
    dayLabel: day.label + ' — ' + day.title,
    duration: state.durationMins,
    setsCompleted: totalSets,
  };
  state.workoutLog.unshift(entry);
  save();
  document.getElementById('doneStats').innerHTML = `${entry.dayLabel}<br>${state.durationMins} min · ${totalSets} sets completed`;
  document.getElementById('doneModal').classList.add('open');
}

function closeDoneModal() {
  document.getElementById('doneModal').classList.remove('open');
  renderWorkoutLog();
}

// ── WEIGHT LOG ───────────────────────────────────────────────────────────────
function openWeightModal() {
  const now = new Date();
  document.getElementById('modalDate').textContent = now.toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('weightInput').value = '';
  document.getElementById('weightModal').classList.add('open');
  setTimeout(() => document.getElementById('weightInput').focus(), 100);
}
function closeWeightModal() { document.getElementById('weightModal').classList.remove('open'); }

function saveWeight() {
  const val = parseFloat(document.getElementById('weightInput').value);
  if (!val || val < 20 || val > 300) return;
  const entry = {
    date: new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' }),
    dateMs: Date.now(),
    weight: val,
  };
  state.weightLog.push(entry);
  state.weightLog.sort((a, b) => a.dateMs - b.dateMs);
  // update header chip
  document.getElementById('headerWeight').textContent = val.toFixed(1);
  save();
  closeWeightModal();
  renderWeightLog();
  drawChart();
}

function deleteWeight(idx) {
  state.weightLog.splice(idx, 1);
  save();
  renderWeightLog();
  drawChart();
}

function renderWeightLog() {
  const list = document.getElementById('weightLogList');
  if (!state.weightLog.length) {
    list.innerHTML = '<div class="log-entry"><span class="log-entry-label" style="color:var(--text3)">No weight entries yet</span></div>';
    return;
  }
  list.innerHTML = [...state.weightLog].reverse().slice(0, 10).map((e, i) => {
    const realIdx = state.weightLog.length - 1 - i;
    return `<div class="log-entry">
      <div><div class="log-entry-label">${e.date}</div></div>
      <div style="display:flex;align-items:center;gap:12px">
        <span><span class="log-entry-val">${e.weight.toFixed(1)}</span><span class="log-entry-unit"> kg</span></span>
        <button class="delete-log" onclick="deleteWeight(${realIdx})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');
}

function renderWorkoutLog() {
  const list = document.getElementById('workoutLogList');
  if (!state.workoutLog.length) {
    list.innerHTML = '<div class="log-entry"><span class="log-entry-label" style="color:var(--text3)">No workouts logged yet</span></div>';
    return;
  }
  list.innerHTML = state.workoutLog.slice(0, 8).map(e =>
    `<div class="log-entry">
      <div><div class="log-entry-label">${e.date}</div><div style="font-size:12px;color:var(--text3);margin-top:2px">${e.dayLabel}</div></div>
      <div style="text-align:right"><span class="log-entry-val">${e.duration}</span><span class="log-entry-unit">min</span><br><span style="font-size:11px;color:var(--text3)">${e.setsCompleted} sets</span></div>
    </div>`
  ).join('');
}

// ── CHART ────────────────────────────────────────────────────────────────────
let chartInstance = null;
function drawChart() {
  const canvas = document.getElementById('weightChart');
  const noData = document.getElementById('noChartData');
  if (!state.weightLog.length) {
    canvas.style.display = 'none';
    noData.style.display = 'block';
    return;
  }
  canvas.style.display = 'block';
  noData.style.display = 'none';
  const labels = state.weightLog.map(e => e.date);
  const data = state.weightLog.map(e => e.weight);
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#c8ff4a',
        backgroundColor: 'rgba(200,255,74,0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#c8ff4a',
        pointRadius: 4,
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#5a5a6a', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#5a5a6a', font: { size: 11 }, callback: v => v + 'kg' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

// ── NUTRITION ────────────────────────────────────────────────────────────────
function renderNutrition() {
  const grid = document.getElementById('nutritionGrid');
  const targets = [
    { label: 'Calories', val: '2,500', unit: 'kcal/day', pct: 100 },
    { label: 'Protein', val: '140', unit: 'grams/day', pct: 100 },
    { label: 'Carbs', val: '300', unit: 'grams/day', pct: 100 },
    { label: 'Fats', val: '80', unit: 'grams/day', pct: 100 },
  ];
  grid.innerHTML = targets.map(t => `
    <div class="nutr-card">
      <div class="nutr-label">${t.label}</div>
      <div class="nutr-val">${t.val}</div>
      <div class="nutr-unit">${t.unit}</div>
      <div class="nutr-bar-track"><div class="nutr-bar-fill" style="width:${t.pct}%"></div></div>
    </div>`).join('');

  const today = new Date().toDateString();
  const checklist = document.getElementById('mealChecklist');
  checklist.innerHTML = MEALS.map((m, i) => {
    const key = `${today}-${i}`;
    const checked = state.mealChecks[key];
    return `<div class="meal-item${checked?' checked':''}" onclick="toggleMeal('${today}',${i})">
      <div class="meal-checkbox">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="meal-text">
        <div class="meal-name">${m.name}</div>
        <div class="meal-protein">${m.desc} · ${m.protein}</div>
      </div>
    </div>`;
  }).join('');
}

function toggleMeal(today, idx) {
  const key = `${today}-${idx}`;
  state.mealChecks[key] = !state.mealChecks[key];
  renderNutrition();
}

// ── PAGES ────────────────────────────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  if (page === 'log') { renderWeightLog(); renderWorkoutLog(); drawChart(); }
  if (page === 'nutrition') renderNutrition();
}

// ── MODAL UTILS ───────────────────────────────────────────────────────────────
function closeModal(e) {
  if (e.target.classList.contains('modal-overlay')) {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  }
}

// ── PWA INSTALL ───────────────────────────────────────────────────────────────
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('installBanner');
  if (banner) banner.classList.add('show');
});

// ── INIT ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  load();
  setGreeting();
  renderDayGrid();
  renderWorkoutArea();

  // latest weight in header
  if (state.weightLog.length) {
    const last = state.weightLog[state.weightLog.length - 1];
    document.getElementById('headerWeight').textContent = last.weight.toFixed(1);
  }
});

// service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// load Chart.js
const chartScript = document.createElement('script');
chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
document.head.appendChild(chartScript);
