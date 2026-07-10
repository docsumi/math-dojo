// ---------- helpers ----------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function wireSegmented(container, onChange) {
  $all('button', container).forEach(btn => {
    btn.addEventListener('click', () => {
      $all('button', container).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onChange(btn.dataset.val);
    });
  });
}

function flashFeedback(el, good, text) {
  el.textContent = text;
  el.classList.remove('good', 'bad');
  el.classList.add(good ? 'good' : 'bad');
}

// ---------- navigation ----------
function showScreen(name) {
  $all('.screen').forEach(s => s.classList.remove('active'));
  $('#screen-' + name).classList.add('active');
}

$all('.mode-card').forEach(card => {
  card.addEventListener('click', () => {
    const mode = card.dataset.mode;
    showScreen(mode);
    if (mode === 'mental') nextMentalProblem();
    if (mode === 'finger') nextFingerTarget();
    if (mode === 'soroban') nextSorobanTarget();
    learnState[mode].index = 0;
    setSectionTab(mode, 'learn');
  });
});
$all('[data-back]').forEach(btn => btn.addEventListener('click', () => {
  Object.keys(learnState).forEach(stopDemo);
  showScreen('home');
}));

// =====================================================
// MENTAL MATH
// =====================================================
const mental = { op: 'add', level: 'easy', streak: 0, problem: null };

wireSegmented($('#mental-op'), val => { mental.op = val; nextMentalProblem(); });
wireSegmented($('#mental-level'), val => { mental.level = val; nextMentalProblem(); });

function mentalRange(level, op) {
  if (op === 'mul') {
    if (level === 'easy') return { min: 1, max: 5 };
    if (level === 'medium') return { min: 1, max: 10 };
    return { min: 2, max: 12 };
  }
  if (level === 'easy') return { min: 1, max: 10 };
  if (level === 'medium') return { min: 1, max: 50 };
  return { min: 10, max: 100 };
}

function mentalTip(op, a, b) {
  if (op === 'add') {
    if ((a % 10) + (b % 10) >= 10) {
      const toTen = 10 - (a % 10);
      const rem = b - toTen;
      return `Tip: ${a} + ${toTen} = ${a + toTen}, then + ${rem} more = ${a + b}.`;
    }
    return 'Tip: add the tens, then the ones.';
  }
  if (op === 'sub') {
    return `Tip: count up from ${b} to ${a} instead of subtracting straight away.`;
  }
  if (b === 2) return 'Tip: ×2 just means double it.';
  if (b === 4) return 'Tip: ×4 = double it, then double again.';
  if (b === 5) return 'Tip: ×5 = ×10, then take half.';
  if (b === 10) return 'Tip: ×10 just adds a zero.';
  if (b === 9) return `Tip: ×9 = ×10, then subtract ${a}.`;
  const half1 = Math.floor(b / 2), half2 = Math.ceil(b / 2);
  return `Tip: try ${a} × ${b} = (${a} × ${half1}) + (${a} × ${half2}).`;
}

function nextMentalProblem() {
  const op = mental.op === 'mix' ? ['add', 'sub', 'mul'][randInt(0, 2)] : mental.op;
  const r = mentalRange(mental.level, op);
  let a = randInt(r.min, r.max), b = randInt(r.min, r.max), answer, text, sym;
  if (op === 'add') { answer = a + b; sym = '+'; }
  else if (op === 'sub') { if (b > a) [a, b] = [b, a]; answer = a - b; sym = '−'; }
  else { answer = a * b; sym = '×'; }
  text = `${a} ${sym} ${b}`;
  mental.problem = { op, a, b, answer };
  $('#mental-problem').textContent = text;
  $('#mental-answer').value = '';
  $('#mental-feedback').textContent = '';
  $('#mental-feedback').className = 'feedback';
  $('#mental-tip').textContent = '';
  $('#mental-answer').focus();
}

