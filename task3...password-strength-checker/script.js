// ---- Element references (Sensory Receptors) ----
const input = document.getElementById('js-password-input');
const toggleBtn = document.querySelector('.js-toggle-visibility');
const segments = document.querySelectorAll('#js-meter .segment');
const statusLabel = document.getElementById('js-status-label');
const statusTag = document.getElementById('js-status-tag');
const checklist = document.getElementById('js-checklist');

const STRENGTH = [
  { label: 'Enter a password', tag: '—',      color: 'var(--bar-color)' },
  { label: 'Weak',             tag: 'weak',   color: 'var(--weak)'      },
  { label: 'Fair',             tag: 'fair',   color: 'var(--medium)'    },
  { label: 'Good',             tag: 'good',   color: 'var(--medium)'    },
  { label: 'Strong',           tag: 'strong', color: 'var(--strong)'    },
];

// ---- Process: evaluate rules against current state ----
function evaluateRules(value) {
  return {
    length:  value.length >= 8,
    upper:   /[A-Z]/.test(value),
    number:  /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };
}

// ---- Output: mutate the DOM to reflect state ----
function renderChecklist(rules) {
  checklist.querySelectorAll('li').forEach((li) => {
    const rule = li.dataset.rule;
    li.classList.toggle('is-met', rules[rule]);
  });
}

function renderMeter(score, value) {
  segments.forEach((seg, i) => {
    const level = STRENGTH[score] || STRENGTH[0];
    seg.style.background = (i < score && value.length > 0) ? level.color : 'var(--bar-color)';
  });
}

function renderStatus(score) {
  const level = STRENGTH[score] || STRENGTH[0];
  statusLabel.textContent = level.label;
  statusLabel.style.color = score === 0 ? 'var(--muted)' : level.color;
  statusTag.textContent = level.tag;
  statusTag.style.borderColor = score === 0 ? 'var(--panel-border)' : level.color;
  statusTag.style.color = score === 0 ? 'var(--muted)' : level.color;
}

function handleInput() {
  const value = input.value;
  const rules = evaluateRules(value);
  const score = Object.values(rules).filter(Boolean).length; // 0-4

  renderChecklist(rules);
  renderMeter(value.length === 0 ? 0 : score, value);
  renderStatus(value.length === 0 ? 0 : score);
}

// ---- Show / Hide toggle (Input -> Process -> Output loop) ----
function toggleVisibility() {
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
  toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  input.focus();
}

// ---- Wiring the nerves: event listeners ----
input.addEventListener('input', handleInput);
toggleBtn.addEventListener('click', toggleVisibility);

// Initial paint
handleInput();
