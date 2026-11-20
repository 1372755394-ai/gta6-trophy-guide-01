// Leonida Trophy Guide — a gta6-trophy-guide-01 entry (Node 22, standard library only). The guide is this
// directory's app/ folder: plain static files a browser opens at app/index.html (ES modules, CSS, no build
// step), offline: it loads nothing over the network, and its trophy list and guides are app/data/trophies.json
// — a real guide in our own words for every one of the 55 official trophies, plus a roadmap to the platinum,
// filters, a spoiler setting and a progress checklist saved in localStorage. The program hands it in: it
// checks the trophy data and screenshots first (failing fast with a plain error instead of handing in a
// broken guide), then copies app/ and screenshots/ from beside this file to /output and writes
// /output/dossier.json, the summary the judge reads (your screenshots, the first load's files and bytes, and
// your source), with the vendored make.fun library. Leave vendor/makefun-frontend.ts as it is: the scorer
// requires dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Pre-flight: the guide is only worth handing in if its trophy file really names
// all 55 official trophies, each with a guide in our own words, and if there are
// 3 or 4 screenshots of it. The gate would refuse anything less, so fail here
// with a readable error instead of writing a dossier the scorer rejects.
const trophiesPath = join(here, 'app', 'data', 'trophies.json');
const trophiesDoc = JSON.parse(readFileSync(trophiesPath, 'utf8'));
const trophies = Array.isArray(trophiesDoc) ? trophiesDoc : trophiesDoc.trophies;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(`expected 55 trophies in app/data/trophies.json, found ${Array.isArray(trophies) ? trophies.length : 'none'}`);
}
const withoutGuide = trophies.filter((t) => typeof t.guide !== 'string' || !t.guide.trim());
if (withoutGuide.length > 0) {
  throw new Error(`trophies without a guide: ${withoutGuide.map((t) => t.name ?? t.id).join(', ')}`);
}
const names = new Set(trophies.map((t) => t.name));
if (names.size !== trophies.length) {
  throw new Error('trophy names are not unique in app/data/trophies.json');
}
const shotsDir = join(here, 'screenshots');
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => !f.startsWith('.')) : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3 or 4 screenshots in screenshots/, found ${shots.length}`);
}
// The gate refuses a screenshot over 256 KiB or one that is not a whole PNG or
// JPEG, so check both here: the first two bytes are the PNG or JPEG magic.
for (const shot of shots) {
  const data = readFileSync(join(shotsDir, shot));
  if (data.length > 262144) {
    throw new Error(`screenshot ${shot} is ${data.length} bytes, over the 256 KiB cap`);
  }
  const isPng = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;
  const isJpeg = data[0] === 0xff && data[1] === 0xd8;
  if (!isPng && !isJpeg) throw new Error(`screenshot ${shot} is not a PNG or JPEG`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
