// ---- Element references ----
const form = document.getElementById('js-signup-form');
const inputs = document.querySelectorAll('.js-input');
const formStatus = document.getElementById('js-form-status');
const payloadSection = document.getElementById('js-payload');
const payloadBody = document.getElementById('js-payload-body');

const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const hintItems = document.querySelectorAll('.hint-list li');

// ---- Regex bank ----
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RULES = {
  length:  (v) => v.length >= 8,
  upper:   (v) => /[A-Z]/.test(v),
  lower:   (v) => /[a-z]/.test(v),
  number:  (v) => /[0-9]/.test(v),
  special: (v) => /[#?!@$%^&*-]/.test(v),
};

// ---- Individual field validators ----
// Each returns '' (valid) or an error message string.
const validators = {
  name(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Full name is required.';
    if (trimmed.length < 2) return 'Name must be at least 2 characters.';
    return '';
  },

  email(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Email address is required.';
    if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.';
    return '';
  },

  password(value) {
    if (value === '') return 'Password is required.';
    const failed = Object.entries(PASSWORD_RULES).find(([, test]) => !test(value));
    if (failed) return 'Password does not meet all requirements below.';
    return '';
  },

  'confirm-password'(value) {
    if (value === '') return 'Please confirm your password.';
    if (value !== passwordInput.value) return 'Passwords do not match.';
    return '';
  },
};

// ---- Output: apply validation result to a single field ----
function setFieldState(input, message) {
  const field = input.closest('.field');
  const errorEl = document.getElementById(`${input.id}-error`);

  const isValid = message === '';

  field.classList.toggle('is-valid', isValid);
  field.classList.toggle('is-invalid', !isValid);

  input.setAttribute('aria-invalid', isValid ? 'false' : 'true');
  errorEl.textContent = message;
}

function validateField(input) {
  const rule = input.dataset.rule;
  const message = validators[rule](input.value);
  setFieldState(input, message);
  return message === '';
}

// ---- Live password requirement checklist ----
function renderPasswordHints(value) {
  hintItems.forEach((li) => {
    const check = li.dataset.check;
    li.classList.toggle('is-met', PASSWORD_RULES[check](value));
  });
}

// ---- Wiring: validate as the user types / leaves a field ----
inputs.forEach((input) => {
  input.addEventListener('input', () => {
    // Password: keep the live checklist in sync on every keystroke
    if (input === passwordInput) {
      renderPasswordHints(input.value);
    }
    // Re-validate confirm-password live once it has content, so a fix
    // to the password field is reflected immediately.
    if (input === passwordInput && confirmInput.value !== '') {
      validateField(confirmInput);
    }
    // Clear stale error state while typing; full re-check happens on blur/submit.
    if (input.closest('.field').classList.contains('is-invalid')) {
      validateField(input);
    }
  });

  input.addEventListener('blur', () => validateField(input));
});

// ---- Submit: prevent the default refresh, validate everything ----
form.addEventListener('submit', (event) => {
  event.preventDefault();

  let firstInvalid = null;
  let allValid = true;

  inputs.forEach((input) => {
    const valid = validateField(input);
    if (!valid) {
      allValid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });

  if (!allValid) {
    formStatus.textContent = 'Please fix the highlighted fields before submitting.';
    formStatus.className = 'form-status is-error';
    payloadSection.hidden = true;
    firstInvalid.focus();
    return;
  }

  // All fields valid — package the payload (mirrors the deck's
  // "Approved Payload" -> JSON -> Backend API flow).
  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: '••••••••',
  };

  payloadBody.textContent = JSON.stringify(payload, null, 2);
  payloadSection.hidden = false;

  formStatus.textContent = 'All checks passed — form submitted successfully.';
  formStatus.className = 'form-status is-success';
});