$('#mental-form').addEventListener('submit', e => {
  e.preventDefault();
  const val = parseInt($('#mental-answer').value, 10);
  const p = mental.problem;
  if (val === p.answer) {
    mental.streak++;
    flashFeedback($('#mental-feedback'), true, 'Correct!');
  } else {
    mental.streak = 0;
    flashFeedback($('#mental-feedback'), false, `Not quite — it's ${p.answer}.`);
  }
  $('#mental-streak').textContent = mental.streak;
  $('#mental-tip').textContent = mentalTip(p.op, p.a, p.b);
  setTimeout(nextMentalProblem, 1300);
});

// =====================================================
// FINGER MATH
// =====================================================
const finger = {
  level: 'easy', streak: 0, target: 0,
  right: [false, false, false, false, false],
  left: [false, false, false, false, false],
};

wireSegmented($('#finger-level'), val => { finger.level = val; nextFingerTarget(); });

function fingerValue(side) {
  const arr = finger[side];
  const thumbVal = side === 'right' ? 5 : 50;
  const fingerVal = side === 'right' ? 1 : 10;
  let total = arr[0] ? thumbVal : 0;
  for (let i = 1; i < 5; i++) if (arr[i]) total += fingerVal;
  return total;
}
function fingerTotal() {
  return fingerValue('right') + (finger.level === 'hard' ? fingerValue('left') : 0);
}

// Shared by the interactive practice hand and the read-only Learn demo hand.
function buildFingerEl(side, i, active) {
  const f = document.createElement('div');
  f.className = 'finger' + (i === 0 ? ' thumb' : '') + (active ? ' up' : '');
  f.dataset.i = i;
  f.textContent = i === 0 ? (side === 'right' ? '5' : '50') : (side === 'right' ? '1' : '10');
  return f;
}
function buildHandInto(el, side, arr, onToggle) {
  el.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const f = buildFingerEl(side, i, arr[i]);
    if (onToggle) {
      f.style.cursor = 'pointer';
      f.addEventListener('click', () => onToggle(i));
    }
    el.appendChild(f);
  }
}

function renderHand(side) {
  buildHandInto($('#hand-' + side), side, finger[side], i => {
    finger[side][i] = !finger[side][i];
    renderHand(side);
    $('#finger-count').textContent = fingerTotal();
  });
}

function nextFingerTarget() {
  finger.right = [false, false, false, false, false];
  finger.left = [false, false, false, false, false];
  finger.target = finger.level === 'easy' ? randInt(0, 9) : randInt(0, 99);
  $('#finger-target').textContent = finger.target;
  $('#hand-left').hidden = finger.level !== 'hard';
  $('#finger-explainer').innerHTML = finger.level === 'hard'
    ? 'Right hand (ones): thumb = <strong>5</strong>, fingers = <strong>1</strong> each. Left hand (tens): thumb = <strong>50</strong>, fingers = <strong>10</strong> each.'
    : 'Right hand: thumb = <strong>5</strong>, each finger = <strong>1</strong>.';
  renderHand('right');
  renderHand('left');
  $('#finger-count').textContent = '0';
  $('#finger-feedback').textContent = '';
  $('#finger-feedback').className = 'feedback';
}

$('#finger-check').addEventListener('click', () => {
  const total = fingerTotal();
  if (total === finger.target) {
    finger.streak++;
    flashFeedback($('#finger-feedback'), true, 'Correct!');
  } else {
    finger.streak = 0;
    flashFeedback($('#finger-feedback'), false, `You showed ${total} — the target was ${finger.target}.`);
  }
  $('#finger-streak').textContent = finger.streak;
  setTimeout(nextFingerTarget, 1300);
});

// =====================================================
// SOROBAN (JAPANESE ABACUS)
// =====================================================
const soroban = {
  level: 'easy', sub: 'represent', streak: 0, target: 0,
  rods: [], // each: { heaven: bool, earth: 0-4 }
  anzan: { sequence: [], answer: 0, step: 0 },
};

wireSegmented($('#soroban-level'), val => { soroban.level = val; onSorobanConfigChange(); });
wireSegmented($('#soroban-sub'), val => { soroban.sub = val; onSorobanConfigChange(); });

function onSorobanConfigChange() {
  const isAnzan = soroban.sub === 'anzan';
  $('#soroban-represent-stage').hidden = isAnzan;
  $('#soroban-anzan-stage').hidden = !isAnzan;
  if (isAnzan) resetAnzan(); else nextSorobanTarget();
}

