// Loads the trophy list and holds the guide's own reference data: kinds, the
// seven roadmap stages and the per-stage advice. The trophy facts themselves
// live in data/trophies.json so the list can be checked against the official one.
export async function loadGuideData() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('could not load data/trophies.json');
  const doc = await response.json();
  return doc;
}

export const KIND_LABELS = {
  story: 'Story',
  stranger: 'Strangers & side missions',
  activity: 'Activity',
  collectible: 'Collectible',
  exploration: 'Exploration',
  crime: 'Crime & robberies',
  money: 'Money & property',
  completion: 'Completion',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

// The roadmap to the platinum, in the order to play it. Built from the official
// descriptions: story first, the one possibly-missable trophy early, then the
// side content in the order that wastes the least travel, then 100%.
export const ROADMAP_STAGES = [
  {
    id: 1,
    title: 'Stage 1 — Play the story, blind',
    advice:
      'Play Chapters 1 to 4 and the final mission at your own pace. All 12 story trophies pop as you go, and nothing here can be missed. Enjoy it: the story is about 50 hours, and free roam continues after the credits.',
  },
  {
    id: 2,
    title: 'Stage 2 — The one trophy that might be missable',
    advice:
      'Do this in Chapter 1, before you finish it. One meditation spot sits at Jason\u2019s house and, according to PowerPyx, can only be used early in the story. Meditate there the first chance you get, then keep meditating at every spot you pass.',
  },
  {
    id: 3,
    title: 'Stage 3 — Strangers and side characters',
    advice:
      'Finish the five named stranger strands (Andy, Kenton, Billy, Randy, Tyrone) plus three more, for 8 strands in all. Their final missions hand out five bronze trophies and the Strangers & Freaks silver.',
  },
  {
    id: 4,
    title: 'Stage 4 — Activities and races',
    advice:
      'The long grind starts here: 250 stunts, 42 shooting-range gold medals, 14 drone races, 20 different race wins, plus fishing, the arcade, bowling and 50 challenges. Start the stunts early and chip away at them while travelling.',
  },
  {
    id: 5,
    title: 'Stage 5 — Crime, robberies and the law',
    advice:
      'Partner robberies, bank vaults, armored trucks, jewelry stores, gang operations and the Combat Focus and Rhino trophies. Bring your partner for the two partner trophies and plan getaways before you go in.',
  },
  {
    id: 6,
    title: 'Stage 6 — Collectibles, exploration and money',
    advice:
      'Cards, WAiNK scans, vehicles, the whole map, the Ocean Beach cocktail, the odd vague trophies, $250,000 of laundered Marked Bills, $100,000 spent, all 8 garages and 10 Scooter Bros registrations. Most of this finishes itself if you have been exploring.',
  },
  {
    id: 7,
    title: 'Stage 7 — The long road to 100%',
    advice:
      'Open the in-game 100% checklist (Touch Pad, Progress, 100% Completion) and clear what is left. When it hits 100%, A Long Road pops — and with it, the platinum.',
  },
];

export function trophyById(doc, id) {
  return doc.trophies.find((t) => t.id === id);
}

export function sourceOf(doc, key) {
  return doc.sources[key];
}
