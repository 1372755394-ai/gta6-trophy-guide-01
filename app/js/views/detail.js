// The detail pane: the selected trophy's full guide — official description,
// our own-words guide, numbered steps, when it can be missed, its sources with
// links, a difficulty rating and the reader's own note. Spoiler-hidden story
// trophies show a locked message instead of their guide.
import { isSpoilerHidden } from '../filters.js';
import { KIND_LABELS, sourceOf } from '../data.js';
import { escapeHtml, gradeBadge, difficultyStars } from './checklist.js';

export function renderDetail(detail, doc, store, trophy, onToggle, onNote) {
  if (!trophy) {
    detail.innerHTML = `<p class="detail-empty">Select a trophy on the left to read its full guide — what to do, where, when it can be missed, and the sources behind each fact.</p>`;
    return;
  }
  if (isSpoilerHidden(trophy, store)) {
    detail.innerHTML = `
      <span class="flag spoiler">Spoiler hidden</span>
      <h2>Hidden story trophy</h2>
      <p class="official">This is a story trophy you have not earned yet, and the spoiler setting is on — its name, description and guide are hidden until you earn it.</p>
      <p>Turn the spoiler setting off at the top of the page if you would rather see everything, or earn it in the game and tick it off here.</p>
      <div class="actions"><button type="button" class="primary" data-act="toggle">Mark as earned</button></div>`;
    wire(detail, trophy, onToggle, onNote);
    return;
  }
  const earned = store.earned.includes(trophy.id);
  const flags = [
    trophy.missable ? '<span class="flag missable">Possibly missable</span>' : '',
    !trophy.confirmed ? '<span class="flag unconfirmed">Method unconfirmed</span>' : '',
  ].join('');
  const steps = (trophy.steps || [])
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join('');
  const sources = (trophy.src || [])
    .map((key) => {
      const s = sourceOf(doc, key);
      if (!s) return '';
      return `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(
        s.label,
      )}</a></li>`;
    })
    .join('');
  const missableNote = trophy.missable
    ? `<h3>When it can be missed</h3><p><strong>Yes — this is the one trophy other guides flag as possibly missable.</strong> One meditation spot is at Jason's house and, according to PowerPyx, can only be used early in the story, in Chapter 1. Meditate there at the first opportunity; the other 17 spots are available later.</p>`
    : `<h3>When it can be missed</h3><p>Not missable. ${
        trophy.kind === 'story'
          ? 'It unlocks by playing the story, and the story can be finished at any pace.'
          : 'It can be earned in free roam after the story, at any time.'
      }</p>`;
  const target = trophy.target
    ? `<p><strong>PSN target:</strong> ${trophy.target.toLocaleString('en-US')}</p>`
    : '';
  detail.innerHTML = `
    ${flags}
    <h2>${escapeHtml(trophy.name)}</h2>
    <p class="official">${gradeBadge(trophy.grade)} ${escapeHtml(trophy.description)}</p>
    <p><span class="kind-tag">${KIND_LABELS[trophy.kind]}</span>
       <span class="diff" title="Difficulty ${trophy.difficulty} of 5">${difficultyStars(trophy.difficulty)}</span></p>
    ${target}
    <h3>Guide</h3>
    <p>${escapeHtml(trophy.guide)}</p>
    ${steps ? `<h3>Steps</h3><ol class="steps">${steps}</ol>` : ''}
    ${missableNote}
    <h3>Sources</h3>
    <ul class="sources">${sources}</ul>
    <p class="official">The name, description and grade above are the official ones; the guide is written in our own words for this guide${
      trophy.confirmed
        ? '.'
        : ', and its method is not yet confirmed in a published guide — the guide says so where it matters.'
    }</p>
    <h3>Your note</h3>
    <textarea data-note placeholder="Your own note for this trophy — a location, a loadout, a reminder…">${escapeHtml(
      store.notes[trophy.id] || '',
    )}</textarea>
    <div class="actions">
      <button type="button" class="primary" data-act="toggle">${
        earned ? 'Mark as not earned' : 'Mark as earned'
      }</button>
      <button type="button" data-act="prev">← Previous</button>
      <button type="button" data-act="next">Next →</button>
    </div>`;
  wire(detail, trophy, onToggle, onNote);
}

function wire(detail, trophy, onToggle, onNote) {
  const toggle = detail.querySelector('[data-act="toggle"]');
  if (toggle) toggle.addEventListener('click', () => onToggle(trophy.id));
  const prev = detail.querySelector('[data-act="prev"]');
  if (prev) prev.addEventListener('click', () => onNote('prev', trophy.id));
  const next = detail.querySelector('[data-act="next"]');
  if (next) next.addEventListener('click', () => onNote('next', trophy.id));
  const note = detail.querySelector('[data-note]');
  if (note) note.addEventListener('change', () => onNote('note', trophy.id, note.value));
}