function numRodsForLevel(level) {
  return level === 'easy' ? 1 : level === 'medium' ? 2 : 3;
}
const RANK_LABELS = ['Hundreds', 'Tens', 'Ones'];

function rodValue(rod) { return (rod.heaven ? 5 : 0) + rod.earth; }
function sorobanTotal() {
  const n = soroban.rods.length;
  let total = 0;
  soroban.rods.forEach((rod, i) => {
    const place = Math.pow(10, n - 1 - i);
    total += rodValue(rod) * place;
  });
  return total;
}

const HEAVEN_OFF = 6, HEAVEN_ON = 50;
const EARTH_ACTIVE_TOPS = [82, 107, 132, 157];
const EARTH_INACTIVE_TOPS = [123, 148, 173, 198];

// Shared by the interactive practice abacus and the read-only Learn demo rods.
function buildRodInto(rodEl, rod, opts) {
  rodEl.innerHTML = '';
  const bar = document.createElement('div');
  bar.className = 'rod-bar';
  rodEl.appendChild(bar);

  const heaven = document.createElement('div');
  heaven.className = 'bead heaven' + (rod.heaven ? ' active' : '');
  heaven.style.top = (rod.heaven ? HEAVEN_ON : HEAVEN_OFF) + 'px';
  if (opts.onHeaven) {
    heaven.style.cursor = 'pointer';
    heaven.addEventListener('click', opts.onHeaven);
  }
  rodEl.appendChild(heaven);

  for (let i = 0; i < rod.earth; i++) {
    const bead = document.createElement('div');
    bead.className = 'bead earth active';
    bead.style.top = EARTH_ACTIVE_TOPS[i] + 'px';
    const newCount = i; // clicking an active bead pushes it (and below) back down
    if (opts.onEarth) {
      bead.style.cursor = 'pointer';
      bead.addEventListener('click', () => opts.onEarth(newCount));
    }
    rodEl.appendChild(bead);
  }
  for (let i = rod.earth; i < 4; i++) {
    const bead = document.createElement('div');
    bead.className = 'bead earth';
    bead.style.top = EARTH_INACTIVE_TOPS[i] + 'px';
    const newCount = i + 1; // clicking an inactive bead pulls it (and above) up
    if (opts.onEarth) {
      bead.style.cursor = 'pointer';
      bead.addEventListener('click', () => opts.onEarth(newCount));
    }
    rodEl.appendChild(bead);
  }

  if (opts.label) {
    const label = document.createElement('div');
    label.className = 'rod-label';
    label.textContent = opts.label;
    rodEl.appendChild(label);
  }
}

function renderAbacus() {
  const wrap = $('#abacus');
  wrap.innerHTML = '';
  const n = soroban.rods.length;
  soroban.rods.forEach((rod, idx) => {
    const rodEl = document.createElement('div');
    rodEl.className = 'rod';
    buildRodInto(rodEl, rod, {
      label: RANK_LABELS[RANK_LABELS.length - n + idx],
      onHeaven: () => { rod.heaven = !rod.heaven; renderAbacus(); },
      onEarth: newCount => { rod.earth = newCount; renderAbacus(); },
    });
    wrap.appendChild(rodEl);
  });
  $('#soroban-count').textContent = sorobanTotal();
}

function nextSorobanTarget() {
  const n = numRodsForLevel(soroban.level);
  soroban.rods = Array.from({ length: n }, () => ({ heaven: false, earth: 0 }));
  const max = Math.pow(10, n) - 1;
  soroban.target = randInt(0, max);
  $('#soroban-target').textContent = soroban.target;
  renderAbacus();
  $('#soroban-feedback').textContent = '';
  $('#soroban-feedback').className = 'feedback';
}

