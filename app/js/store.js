// Saved progress: which trophies are earned, the reader's own notes, and the
// spoiler setting. Everything lives in localStorage under one key and never
// leaves the browser; export and import move it as a plain JSON file.
const KEY = 'gta6-trophy-guide-v1';

export function loadStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { earned: [], notes: {}, spoilers: true };
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter(Number.isInteger) : [],
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
      spoilers: parsed.spoilers !== false,
    };
  } catch {
    return { earned: [], notes: {}, spoilers: true };
  }
}

export function saveStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function earnedSet(store) {
  return new Set(store.earned);
}

export function toggleEarned(store, id) {
  const set = earnedSet(store);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  store.earned = [...set].sort((a, b) => a - b);
  saveStore(store);
  return store;
}

export function setNote(store, id, text) {
  if (text.trim()) store.notes[id] = text.trim();
  else delete store.notes[id];
  saveStore(store);
}

export function exportProgress(store) {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgress(file) {
  const parsed = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== 'object') throw new Error('not a progress file');
  const next = {
    earned: Array.isArray(parsed.earned) ? parsed.earned.filter(Number.isInteger) : [],
    notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
    spoilers: parsed.spoilers !== false,
  };
  saveStore(next);
  return next;
}

export function resetStore() {
  const fresh = { earned: [], notes: {}, spoilers: true };
  saveStore(fresh);
  return fresh;
}
