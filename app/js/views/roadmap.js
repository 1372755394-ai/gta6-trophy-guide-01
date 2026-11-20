// The roadmap view: the seven stages to the platinum, each with its advice,
// its trophies, and a progress bar for that stage. Clicking a trophy opens its
// guide in the detail pane.
import { ROADMAP_STAGES } from '../data.js';
import { escapeHtml } from './checklist.js';

export function renderRoadmap(view, doc, store, onSelect) {
  const earned = new Set(store.earned);
  const stages = ROADMAP_STAGES.map((stage) => {
    const trophies = doc.trophies.filter((t) => t.stage === stage.id);
    const done = trophies.filter((t) => earned.has(t.id)).length;
    const pct = trophies.length ? Math.round((done / trophies.length) * 100) : 0;
    const items = trophies
      .map(
        (t) =>
          `<li class="${earned.has(t.id) ? 'done' : ''}"><a href="#/trophy/${t.id}" data-id="${t.id}">${escapeHtml(
            t.name,
          )}</a></li>`,
      )
      .join('');
    return `<section class="stage">
      <h2>${escapeHtml(stage.title)} <span class="stage-count">${done}/${trophies.length} earned</span></h2>
      <div class="stage-bar"><i style="width:${pct}%"></i></div>
      <p>${escapeHtml(stage.advice)}</p>
      <ul>${items}</ul>
    </section>`;
  }).join('');
  view.innerHTML = `
    <p class="roadmap-intro">One playthrough, no online trophies, about 200–300 hours. The order below wastes the least backtracking: story first, the one possibly-missable trophy early, then strangers, activities, crime, collectibles and money, and 100% completion last.</p>
    ${stages}`;
  view.querySelectorAll('[data-id]').forEach((a) => {
    a.addEventListener('click', (event) => {
      event.preventDefault();
      onSelect(Number(a.dataset.id));
    });
  });
}