$('#soroban-check').addEventListener('click', () => {
  const total = sorobanTotal();
  if (total === soroban.target) {
    soroban.streak++;
    flashFeedback($('#soroban-feedback'), true, 'Correct!');
  } else {
    soroban.streak = 0;
    flashFeedback($('#soroban-feedback'), false, `The abacus shows ${total} — the target was ${soroban.target}.`);
  }
  $('#soroban-streak').textContent = soroban.streak;
  setTimeout(nextSorobanTarget, 1300);
});

// ---------- Anzan flash mode ----------
function anzanConfig(level) {
  if (level === 'easy') return { steps: 2, max: 5, allowSub: false, duration: 1400 };
  if (level === 'medium') return { steps: 3, max: 9, allowSub: true, duration: 1100 };
  return { steps: 5, max: 20, allowSub: true, duration: 900 };
}

function buildAnzanSequence(level) {
  const cfg = anzanConfig(level);
  let seq, total;
  do {
    seq = [];
    total = randInt(1, cfg.max);
    seq.push({ op: '+', val: total });
    for (let i = 1; i < cfg.steps; i++) {
      const isSub = cfg.allowSub && Math.random() < 0.5;
      const val = randInt(1, cfg.max);
      if (isSub) { seq.push({ op: '−', val }); total -= val; }
      else { seq.push({ op: '+', val }); total += val; }
    }
  } while (total < 0);
  return { seq, total };
}

function resetAnzan() {
  $('#anzan-flash').textContent = 'Ready?';
  $('#anzan-answer-wrap').hidden = true;
  $('#anzan-feedback').textContent = '';
  $('#anzan-feedback').className = 'feedback';
  $('#anzan-start').hidden = false;
  $('#anzan-start').textContent = 'Start';
}

$('#anzan-start').addEventListener('click', () => {
  const built = buildAnzanSequence(soroban.level);
  soroban.anzan.sequence = built.seq;
  soroban.anzan.answer = built.total;
  $('#anzan-start').hidden = true;
  $('#anzan-answer-wrap').hidden = true;
  playAnzanSequence(built.seq, anzanConfig(soroban.level).duration);
});

function playAnzanSequence(seq, duration) {
  const el = $('#anzan-flash');
  let i = 0;
  function step() {
    if (i >= seq.length) {
      el.textContent = '?';
      $('#anzan-answer-wrap').hidden = false;
      $('#anzan-answer').value = '';
      $('#anzan-answer').focus();
      return;
    }
    const s = seq[i];
    el.textContent = i === 0 ? String(s.val) : `${s.op} ${s.val}`;
    i++;
    setTimeout(() => {
      el.textContent = '···';
      setTimeout(step, 250);
    }, duration);
  }
  step();
}

$('#anzan-form').addEventListener('submit', e => {
  e.preventDefault();
  const val = parseInt($('#anzan-answer').value, 10);
  if (val === soroban.anzan.answer) {
    soroban.streak++;
    flashFeedback($('#anzan-feedback'), true, 'Correct!');
  } else {
    soroban.streak = 0;
    flashFeedback($('#anzan-feedback'), false, `Not quite — the total was ${soroban.anzan.answer}.`);
  }
  $('#soroban-streak').textContent = soroban.streak;
  $('#anzan-answer-wrap').hidden = true;
  setTimeout(resetAnzan, 1300);
});

// =====================================================
// LEARN — concept walkthroughs shown before Practice
// =====================================================

// ---------- section tabs (Learn / Practice) ----------
const learnState = {}; // mode -> { steps, index, demoTimer }

function stopDemo(mode) {
  if (learnState[mode] && learnState[mode].demoTimer) {
    clearInterval(learnState[mode].demoTimer);
    learnState[mode].demoTimer = null;
  }
}

function renderLearnStep(mode) {
  const st = learnState[mode];
  const step = st.steps[st.index];
  $(`#${mode}-learn-title`).textContent = step.title;
  $(`#${mode}-learn-body`).textContent = step.body;

  stopDemo(mode);
  const demoEl = $(`#${mode}-demo`);
  demoEl.innerHTML = '';
  if (step.demo) st.demoTimer = step.demo(demoEl);

  const dotsEl = $(`#${mode}-learn-dots`);
  dotsEl.innerHTML = '';
  st.steps.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'learn-dot' + (i === st.index ? ' active' : '');
    dotsEl.appendChild(d);
  });

  $(`#${mode}-learn-prev`).disabled = st.index === 0;
  $(`#${mode}-learn-next`).textContent = st.index === st.steps.length - 1 ? 'Start Practicing →' : 'Next →';
}

