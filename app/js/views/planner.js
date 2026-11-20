// Next Up: the planner. It picks the next unearned trophy by roadmap stage —
// the earliest stage with anything left — and lists the five after it, so the
// reader always knows what to do next instead of staring at 55 checkboxes.
import { ROADMAP_STAGES, KIND_LABELS } from '../data.js';
import { escapeHtml } from './checklist.js';

export function nextUpList(doc, store) {
  const remaining = doc.trophies.filter((t) => !store.earned.includes(t.id));
  remaining.sort((a, b) => a.stage - b.stage || a.difficulty - b.difficulty || a.id - b.id);
  return remaining;
}

export function renderPlanner(view, doc, store, onSelect) {
  const remaining = nextUpList(doc, store);
  if (!remaining.length) {
    view.innerHTML = `<section class="next-card"><h2>Platinum earned ★</h2>
      <p>Every one of the 55 trophies is ticked off. Vice Got a Price! is yours — you are a Leonida Legend.</p></section>`;
    return;
  }
  const [first, ...rest] = remaining;
  const stage = ROADMAP_STAGES.find((s) => s.id === first.stage);
  const why = first.missable
    ? 'Do this one first: it is the only trophy flagged as possibly missable, and its Chapter 1 spot may not come back.'
    : first.kind === 'story'
      ? 'The story is the fastest progress available — this is the next story trophy on the road.'
      : `Roadmap ${stage ? stage.title.replace(/^Stage \d+ — /, '') : ''} — the earliest stage with anything left.`;
  view.innerHTML = `
    <section class="next-card">
      <p class="kicker">Your next trophy</p>
      <h2>${escapeHtml(first.name)}</h2>
      <p><em>${escapeHtml(first.description)}</em></p>
      <p>${escapeHtml(first.guide)}</p>
      <p><strong>Why this one:</strong> ${escapeHtml(why)}</p>
      <p><button type="button" class="primary" data-id="${first.id}">Read the full guide →</button></p>
    </section>
    <div class="next-list">
      ${rest.slice(0, 5).map((t) => `<button type="button" data-id="${t.id}"><b>${escapeHtml(
        t.name,
      )}</b><span>${KIND_LABELS[t.kind]} · difficulty ${t.difficulty}/5 · roadmap stage ${
        t.stage
      }</span></button>`).join('')}
    </div>`;
  view.querySelectorAll('[data-id]').forEach((b) => {
    b.addEventListener('click', () => onSelect(Number(b.dataset.id)));
  });
}
