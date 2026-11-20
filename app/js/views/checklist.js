// The checklist view: one row per trophy, with its checkbox, grade medal, name,
// official description, kind, difficulty and a preview of the guide. Clicking a
// row opens its full guide in the detail pane; ticking the box marks it earned.
import { applyFilters, isSpoilerHidden } from '../filters.js';
import { KIND_LABELS, GRADE_LABELS } from '../data.js';

export function difficultyStars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

export function gradeBadge(grade) {
  return `<span class="grade grade-${grade}"><span class="medal"></span>${GRADE_LABELS[grade]}</span>`;
}

export function renderChecklist(view, doc, store, filters, selectedId, onSelect, onToggle) {
  const list = applyFilters(doc.trophies, filters, store);
  const earned = new Set(store.earned);
  const html = list
    .map((t) => {
      const hidden = isSpoilerHidden(t, store);
      const name = hidden ? 'Hidden story trophy' : t.name;
      const desc = hidden
        ? 'Spoilers on — earn this trophy to reveal its name and description.'
        : t.description;
      const preview = hidden ? '' : `<p class="trophy-guide-preview">${escapeHtml(t.guide)}</p>`;
      const flags = [
        t.missable ? '<span class="flag missable">Possibly missable</span>' : '',
        !t.confirmed ? '<span class="flag unconfirmed">Method unconfirmed</span>' : '',
        hidden ? '<span class="flag spoiler">Spoiler hidden</span>' : '',
      ].join('');
      const target = t.target
        ? `<span>Target: ${t.target.toLocaleString('en-US')}</span>`
        : '';
      return `<button type="button" class="trophy ${earned.has(t.id) ? 'earned' : ''} ${
        selectedId === t.id ? 'selected' : ''
      }" data-id="${t.id}">
        <input type="checkbox" ${earned.has(t.id) ? 'checked' : ''} aria-label="Mark ${
        escapeHtml(name)
      } as earned" tabindex="-1">
        <span>
          <span class="trophy-name">${escapeHtml(name)}</span>
          <span class="trophy-desc">${escapeHtml(desc)}</span>
          <span class="trophy-meta">${flags}
            <span class="kind-tag">${KIND_LABELS[t.kind]}</span>
            <span class="diff" title="Difficulty ${t.difficulty} of 5">${difficultyStars(t.difficulty)}</span>
            ${target}
          </span>
          ${preview}
        </span>
        ${gradeBadge(t.grade)}
      </button>`;
    })
    .join('');
  view.innerHTML = list.length
    ? `<div class="trophy-list">${html}</div>`
    : `<p class="empty">No trophies match these filters. Clear the search or a filter to see the full list of 55.</p>`;
  view.querySelectorAll('.trophy').forEach((row) => {
    const id = Number(row.dataset.id);
    row.addEventListener('click', (event) => {
      if (event.target.matches('input[type="checkbox"]')) return;
      onSelect(id);
    });
    row.querySelector('input[type="checkbox"]').addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(id);
    });
  });
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
