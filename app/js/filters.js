// Filtering, text search and the spoiler rule for the checklist. A trophy is
// spoiler-hidden when the spoiler setting is on, the trophy is a story trophy
// and it has not been earned yet: its name, description and guide stay hidden
// until then. The filter never hides a trophy the reader has earned.
export function defaultFilters() {
  return {
    q: '',
    grade: 'all',
    kind: 'all',
    difficulty: 'all',
    missableOnly: false,
    unconfirmedOnly: false,
    earned: 'all',
  };
}

export function isSpoilerHidden(trophy, store) {
  return store.spoilers && trophy.kind === 'story' && !store.earned.includes(trophy.id);
}

export function applyFilters(trophies, filters, store) {
  const q = filters.q.trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.kind !== 'all' && t.kind !== filters.kind) return false;
    if (filters.difficulty !== 'all' && t.difficulty !== Number(filters.difficulty)) return false;
    if (filters.missableOnly && !t.missable) return false;
    if (filters.unconfirmedOnly && t.confirmed) return false;
    const earned = store.earned.includes(t.id);
    if (filters.earned === 'earned' && !earned) return false;
    if (filters.earned === 'remaining' && earned) return false;
    if (q) {
      const haystack = [t.name, t.description, t.guide, ...(t.steps || [])]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function gradeCounts(trophies, store) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    counts[t.grade][1] += 1;
    if (store.earned.includes(t.id)) counts[t.grade][0] += 1;
  }
  return counts;
}
