// Sources & About: where every fact in this guide comes from, what is
// confirmed and what is not, and how the guide works offline.
import { escapeHtml } from './checklist.js';

export function renderAbout(view, doc) {
  const rows = Object.values(doc.sources)
    .map(
      (s) =>
        `<tr><td><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(
          s.label,
        )}</a></td><td>${escapeHtml(sourceRole(s.label))}</td></tr>`,
    )
    .join('');
  const unconfirmed = doc.trophies.filter((t) => !t.confirmed).length;
  view.innerHTML = `
    <div class="about">
      <h2>Sources &amp; about this guide</h2>
      <p>This guide is an unofficial fan project. Its trophy names, descriptions and grades are the official PlayStation 5 list as published on PSN, via the trackers below; the two agreed on every name, description and grade. Every guide is written in our own words for this guide — nothing is copied from another guide.</p>
      <table class="source-table">
        <thead><tr><th>Source</th><th>What we take from it</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <h2>What is confirmed, and what is not</h2>
      <p>Of the 55 guides, ${55 - unconfirmed} draw on a published guide or follow directly from the official description. ${unconfirmed} are marked <strong>Method unconfirmed</strong>: no published guide had a verified method when we checked on 20 Nov 2026, the day after launch, so those guides give the plain reading of the official description and say so plainly, instead of inventing a location or a step. Check the sources above for updates as the guides fill in.</p>
      <h2>How the tracker works</h2>
      <p>Tick a trophy and it stays ticked in your browser (localStorage). Export downloads your progress as a JSON file; import reads one back. Nothing is uploaded anywhere — the guide makes no network request at all, and it works with the network off. The spoiler setting hides story trophy names and descriptions until you earn them.</p>
      <h2>Platinum, in one paragraph</h2>
      <p>55 trophies, 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PSN; no online trophies; one playthrough is enough. The long pole is A Long Road — 100% completion — which is why the platinum takes about 200 to 300 hours. Play the story, do the one possibly-missable meditation early, then work the roadmap in order.</p>
    </div>`;
}

function sourceRole(label) {
  if (label.startsWith('Exophase')) return 'Official names, descriptions and grades';
  if (label.startsWith('PSNProfiles')) return 'Grades and PSN progress targets';
  if (label.startsWith('Push Square')) return 'Per-trophy methods, counts and locations';
  if (label.startsWith('KeenGamer')) return 'Roadmap, counts and final-mission names';
  if (label.startsWith('FullSweep')) return 'The possibly-missable flag and strand counts';
  return 'Reference';
}
