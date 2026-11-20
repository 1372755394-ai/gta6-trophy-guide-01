# Leonida Trophy Guide — GTA VI

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/1372755394-ai/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/1372755394-ai/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on
PlayStation 5: 1 platinum, 2 gold, 6 silver, 46 bronze. Built for the
[make.fun](https://make.fun/bounty/gta6-trophy-guide-01) competition
`gta6-trophy-guide-01` — if you enter through make.fun, the referral code is
**`qajetvf4`**.

## What it is

A static web app (plain HTML, ES modules and CSS — no build step, no network)
that opens in any desktop browser and works with the network off:

- **A real guide for every trophy, in our own words** — what to do, where,
  and when it can be missed, with numbered steps and the sources behind each
  fact. Where no published guide had a verified method (8 trophies, checked
  20 Nov 2026, the day after launch), the guide says so plainly instead of
  inventing a location or a step.
- **A roadmap to the platinum** in seven stages: story first, the one
  possibly-missable trophy early, then strangers, activities, crime,
  collectibles and money, and 100% completion last.
- **Missables flagged** — only one trophy is flagged as possibly missable
  (Positive Mental Attitude: meditate at Jason's house in Chapter 1), with the
  reasons the other 54 are safe.
- **A tracker**: tick trophies off and progress saves in your browser
  (localStorage), with export to a JSON file and import back. Filters by grade,
  kind, difficulty, missable, unconfirmed and earned/remaining, plus text
  search.
- **A spoiler setting** that hides story trophy names and descriptions until
  you earn them.
- **Next Up**: the planner picks the next unearned trophy by roadmap stage.

Trophy names, descriptions and grades are the official PlayStation 5 list as
published on PSN, via Exophase and PSNProfiles (checked 20 Nov 2026). No
Rockstar logo or official artwork is used.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or open `app/index.html` through any static file server with `app/` at its
root. There is no build step and nothing to install.

## Hand it in (the make.fun entry)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) first checks the trophy data —
all 55 trophies, each with a guide — and the screenshots, then copies `app/`
and `screenshots/` to the output directory and writes `dossier.json` with the
vendored `vendor/makefun-frontend.ts` library, which is left unchanged.

## Layout

```
main.ts                  the entry program (Node 22, stdlib only)
serve.ts                 a tiny static server for local testing
app/
  index.html             shell: header, progress, tabs, toolbar, detail pane
  style.css              the whole look (dark Vice-nights theme, system fonts)
  js/
    main.js              boot, hash routing and wiring
    data.js              loads trophies.json; kinds and the roadmap stages
    store.js             localStorage progress, export/import
    filters.js           filters, search and the spoiler rule
    views/
      checklist.js       the 55-trophy checklist
      detail.js          a trophy's full guide pane
      roadmap.js         the seven roadmap stages
      missables.js       the possibly-missable trophy and why the rest are safe
      planner.js         Next Up
      about.js           sources, and what is confirmed vs not
  data/
    trophies.json        the official 55 trophies with guides, steps and sources
screenshots/             3–4 real renders of the app (see shots.json)
vendor/
  makefun-frontend.ts    the kit's dossier library, unchanged
```

## License

MIT — see `LICENSE`.