function initLearn(mode, steps) {
  learnState[mode] = { steps, index: 0, demoTimer: null };
  $(`#${mode}-learn-prev`).addEventListener('click', () => {
    const st = learnState[mode];
    if (st.index > 0) { st.index--; renderLearnStep(mode); }
  });
  $(`#${mode}-learn-next`).addEventListener('click', () => {
    const st = learnState[mode];
    if (st.index < st.steps.length - 1) { st.index++; renderLearnStep(mode); }
    else setSectionTab(mode, 'practice');
  });
}

function setSectionTab(mode, val) {
  $all('button', $(`#${mode}-section-tabs`)).forEach(b => b.classList.toggle('active', b.dataset.val === val));
  $(`#${mode}-learn-pane`).hidden = val !== 'learn';
  $(`#${mode}-practice-pane`).hidden = val !== 'practice';
  if (val === 'learn') renderLearnStep(mode);
  else stopDemo(mode);
}

// ---------- Learn demos ----------
// Every demo below is either a static illustration or a click-driven mini widget —
// nothing changes on its own, so the reader sets the pace with the Next/Back buttons
// (or by tapping, in the "try it yourself" steps).

function renderTenFrame(el, filledCount, newCount) {
  el.innerHTML = '';
  el.className = 'ten-frame';
  for (let i = 0; i < 10; i++) {
    const cell = document.createElement('div');
    const filled = i < filledCount;
    const isNew = filled && i >= filledCount - newCount;
    cell.className = 'cell' + (filled ? ' filled' : '') + (isNew ? ' new' : '');
    el.appendChild(cell);
  }
}

function renderDotGroup(el, count, pickCount) {
  el.innerHTML = '';
  el.className = 'dot-group';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot filled' + (i < pickCount ? ' pick' : '');
    el.appendChild(dot);
  }
}

function demoTenFrameIntro(el) {
  el.innerHTML = '<div class="ten-frame" id="tf-empty"></div>' +
    '<div class="demo-caption">An empty ten-frame has 10 spots, in two rows of five. Once every spot is filled, you have exactly ten.</div>';
  renderTenFrame($('#tf-empty', el), 0, 0);
}

function demoSetup8plus5(el) {
  el.innerHTML =
    '<div class="frame-row">' +
    '<div class="dot-col"><div class="ten-frame" id="tf-a"></div><div class="demo-sub-label">8, already in the frame</div></div>' +
    '<div class="dot-col"><div class="dot-group" id="dg-a"></div><div class="demo-sub-label">5, still to add</div></div>' +
    '</div>' +
    '<div class="demo-caption">We want to work out 8 + 5. The frame on the left already holds 8. Here come 5 more dots.</div>';
  renderTenFrame($('#tf-a', el), 8, 0);
  renderDotGroup($('#dg-a', el), 5, 0);
}

function demoSplitFive(el) {
  el.innerHTML =
    '<div class="frame-row">' +
    '<div class="dot-col"><div class="ten-frame" id="tf-b"></div><div class="demo-sub-label">8</div></div>' +
    '<div class="dot-col"><div class="dot-group" id="dg-b"></div><div class="demo-sub-label">gold ones fill the frame, the rest wait</div></div>' +
    '</div>' +
    '<div class="demo-caption">The frame only has room for 2 more. So split the 5 into 2 and 3 — the 2 gold dots will go into the frame.</div>';
  renderTenFrame($('#tf-b', el), 8, 0);
  renderDotGroup($('#dg-b', el), 5, 2);
}

function demoFillFrame(el) {
  el.innerHTML =
    '<div class="frame-row">' +
    '<div class="dot-col"><div class="ten-frame" id="tf-c"></div><div class="demo-sub-label">10 — completely full</div></div>' +
    '<div class="dot-col"><div class="dot-group" id="dg-c"></div><div class="demo-sub-label">3 left over</div></div>' +
    '</div>' +
    '<div class="demo-caption">8 + 2 = 10. The frame is full (the 2 gold dots just moved in), and 3 dots are still waiting outside it.</div>';
  renderTenFrame($('#tf-c', el), 10, 2);
  renderDotGroup($('#dg-c', el), 3, 0);
}

