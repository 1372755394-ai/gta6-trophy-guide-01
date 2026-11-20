// Boot, hash routing and wiring for the Leonida Trophy Guide. The app is plain
// ES modules over static files: it fetches data/trophies.json once, then renders
// everything client-side and saves progress in localStorage. It makes no other
// request, and no request to any other origin.
import { loadGuideData } from './data.js';
import {
  loadStore,
  saveStore,
  toggleEarned,
  setNote,
  exportProgress,
  importProgress,
  resetStore,
} from './store.js';
import { defaultFilters, gradeCounts } from './filters.js';
import { renderChecklist } from './views/checklist.js';
import { renderDetail } from './views/detail.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner, nextUpList } from './views/planner.js';
import { renderAbout } from './views/about.js';

const view = document.getElementById('view');
const detail = document.getElementById('detail');
const toolbar = document.getElementById('toolbar');

const doc = await loadGuideData();
let store = loadStore();
let filters = defaultFilters();
let selectedId = null;
let route = 'checklist';

const $ = (id) => document.getElementById(id);

function updateProgress() {
  const earned = store.earned.length;
  const total = doc.trophies.length;
  $('progress-earned').textContent = earned;
  $('progress-fill').style.width = `${Math.round((earned / total) * 100)}%`;
  const counts = gradeCounts(doc.trophies, store);
  $('progress-sub').textContent =
    `Platinum ${counts.platinum[0]}/${counts.platinum[1]} · Gold ${counts.gold[0]}/${counts.gold[1]} · ` +
    `Silver ${counts.silver[0]}/${counts.silver[1]} · Bronze ${counts.bronze[0]}/${counts.bronze[1]}`;
  const next = nextUpList(doc, store)[0];
  $('progress-next').innerHTML = next
    ? `Next up: <b>${escapeText(next.name)}</b>`
    : 'Platinum earned — you are a Leonida Legend.';
}

function escapeText(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function render() {
  document.querySelectorAll('.tabs a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  toolbar.style.display = route === 'checklist' ? '' : 'none';
  if (route === 'checklist') {
    renderChecklist(view, doc, store, filters, selectedId, selectTrophy, toggleTrophy);
  } else if (route === 'roadmap') {
    renderRoadmap(view, doc, store, selectTrophy);
  } else if (route === 'missables') {
    renderMissables(view, doc, store, selectTrophy);
  } else if (route === 'next') {
    renderPlanner(view, doc, store, selectTrophy);
  } else if (route === 'about') {
    renderAbout(view, doc);
  }
  const shown = route === 'checklist' ? countShown() : null;
  $('toolbar-count').textContent = shown === null ? '' : `Showing ${shown} of 55 trophies`;
  renderDetailPane();
  updateProgress();
}

function countShown() {
  return view.querySelectorAll('.trophy').length;
}

function renderDetailPane() {
  const trophy = selectedId === null ? null : doc.trophies.find((t) => t.id === selectedId);
  renderDetail(detail, doc, store, trophy, toggleTrophy, detailAction);
}

function selectTrophy(id) {
  selectedId = id;
  if (route !== 'checklist') route = 'checklist';
  render();
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleTrophy(id) {
  store = toggleEarned(store, id);
  render();
}

function stepSelection(delta) {
  const ids = doc.trophies.map((t) => t.id);
  const index = ids.indexOf(selectedId);
  const next = ids[(index + delta + ids.length) % ids.length];
  selectTrophy(next);
}

function detailAction(action, id, value) {
  if (action === 'prev') stepSelection(-1);
  else if (action === 'next') stepSelection(1);
  else if (action === 'note') {
    setNote(store, id, value || '');
    store = loadStore();
  }
}

function parseHash() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [name, arg] = hash.split('/');
  if (name === 'trophy' && arg) {
    route = 'checklist';
    selectedId = Number(arg) || null;
  } else if (['checklist', 'roadmap', 'missables', 'next', 'about'].includes(name)) {
    route = name;
    if (name !== 'checklist') selectedId = null;
  } else {
    route = 'checklist';
  }
  render();
}

// Toolbar wiring.
$('q').addEventListener('input', (e) => {
  filters.q = e.target.value;
  render();
});
$('f-grade').addEventListener('change', (e) => {
  filters.grade = e.target.value;
  render();
});
$('f-kind').addEventListener('change', (e) => {
  filters.kind = e.target.value;
  render();
});
$('f-diff').addEventListener('change', (e) => {
  filters.difficulty = e.target.value;
  render();
});
$('f-missable').addEventListener('change', (e) => {
  filters.missableOnly = e.target.checked;
  render();
});
$('f-unconfirmed').addEventListener('change', (e) => {
  filters.unconfirmedOnly = e.target.checked;
  render();
});
$('f-earned').addEventListener('change', (e) => {
  filters.earned = e.target.value;
  render();
});

// Spoiler setting, export, import and reset.
$('spoiler-toggle').checked = store.spoilers;
$('spoiler-toggle').addEventListener('change', (e) => {
  store.spoilers = e.target.checked;
  saveStore(store);
  render();
});
$('export-btn').addEventListener('click', () => exportProgress(store));
$('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    store = await importProgress(file);
    $('spoiler-toggle').checked = store.spoilers;
    render();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  e.target.value = '';
});
$('reset-btn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies and notes? This cannot be undone.')) {
    store = resetStore();
    selectedId = null;
    $('spoiler-toggle').checked = store.spoilers;
    render();
  }
});

window.addEventListener('hashchange', parseHash);
parseHash();
