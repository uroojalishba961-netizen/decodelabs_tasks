# Signup Form — Form Design & Validation

DecodeLabs Frontend Development — Project 4

## What it does

A signup form (name, email, password, confirm password) with full
client-side validation:

- Semantic HTML form with proper `<label>`s and `required` intent
- `event.preventDefault()` stops the default page-refresh on submit
- Regex-based validation:
  - Email — basic syntax check (`text@domain.tld`)
  - Password — must be 8+ characters with an uppercase letter,
    lowercase letter, number, and special character
  - Confirm password — cross-field match check
- Live password requirement checklist that updates as you type
- Inline error messages linked to their inputs via `aria-describedby`
  and `aria-invalid`, so screen readers announce exactly what's wrong
- A `aria-live="polite"` status region announces the overall submit
  result without interrupting typing
- On a fully valid submission, an "Approved Payload" panel renders
  the data as JSON (password masked) — this stays in the browser only

## Files

- `index.html` — form structure
- `style.css` — styling
- `script.js` — validation logic and DOM updates

## Running it

Just open `index.html` in a browser, or serve the folder with
VS Code's Live Server extension.
