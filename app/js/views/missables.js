// The missables view: the one trophy other guides flag as possibly missable,
// and the reassurances for everything else — built from the official
// descriptions and the published guides, not from guesswork.
import { escapeHtml } from './checklist.js';

export function renderMissables(view, doc, store, onSelect) {
  const flagged = doc.trophies.filter((t) => t.missable);
  const cards = flagged
    .map((t) => {
      const earned = store.earned.includes(t.id);
      return `<article class="missable-card">
        <span class="flag missable">Possibly missable</span>
        <h2>${escapeHtml(t.name)} ${earned ? '— earned ✓' : ''}</h2>
        <p><em>${escapeHtml(t.description)}</em></p>
        <p>${escapeHtml(t.guide)}</p>
        <p><button type="button" data-id="${t.id}">Read the full guide →</button></p>
      </article>`;
    })
    .join('');
  view.innerHTML = `
    <p class="roadmap-intro">Good news first: <strong>only one trophy is flagged as possibly missable</strong> by the published guides, and every story trophy is unmissable. Free roam continues after the final mission, so almost everything can be cleaned up later.</p>
    ${cards}
    <section class="safe-list">
      <h2>Why the rest are safe</h2>
      <ul>
        <li><strong>Story trophies (12):</strong> chapter and named-mission trophies pop by playing the story. No choice in the campaign locks one away, and there is no mission replay to worry about because none is needed.</li>
        <li><strong>Strangers (7 trophies):</strong> the five named characters and the 8-strand silver all stay available in free roam after the story.</li>
        <li><strong>Activities, crime, collectibles and money:</strong> stunts, shooting ranges, races, robberies, cards, WAiNK scans, vehicles, garages and laundering are all repeatable or available after the story ends.</li>
        <li><strong>100% completion:</strong> the checklist opens after the story and nothing on it is tied to a one-time story moment — except the meditation spot in Chapter 1, above.</li>
        <li><strong>No online trophies:</strong> all 55 can be earned offline, in a single playthrough.</li>
      </ul>
      <p>Sources: PowerPyx and GTABase flag Positive Mental Attitude as the only possibly-missable trophy (via FullSweep); Push Square confirms free roam after the final mission and the 100% checklist opening after the story.</p>
    </section>`;
  view.querySelectorAll('[data-id]').forEach((b) => {
    b.addEventListener('click', () => onSelect(Number(b.dataset.id)));
  });
}