function demoAddLeftover(el) {
  el.innerHTML =
    '<div class="chips-row"><span class="chip">10</span><span class="chip-arrow">+</span><span class="chip">3</span><span class="chip-arrow">=</span><span class="chip">13</span></div>' +
    '<div class="demo-caption">Now just add the leftover 3 to the full frame of 10. 10 + 3 = 13 — so 8 + 5 = 13.</div>';
}

function demoDoublingRecipe(el) {
  el.innerHTML =
    '<div class="chips-row"><span class="chip">6</span><span class="chip-arrow">double</span><span class="chip">12</span><span class="chip-arrow">double</span><span class="chip">24</span></div>' +
    '<div class="demo-caption">Doubling 6 gives 12. Doubling 12 gives 24. Two doubles in a row is exactly the same as multiplying by 4.</div>';
}

function demoSecondExample(el) {
  el.innerHTML =
    '<div class="chips-row"><span class="chip">7+6</span><span class="chip-arrow">split</span><span class="chip">7+3+3</span><span class="chip-arrow">make ten</span><span class="chip">10+3</span><span class="chip-arrow">=</span><span class="chip">13</span></div>' +
    '<div class="demo-caption">Same trick, different numbers: split 6 into 3 and 3, use the first 3 to make ten, then add what is left.</div>';
}

const FINGER_SEQUENCE = [
  [false, false, false, false, false],
  [false, true, false, false, false],
  [false, true, true, false, false],
  [false, true, true, true, false],
  [false, true, true, true, true],
  [true, false, false, false, false],
  [true, true, false, false, false],
  [true, true, true, false, false],
  [true, true, true, true, false],
  [true, true, true, true, true],
];

function demoFingerExplorer(el) {
  el.innerHTML =
    '<div class="hand demo-hand" id="fx-hand"></div>' +
    '<div class="demo-caption" id="fx-cap">This is 0</div>' +
    '<div class="try-it-label">Tap a number to see it on the hand</div>' +
    '<div class="demo-numbtns" id="fx-btns"></div>';
  const handEl = $('#fx-hand', el), capEl = $('#fx-cap', el), btnsEl = $('#fx-btns', el);
  function show(n) {
    buildHandInto(handEl, 'right', FINGER_SEQUENCE[n], null);
    capEl.textContent = 'This is ' + n;
    $all('button', btnsEl).forEach(b => b.classList.toggle('active', Number(b.textContent) === n));
  }
  for (let n = 0; n <= 9; n++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'demo-numbtn';
    b.textContent = String(n);
    b.addEventListener('click', () => show(n));
    btnsEl.appendChild(b);
  }
  show(0);
}

function demoThumbFive(el) {
  el.innerHTML = '<div class="hand demo-hand" id="tf5-hand"></div>' +
    '<div class="demo-caption">All fingers down, thumb up = 5</div>';
  buildHandInto($('#tf5-hand', el), 'right', FINGER_SEQUENCE[5], null);
}

function demoTwoHandsExample(el) {
  el.innerHTML =
    '<div class="hands-wrap">' +
    '<div class="dot-col"><div class="hand demo-hand" id="th-left"></div><div class="demo-sub-label">left hand = tens</div></div>' +
    '<div class="dot-col"><div class="hand demo-hand" id="th-right"></div><div class="demo-sub-label">right hand = ones</div></div>' +
    '</div>' +
    '<div class="demo-caption">Left thumb up = 5 tens (50). Right thumb + 3 fingers = 8 ones. Together: 58.</div>';
  buildHandInto($('#th-left', el), 'left', FINGER_SEQUENCE[5], null);
  buildHandInto($('#th-right', el), 'right', FINGER_SEQUENCE[8], null);
}

