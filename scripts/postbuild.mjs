// Post-build: take dist/index.html and produce PixelPlumber.html that runs
// when opened directly via file:// in any browser.
//
// Two transforms:
//   1. Strip type="module" + crossorigin from the inline <script> so
//      browsers that block inline modules under file:// will still execute it.
//   2. Move that script from <head> to just before </body>. Classic scripts
//      run synchronously when encountered, and Vite's singlefile plugin
//      places the bundle in <head>, so without this the DOM doesn't yet
//      exist when the script runs.

import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'dist/index.html';
const OUT = 'PixelPlumber.html';

let html = readFileSync(SRC, 'utf8');

// Pull out the inline module script as a whole.
const scriptRe = /[ \t]*<script\b[^>]*\btype=("module"|'module')[^>]*>[\s\S]*?<\/script>\s*/i;
const match = html.match(scriptRe);
if (!match) {
  throw new Error('postbuild: could not find inline module <script> in dist/index.html');
}
let scriptTag = match[0]
  .replace(/\btype=("module"|'module')\s*/i, '')
  .replace(/\bcrossorigin(?:=("[^"]*"|'[^']*'))?\s*/i, '');

// Remove from current location, re-insert just before </body>.
html = html.replace(scriptRe, '');
html = html.replace(/<\/body>/i, `${scriptTag}\n  </body>`);

writeFileSync(OUT, html);
console.log(`Wrote ${OUT} (${html.length.toLocaleString()} bytes)`);
