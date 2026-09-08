function getSurname(fullName) {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  return parts[parts.length - 1];
}

function ensureSignaturePad(target) {
  if (target.dataset.padReady === '1') return;
  target.dataset.padReady = '1';
  target.classList.add('signature-pad');
  target.setAttribute('tabindex', '0');
  target.setAttribute('role', 'button');
  target.setAttribute('aria-label', 'Klikněte pro podpis');

  if (!target.querySelector('.signature-hint')) {
    const hint = document.createElement('span');
    hint.className = 'signature-hint no-print';
    hint.textContent = 'Klikněte pro podpis';
    target.appendChild(hint);
  }

  if (!target.querySelector('.signature-text')) {
    const text = document.createElement('span');
    text.className = 'signature-text';
    target.insertBefore(text, target.firstChild);
  }
}

function renderSignaturePad(target) {
  const textEl = target.querySelector('.signature-text');
  const hintEl = target.querySelector('.signature-hint');
  if (!textEl) return;

  const signed = target.classList.contains('signed');
  textEl.textContent = signed ? (target.dataset.signatureText || '') : '';

  if (hintEl) {
    hintEl.hidden = signed;
  }
}

function signPad(input, target) {
  const surname = getSurname(input.value);
  if (!surname) return;

  ensureSignaturePad(target);
  target.classList.add('signed');
  target.dataset.signatureText = surname;
  renderSignaturePad(target);
}

function refreshSignatureIfSigned(input, targetId) {
  const target = document.getElementById(targetId);
  if (!input || !target || !target.classList.contains('signed')) return;

  target.dataset.signatureText = getSurname(input.value);
  renderSignaturePad(target);
}

function updateSignature(input, targetId) {
  refreshSignatureIfSigned(input, targetId);
}

function bindClickSignature(inputId, targetId) {
  const input = document.getElementById(inputId);
  const target = document.getElementById(targetId);
  if (!input || !target) return;

  ensureSignaturePad(target);
  renderSignaturePad(target);

  target.addEventListener('click', () => signPad(input, target));
  target.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      signPad(input, target);
    }
  });

  input.addEventListener('input', () => refreshSignatureIfSigned(input, targetId));
}

function bindAllSignatures(pairs) {
  pairs.forEach(([inputId, targetId]) => bindClickSignature(inputId, targetId));
}

function formatDateForDocument(dateValue) {
  if (!dateValue) return '………………';
  const date = new Date(dateValue + 'T12:00:00');
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString('cs-CZ');
}

function bindDateDisplay(inputId, targetId) {
  const input = document.getElementById(inputId);
  const target = document.getElementById(targetId);
  if (!input || !target) return;

  const handler = () => {
    target.textContent = formatDateForDocument(input.value);
  };
  input.addEventListener('input', handler);
  handler();
}

function printDocument() {
  window.print();
}

document.addEventListener('DOMContentLoaded', () => {
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', printDocument);
  }
});