function demoHeavenCompare(el) {
  el.innerHTML =
    '<div class="mini-rod-row">' +
    '<div class="mini-rod-item"><div class="abacus demo-abacus"><div class="rod" id="hc-a"></div></div><div class="mini-rod-label">resting = 0</div></div>' +
    '<div class="mini-rod-item"><div class="abacus demo-abacus"><div class="rod" id="hc-b"></div></div><div class="mini-rod-label">pushed down = 5</div></div>' +
    '</div>' +
    '<div class="demo-caption">The heaven bead only has two positions: resting away from the bar is worth nothing, pushed down against the bar is worth 5.</div>';
  buildRodInto($('#hc-a', el), { heaven: false, earth: 0 }, {});
  buildRodInto($('#hc-b', el), { heaven: true, earth: 0 }, {});
}

function demoEarthCompare(el) {
  el.innerHTML = '<div class="mini-rod-row" id="ec-row"></div>' +
    '<div class="demo-caption">Each earth bead pushed up toward the bar adds exactly 1. Here they are counting 0 through 4.</div>';
  const row = $('#ec-row', el);
  for (let v = 0; v <= 4; v++) {
    const item = document.createElement('div');
    item.className = 'mini-rod-item';
    const rodWrap = document.createElement('div');
    rodWrap.className = 'abacus demo-abacus';
    const rodEl = document.createElement('div');
    rodEl.className = 'rod';
    rodWrap.appendChild(rodEl);
    const label = document.createElement('div');
    label.className = 'mini-rod-label';
    label.textContent = String(v);
    item.appendChild(rodWrap);
    item.appendChild(label);
    row.appendChild(item);
    buildRodInto(rodEl, { heaven: false, earth: v }, {});
  }
}

function demoRodExplorer(el) {
  el.innerHTML =
    '<div class="abacus demo-abacus"><div class="rod" id="rx-rod"></div></div>' +
    '<div class="demo-caption" id="rx-cap">Value: 0</div>' +
    '<div class="try-it-label">Tap the beads to try it yourself</div>';
  const rodEl = $('#rx-rod', el), capEl = $('#rx-cap', el);
  const rod = { heaven: false, earth: 0 };
  function render() {
    buildRodInto(rodEl, rod, {
      onHeaven: () => { rod.heaven = !rod.heaven; render(); },
      onEarth: newCount => { rod.earth = newCount; render(); },
    });
    capEl.textContent = 'Value: ' + ((rod.heaven ? 5 : 0) + rod.earth);
  }
  render();
}

// ---------- Learn step content ----------
const mentalLearnSteps = [
  {
    title: 'What is mental math?',
    body: 'Mental math means solving number problems in your head, using smart tricks instead of counting one by one. The tricks below work for any numbers, not just the examples shown — once you see the pattern, you can use it everywhere.',
    demo: null,
  },
  {
    title: 'Meet the ten-frame',
    body: 'Grown-ups use a simple picture called a ten-frame to make adding easier: a box with 10 spots, in two rows of five. Numbers are much easier to work with once you can see how close they are to a full ten.',
    demo: demoTenFrameIntro,
  },
  {
    title: 'Example: 8 + 5',
    body: 'Let us solve 8 + 5 using the ten-frame. Put 8 dots in the frame first — it still has 2 empty spots. Then we bring in the 5 that we are adding.',
    demo: demoSetup8plus5,
  },
  {
    title: 'Step 1: split the second number',
    body: 'The frame only has room for 2 more dots before it is full. So break the 5 apart into 2 and 3 — just enough to fill the frame, plus whatever is left over.',
    demo: demoSplitFive,
  },
  {
    title: 'Step 2: fill the frame',
    body: 'Move those 2 dots into the frame. Now it is completely full — that is 10 — and there are 3 dots left outside it. Filling the frame is the whole trick: it turns an awkward number into a clean ten.',
    demo: demoFillFrame,
  },
  {
    title: 'Step 3: add what is left',
    body: 'A full frame is 10. Add the 3 dots that were left over, and you get the answer. This is usually much faster than counting 8, 9, 10, 11, 12, 13 one by one.',
    demo: demoAddLeftover,
  },
  {
    title: 'Trick: double to multiply',
    body: 'Multiplying by 4 can feel hard, but it is really just doubling — twice in a row. Doubling a number means adding it to itself, which most people find much easier than multiplying.',
    demo: demoDoublingRecipe,
  },
  {
    title: 'One more example',
    body: 'The make-a-ten trick works the same way no matter which numbers you start with. Here it is again with 7 + 6, so you can see the same three steps: split, fill the frame, add the rest.',
    demo: demoSecondExample,
  },
  {
    title: 'Ready to practice',
    body: 'Try some problems yourself. If you get stuck: for adding, try to make a ten first. For multiplying by 4, just double the number twice.',
    demo: null,
  },
];

