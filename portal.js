const FIRM_NAME = 'Sentinel Laws';
const FIRM_LOGO = 'sentinel-laws-logo.png';
const DOJ_LOGO = 'doj-logo.png';
const COURT_SEAL = 'court-seal.png';
const ATTORNEY_STORAGE_KEY = 'sentinel-laws-attorney';

const ATTORNEYS = {
  'leo-foster': {
    id: 'leo-foster',
    name: 'Leo Foster',
    display: 'Leo Foster, Sentinel Laws'
  },
  'matteo-ricci': {
    id: 'matteo-ricci',
    name: 'Matteo Ricci',
    display: 'Matteo Ricci, Sentinel Laws'
  }
};

function getSelectedAttorneyId() {
  const stored = localStorage.getItem(ATTORNEY_STORAGE_KEY);
  if (stored && ATTORNEYS[stored]) return stored;
  return 'leo-foster';
}

function getSelectedAttorney() {
  return ATTORNEYS[getSelectedAttorneyId()];
}

function setSelectedAttorney(id) {
  if (!ATTORNEYS[id]) return;
  localStorage.setItem(ATTORNEY_STORAGE_KEY, id);
  document.dispatchEvent(new CustomEvent('attorney-changed', { detail: ATTORNEYS[id] }));
}

function applyAttorneyToForm() {
  const attorney = getSelectedAttorney();
  const attorneyField = document.getElementById('petitioner-attorney');
  const sigNameAttorney = document.getElementById('sig-name-attorney');

  if (attorneyField) {
    attorneyField.value = attorney.display;
  }

  if (sigNameAttorney) {
    sigNameAttorney.value = attorney.name;
    if (typeof updateSignature === 'function') {
      updateSignature(sigNameAttorney, 'sig-attorney');
    }
  }
}

function initPortalAttorneySelector() {
  const options = document.querySelectorAll('.attorney-option input[name="attorney"]');
  if (!options.length) return;

  const currentId = getSelectedAttorneyId();
  options.forEach((input) => {
    input.checked = input.value === currentId;
    input.addEventListener('change', () => {
      if (input.checked) {
        setSelectedAttorney(input.value);
      }
    });
  });
}

function initFormAttorneySync() {
  applyAttorneyToForm();
  document.addEventListener('attorney-changed', applyAttorneyToForm);
}

function initDisclosureToggles(selector) {
  document.querySelectorAll(`${selector}:not(:disabled)`).forEach((button) => {
    const panelId = button.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPortalAttorneySelector();
  initFormAttorneySync();
  initDisclosureToggles('.authority-toggle');
  initDisclosureToggles('.category-toggle');
});