const fingerLearnSteps = [
  {
    title: 'Your hand is a calculator',
    body: 'Long before calculators existed, people counted on their hands. On your right hand, your thumb is worth 5, and each of your four fingers is worth 1. By choosing which fingers to raise, you can show any number from 0 to 9.',
    demo: null,
  },
  {
    title: 'Try it yourself',
    body: 'Tap any number below and watch which fingers go up. Try a few in a row — 3, then 7, then 9 — and notice the pattern each time.',
    demo: demoFingerExplorer,
  },
  {
    title: 'Why 5 uses the thumb',
    body: 'Once you count past 4, all four fingers are already up — there is no fifth finger to raise! So instead, put every finger back down and raise the thumb on its own. The thumb stands in for five fingers at once.',
    demo: demoThumbFive,
  },
  {
    title: 'Bigger numbers, two hands',
    body: 'One hand only reaches 9. For bigger numbers, your left hand counts tens instead of ones: its thumb is worth 50, and each of its fingers is worth 10. Here is 58, shown as 5 tens on the left hand and 8 ones on the right.',
    demo: demoTwoHandsExample,
  },
  {
    title: 'Ready to practice',
    body: 'Raise the fingers that add up to the target number, then check your answer. Remember: thumb is worth more than a finger on each hand, and the left hand always means tens.',
    demo: null,
  },
];

const sorobanLearnSteps = [
  {
    title: 'Meet the soroban',
    body: 'A soroban is a Japanese counting tool that people have used for hundreds of years, and it is still taught today because it makes numbers easy to see and move. It has rods, and each rod has beads that slide up and down. Every rod stands for one digit of a number: the rod on the right is the ones place, the next one is tens, then hundreds, and so on.',
    demo: null,
  },
  {
    title: 'The heaven bead = 5',
    body: 'Above the bar sits one bead, called the heaven bead, worth 5. It only has two positions. Compare the two rods below: on the left it is resting away from the bar and counts as nothing, on the right it has been pushed down against the bar and counts as 5.',
    demo: demoHeavenCompare,
  },
  {
    title: 'The earth beads = 1 each',
    body: 'Below the bar are four beads, called earth beads, worth 1 each. Push a bead up toward the bar to count it. The row below shows the same rod with 0, 1, 2, 3, and finally 4 earth beads pushed up.',
    demo: demoEarthCompare,
  },
  {
    title: 'Try it yourself',
    body: 'Now it is your turn. Tap the heaven bead to add or remove 5. Tap any earth bead to set how many are counted. Try to make the rod show 7, then try 3.',
    demo: demoRodExplorer,
  },
  {
    title: 'Anzan: math without looking',
    body: 'Once you know the bead positions so well that you do not need to look at them anymore, you can picture the abacus in your head instead. Advanced students add long strings of numbers this way, without ever touching a real abacus — that skill is called Anzan.',
    demo: null,
  },
  {
    title: 'Ready to practice',
    body: 'Try building numbers on the abacus, or test your speed with an Anzan flash round. If you get stuck, remember: heaven bead down means add 5, each earth bead up means add 1.',
    demo: null,
  },
];

initLearn('mental', mentalLearnSteps);
initLearn('finger', fingerLearnSteps);
initLearn('soroban', sorobanLearnSteps);

['mental', 'finger', 'soroban'].forEach(mode => {
  wireSegmented($(`#${mode}-section-tabs`), val => setSectionTab(mode, val));
});
