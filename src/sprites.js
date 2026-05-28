// Procedural pixel-art sprite atlas. Each sprite is a string-array of pixels
// referencing a palette, baked once into an offscreen canvas at boot.
// Keeps everything self-contained (no external image assets, no IP issues).

const PALETTE = {
  '.': null,              // transparent
  // skin / body
  K: '#000000',           // outline / shadow
  W: '#ffffff',           // white
  R: '#d42c2c',           // red (cap, shirt)
  r: '#a01818',           // dark red
  S: '#f7c79b',           // skin
  s: '#c98e62',           // skin shadow
  B: '#1c4ad8',           // blue (overalls)
  b: '#0e2a85',           // dark blue
  N: '#5b3a1e',           // brown (boots, hair)
  n: '#3a230f',           // dark brown
  // coin / gold
  G: '#FFD23F',           // gold
  g: '#c89a1f',           // gold shadow
  // ground / brick
  O: '#c4731d',           // orange brick
  o: '#8a4b10',           // brick shadow
  E: '#e9a55b',           // sand highlight
  // pipe
  P: '#37b34a',           // pipe green
  p: '#0f7a26',           // pipe dark green
  H: '#7cf07a',           // pipe highlight
  // goomba
  M: '#b06a2a',           // goomba body
  m: '#6e3a13',           // goomba shadow
  // koopa shell
  L: '#42c14d',           // light green shell
  l: '#1e7a2a',           // dark green shell
  Y: '#f9e36b',           // yellow shell edge
  y: '#b88a1d',           // dark yellow
  // sky / cloud
  C: '#ffffff',           // cloud
  c: '#dfe8ff',           // cloud shadow
  // hill
  Q: '#36a020',           // hill green
  q: '#1d6a13',           // hill dark
  // flag / flower
  F: '#ff4848',           // red petal
  f: '#a01010',           // red shadow
  X: '#ff8c2a',           // orange (fireball outer)
  x: '#ffd05c',           // fireball inner
  // flagpole
  J: '#9fb3c4',           // metal
  j: '#5c6b78',           // metal shadow
};

// helper: build a canvas from rows of pixel strings.
// Each char references PALETTE. '.' = transparent.
export function bake(rows, scale = 1) {
  const h = rows.length;
  const w = rows[0].length;
  const c = document.createElement('canvas');
  c.width = w * scale;
  c.height = h * scale;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      const color = PALETTE[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return c;
}

// flip a baked canvas horizontally
export function flipH(canvas) {
  const c = document.createElement('canvas');
  c.width = canvas.width;
  c.height = canvas.height;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(canvas, 0, 0);
  return c;
}

// ----- Player sprites -----

const player_small_idle = [
  '...KKKK.........',
  '..KRRRRR........',
  '..KRRRRR........',
  '..KKSSsSKK......',
  '..SKSKSSSK......',
  '..SKSSKSSSK.....',
  '..SSKSSSSK......',
  '...SSSSSK.......',
  '....KKKK........',
  '..KKBNBKK.......',
  '.KKBKBBKBK......',
  'KKBBKBBKBBKK....',
  'NNBBKKKKBBNN....',
  'NNNBBBBBBNNN....',
  '.KKKBBBBKKK.....',
  'KKKKK..KKKKK....',
];

const player_small_run = [
  '....KKKK........',
  '...KRRRRR.......',
  '...KRRRRR.......',
  '...KKSSsSKK.....',
  '...SKSKSSSK.....',
  '...SKSSKSSSK....',
  '...SSKSSSSK.....',
  '...KSSSSK.......',
  '..KKBKKKKK......',
  '.KBBBNNBBBK.....',
  'KBNBBNNBBNBK....',
  'KBBNBBBBNBBK....',
  'KKBNNBBNNBKK....',
  '...KKKKKK.......',
  '..KKKK.KKKK.....',
  '.NNN....NNN.....',
];

const player_small_jump = [
  '....KKKK........',
  '...KRRRRR.......',
  '...KRRRRR.......',
  '...KKSSsSKK.....',
  '...SKSKSSSK.....',
  '...SKSSKSSSK....',
  '...SSKSSSSK.....',
  '..KKSSSSKK......',
  '.KBKBBBBKBK.....',
  'KBBKBBBBKBBK....',
  'KBBBBKKBBBBK....',
  'NNBKKKKKKBNN....',
  '.NNKKKKKKNN.....',
  '...KKKKKK.......',
  '..NNN..NNN......',
  '.NNN....NNN.....',
];

const player_small_crouch = [
  '................',
  '................',
  '................',
  '................',
  '....KKKK........',
  '...KRRRRR.......',
  '...KRRRRR.......',
  '..KKSSsSKK......',
  '..SKSKSSSK......',
  '..SKSSKSSSK.....',
  '..SSKSSSSK......',
  '.KKBBBBBBKK.....',
  'KBBBBBBBBBBK....',
  'KKBBKKKKBBKK....',
  '.KKKKBBKKKK.....',
  '.NNNN..NNNN.....',
];

// big (powered up) — 16 x 32
const player_big_idle = [
  '....KKKKKK......',
  '...KRRRRRRR.....',
  '...KRRRRRRR.....',
  '...KKSSsSsSKK...',
  '..SKSKSSSSSSK...',
  '..SKSSKSSSSSK...',
  '..SSKSSSSSSK....',
  '...KSSSSSSK.....',
  '....KKKKKK......',
  '...KBBKKBBK.....',
  '..KBBBBKBBBBK...',
  '.KBBBKKBBBKBBK..',
  'KBBKKBBBBKKBBK..',
  'KBKBBBBBBBBKBK..',
  'KKBBBBBBBBBBKK..',
  '.KKBBKKKKBBKK...',
  '..KKBBBBBBKK....',
  '..KBBBBBBBBK....',
  '..KBBBNNBBBK....',
  '.KBBNNBBNNBBK...',
  'KBBKNNBBNNKBBK..',
  'KBBKNNBBNNKBBK..',
  'KKBBNNNNNNBBKK..',
  '.KKNNNNNNNNKK...',
  '..KNNNN..NNNK...',
  '..KNNNN..NNNK...',
  '.KNNNN....NNNK..',
  '.KNNNN....NNNK..',
  'KKNNNN....NNNKK.',
  'KKKKKK....KKKKK.',
  '................',
  '................',
];

const player_big_run = [
  '.....KKKKKK.....',
  '....KRRRRRRR....',
  '....KRRRRRRR....',
  '....KKSSsSsSKK..',
  '...SKSKSSSSSSK..',
  '...SKSSKSSSSSK..',
  '...SSKSSSSSSK...',
  '....KSSSSSSK....',
  '.....KKKKKK.....',
  '...KKBBKKBBKK...',
  '..KBBBBKBBBBBK..',
  '.KBBBKKBBBKBBBK.',
  'KBBKKBBBBKKBBBK.',
  'KBKBBBBBBBBKBBK.',
  'KKBBBBBBBBBBKK..',
  '.KKBBKKKKBBKK...',
  '..KKBBBBBBKK....',
  '..KBBBBBBBBK....',
  '..KBBNNNNBBK....',
  '.KBNNBBBBNNBK...',
  'KBNNBBBBBBNNBK..',
  'KBKBBBBBBBBKBK..',
  '.KKBBBBBBBBKK...',
  '..KKBBBBBBKK....',
  '..KKNNNNNNKK....',
  '.KNNN....NNNK...',
  'KNNN......NNNK..',
  'KNN........NNK..',
  '.KK........KK...',
  '................',
  '................',
  '................',
];

const player_big_jump = [
  '....KKKKKK......',
  '...KRRRRRRR.....',
  '...KRRRRRRR.....',
  '...KKSSsSsSKK...',
  '..SKSKSSSSSSK...',
  '..SKSSKSSSSSK...',
  '..SSKSSSSSSK....',
  '...KSSSSSSK.....',
  '..KKBBKKBBKK....',
  '.KBBBBBBBBBBK...',
  'KBBBNNNNNNBBBK..',
  'KBBNNBBBBNNBBK..',
  'KBBNBBBBBBNBBK..',
  'KKBBBBBBBBBBKK..',
  '.KKBBKKKKBBKK...',
  '..KKBBBBBBKK....',
  '..KBBBBBBBBK....',
  '..KBBBBBBBBK....',
  '..KBBBNNBBBK....',
  '.KBBNNBBNNBBK...',
  'KBKKNNBBNNKKBK..',
  'KBKKNNBBNNKKBK..',
  'KKBBNNNNNNBBKK..',
  '.KKNNNNNNNNKK...',
  '..KNNNN..NNNK...',
  '.KNNNNN..NNNNK..',
  '.KNNNN....NNNK..',
  'KNNNNN....NNNNK.',
  'KNNNNN....NNNNK.',
  'KKNNN......NNKK.',
  '.KKK........KKK.',
  '................',
];

const player_big_crouch = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....KKKKKK......',
  '...KRRRRRRR.....',
  '...KRRRRRRR.....',
  '...KKSSsSsSKK...',
  '..SKSKSSSSSSK...',
  '..SKSSKSSSSSK...',
  '..SSKSSSSSSK....',
  '...KSSSSSSK.....',
  '.KKBBKKKKBBKK...',
  'KBBBBBBBBBBBBK..',
  'KBBBNNNNNNBBBK..',
  'KBNNBBBBBBNNBK..',
  'KBNBBBBBBBBNBK..',
  'KKBBBBBBBBBBKK..',
  '.KKKBBBBBBKKK...',
  '..KKBBBBBBKK....',
  '..KBBBNNBBBK....',
  '.KBBNNBBNNBBK...',
  'KBKKNNBBNNKKBK..',
  'KKKNNNNNNNNKKK..',
  '.NNNN....NNNN...',
  '.NNNN....NNNN...',
  'KKKKK....KKKKK..',
  '................',
  '................',
  '................',
];

// ----- Enemies -----

const goomba_a = [
  '....MMMMMM......',
  '...MMmmmmMM.....',
  '..MmmKmmKmmM....',
  '..MmmWKmWKmM....',
  '..MmmWWmWWmM....',
  '..MmmmmKmmmM....',
  '...MmmmmmmM.....',
  '....MMmmMM......',
  '..nnNNnnNNnn....',
  '.nNNNnnnnNNNn...',
  'nnnnKKKKKKnnnn..',
  '..KKKKKKKKKK....',
  '.NNNK....KNNN...',
  '.NNN......NNN...',
  '................',
  '................',
];

const goomba_b = [
  '....MMMMMM......',
  '...MMmmmmMM.....',
  '..MmmKmmKmmM....',
  '..MmmWKmWKmM....',
  '..MmmWWmWWmM....',
  '..MmmmmKmmmM....',
  '...MmmmmmmM.....',
  '....MMmmMM......',
  '...NNnnnnNN.....',
  '..NNNnnnnNNN....',
  '..nnKKKKKKnn....',
  '.NNKKKKKKKKNN...',
  'NN..K....K..NN..',
  'N....NN..N...N..',
  '................',
  '................',
];

const goomba_squish = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....MMMMMM......',
  '...MMmmmmMM.....',
  '..MmmKmmKmmM....',
  '..MmmWKmWKmM....',
  '..MmmmmKmmmM....',
  '..MmmmmmmmmM....',
  '...MMMmmMMM.....',
  '.NNNNNNNNNNNN...',
  '................',
  '................',
];

// koopa walker, 16x24
const koopa_a = [
  '................',
  '.....YYYYY......',
  '....YYYYYYY.....',
  '....YKKWWKWY....',
  '....YKWKWWKY....',
  '....YKWWWWKY....',
  '.....YKKKKY.....',
  '....YYYYY.......',
  '..LLLLLLLLLL....',
  '.LllLLLLLLLLL...',
  'LLLLLlllLLLLLL..',
  'LLLLLLLLLLlLLL..',
  'LLLLLLLLLLLlLL..',
  'LLLLLlllLLLLLL..',
  'LLLLLLLLLLLLLL..',
  '.LLLLLLLLLLLL...',
  '..LLLLLLLLLL....',
  '...LLLLLLLL.....',
  '....KKKKKK......',
  '...KK....KK.....',
  '...K......K.....',
  '..NN......NN....',
  '..NNN....NNN....',
  '..NN......NN....',
];

const koopa_b = [
  '................',
  '.....YYYYY......',
  '....YYYYYYY.....',
  '....YKKWWKWY....',
  '....YKWKWWKY....',
  '....YKWWWWKY....',
  '.....YKKKKY.....',
  '....YYYYY.......',
  '..LLLLLLLLLL....',
  '.LllLLLLLLLLL...',
  'LLLLLlllLLLLLL..',
  'LLLLLLLLLLlLLL..',
  'LLLLLLLLLLLlLL..',
  'LLLLLlllLLLLLL..',
  'LLLLLLLLLLLLLL..',
  '.LLLLLLLLLLLL...',
  '..LLLLLLLLLL....',
  '...LLLLLLLL.....',
  '...KK....KK.....',
  '..KK......KK....',
  '.NN........NN...',
  '.NNN......NNN...',
  '.NN........NN...',
  '................',
];

const koopa_shell = [
  '................',
  '................',
  '................',
  '................',
  '....YYYYYY......',
  '...YYYYYYYY.....',
  '..LLLLLLLLLL....',
  '.LllLLLLLLLLL...',
  'LLLLLlllLLLLLL..',
  'LLLLLLLLLLlLLL..',
  'LLLLLLLLLLLlLL..',
  'LLLLLlllLLLLLL..',
  'LLLLLLLLLLLLLL..',
  '.LLLLLLLLLLLL...',
  '..LLLLLLLLLL....',
  '...YYYYYYYY.....',
];

// ----- Tiles (16x16) -----

const tile_ground = [
  'OOOOOOOOOOOOOOOO',
  'OoEoooEoooEoooEo',
  'oOoOOOOoOOOOOoOO',
  'OOoOOoOOoOOoOOoO',
  'OoOOOOOoOOOOOOoO',
  'oOOoOOOOOoOOOOOO',
  'OOoOOoOOOOOOoOOO',
  'OoOOOOOoOOOOoOoO',
  'OOOOoOOOoOOoOOOO',
  'OoOoOOOOoOOOOOoO',
  'OOoOOOOoOOOoOOOo',
  'oOOOoOOOoOOOOOOO',
  'OoOOOOOoOOOOoOOO',
  'OOoOOOOOoOOOOoOO',
  'OoOOoOOoOOoOoOOo',
  'oOOOoOOoOOoOOOoO',
];

const tile_brick = [
  'OOOOOOOOOOOOOOOO',
  'OEEEEEEEEEEEEEEO',
  'OEEOOOOOEEEEEEEO',
  'OEEEEEEEEEEEEEEO',
  'OEEEEEEEEEEEEEEO',
  'OEEEEEEEEEEEEEEO',
  'OOOOOOOOOOOOOOOO',
  'OEEEEEEEEEEEEEEO',
  'OEEEEEEEOOOOEEEO',
  'OEEEEEEEEEEEEEEO',
  'OEEEEEEEEEEEEEEO',
  'OEEEEEEEEEEEEEEO',
  'OOOOOOOOOOOOOOOO',
  'OEEEEEEEEEEEEEEO',
  'OEEEEEEEEEEEEEEO',
  'OOOOOOOOOOOOOOOO',
];

const tile_question = [
  'KKKKKKKKKKKKKKKK',
  'KGGGGGGGGGGGGGGK',
  'KGGGGgggggGGGGGK',
  'KGGgggKKKgggGGGK',
  'KGGggKKKKKggGGGK',
  'KGGgKK..KKgGGGGK',
  'KGGGGG..KKgGGGGK',
  'KGGGGgKKKgGGGGGK',
  'KGGGGgKKgGGGGGGK',
  'KGGGGgKKgGGGGGGK',
  'KGGGGGGGGGGGGGGK',
  'KGGGGgKKgGGGGGGK',
  'KGGGGGKKGGGGGGGK',
  'KGGGGGGGGGGGGGGK',
  'KGGGGGGGGGGGGGGK',
  'KKKKKKKKKKKKKKKK',
];

const tile_question_used = [
  'KKKKKKKKKKKKKKKK',
  'KoooooooooooooooK'.slice(0, 16),
  'KooEEEEEEEEEEEEK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoEEEEEEEEEEEEoK',
  'KoooooooooooooKK'.slice(0, 16),
  'KKKKKKKKKKKKKKKK',
];

// pipe — built from 4 tiles (TL, TR, BL, BR), but for simplicity here a single
// repeating "pipe-top-half" and "pipe-body". The level builder will tile them
// as 2-wide pipes.
const tile_pipe_top_l = [
  'pppppppppppppppp',
  'pPPPPPPPPPPPPPPp',
  'pPHHHHHHHHHHHHPp',
  'pPHPPPPPPPPPPPPp',
  'pPHPpppppppppppp',
  'pPHPpPPPPPPPPPPP',
  'pPHPpPHHHHHHHHHH',
  'pPHPpPHPPPPPPPPP',
  'pPHPpPHPpppppppp',
  'pPHPpPHPpPPPPPPP',
  'pPHPpPHPpPHHHHHH',
  'pPHPpPHPpPHPPPPP',
  'pPHPpPHPpPHPpppp',
  'pPHPpPHPpPHPpPPP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
];

const tile_pipe_top_r = [
  'pppppppppppppppp',
  'pPPPPPPPPPPPPPPp',
  'pPPPPPPPPPPPPPPp',
  'pPPPPPPPPPPPPPPp',
  'pppppppppppppppp',
  'PPPPPPPPPPPPPPPp',
  'HHHHHHHHHHHHHHPp',
  'PPPPPPPPPPPPPPPp',
  'pppppppppppppppp',
  'PPPPPPPPPPPPPPPp',
  'HHHHHHHHHHHHHHPp',
  'PPPPPPPPPPPPPPPp',
  'pppppppppppppppp',
  'PPPPPPPPPPPPPPPp',
  'HHHHHHHHHHHHHHPp',
  'PPPPPPPPPPPPPPPp',
];

const tile_pipe_body_l = [
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
  'pPHPpPHPpPHPpPHP',
];

const tile_pipe_body_r = [
  'PPPPPPPPPPPPPPPp',
  'HHHHHHHHHHHHHHPp',
  'PPPPPPPPPPPPPPPp',
  'pppppppppppppppp',
  'PPPPPPPPPPPPPPPp',
  'HHHHHHHHHHHHHHPp',
  'PPPPPPPPPPPPPPPp',
  'pppppppppppppppp',
  'PPPPPPPPPPPPPPPp',
  'HHHHHHHHHHHHHHPp',
  'PPPPPPPPPPPPPPPp',
  'pppppppppppppppp',
  'PPPPPPPPPPPPPPPp',
  'HHHHHHHHHHHHHHPp',
  'PPPPPPPPPPPPPPPp',
  'pppppppppppppppp',
];

// hill (decoration in BG) — 32x16 (use two halves)
const hill_chunk = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...........QQQQQ',
  '..........QQQQQQ',
  '.........QQQqQQQ',
  '........QQQQQQQQ',
  '.......QQQQQqQQQ',
  '......QQQqQQQQQQ',
  '.....QQQQQQQQQQQ',
  '....QQQQQQQQQQQQ',
  '...QQQQQQQQQQQQQ',
];

const cloud_chunk = [
  '.......CCCC.....',
  '....CCCCCCCCC...',
  '..CCCCCCCCCCCCC.',
  '.CCCCcCCCCCCCCCC',
  '.CCCCCCCCCCCCCCC',
  '..CCCCCCCCCCCCC.',
  '...CCCCCCCCCCC..',
  '......CCCCC.....',
];

// coin (12x16 in a 16x16 cell)
const coin_a = [
  '......GGGG......',
  '....GGggggGG....',
  '...GGgGGGGgGG...',
  '..GGgGGggGGgGG..',
  '..GgGGggGGGGgG..',
  '..GgGGggGGGGgG..',
  '..GgGGggGGGGgG..',
  '..GgGGggGGGGgG..',
  '..GgGGggGGGGgG..',
  '..GgGGggGGGGgG..',
  '..GgGGggGGGGgG..',
  '..GgGGggGGGGgG..',
  '..GGgGGggGGgGG..',
  '...GGgGGGGgGG...',
  '....GGggggGG....',
  '......GGGG......',
];

const coin_b = [
  '.......GGG......',
  '......GGgGG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GgGgG.....',
  '......GGgGG.....',
  '.......GGG......',
];

// mushroom
const mushroom = [
  '...KKKKKKKKKK...',
  '..KFFFFFFFFFFK..',
  '.KFFWWFFFFWWFFK.',
  'KFWWWWFFFFWWWWFK',
  'KFWWWWFFFFWWWWFK',
  'KFFFFFWWWWFFFFFK',
  'KFFFWWWWWWWWFFFK',
  'KFFWWWWWWWWWWFFK',
  '.KKWWWWWWWWWWKK.',
  '...KSSSSSSSSK...',
  '..KSSKSSSSKSSK..',
  '..KSSKWWWWKSSK..',
  '..KSSKWWWWKSSK..',
  '..KSSKKKKKKSSK..',
  '...KSSSSSSSSK...',
  '....KKKKKKKK....',
];

// fire flower
const flower = [
  '.....KKKKKK.....',
  '....KFFFFFFK....',
  '...KFFKKKKFFK...',
  '..KFFKxxxxKFFK..',
  '.KFFKxxxxxxKFFK.',
  '.KFFKxxKKxxKFFK.',
  '.KFFKxKxxKxKFFK.',
  '.KFFKxxKKxxKFFK.',
  '.KFFKxxxxxxKFFK.',
  '..KFFKxxxxKFFK..',
  '...KFFKKKKFFK...',
  '....KGGGGGGK....',
  '....KQqQqQqK....',
  '....KqQqQqQK....',
  '....KQqQqQqK....',
  '.....KKKKKK.....',
];

const fireball = [
  '..XX..',
  '.XxxX.',
  'XxxxxX',
  'XxxxxX',
  '.XxxX.',
  '..XX..',
];

// flagpole pieces
const flag_top = [
  '.......QQ.......',
  '......QQQQ......',
  '.....QQqQQQ.....',
  '....QQqqQqQQ....',
  '.....QQQQQQ.....',
  '......QQQQ......',
  '.......JJ.......',
  '.......JJ.......',
];

const flag_pole = [
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
  '.......JJ.......',
];

const flag_cloth = [
  '...........',
  '.QQQQQQQ...',
  '.QQQQQQQQ..',
  '.QQQQQQQQQ.',
  '.QQQQQQQQQQ',
  '.QQQQQQQQQ.',
  '.QQQQQQQQ..',
  '.QQQQQQQ...',
];

export const SPRITES = {};

let baked = false;
export function bakeSprites() {
  if (baked) return;
  baked = true;
  SPRITES.playerSmallIdle      = bake(player_small_idle);
  SPRITES.playerSmallRun       = bake(player_small_run);
  SPRITES.playerSmallJump      = bake(player_small_jump);
  SPRITES.playerSmallCrouch    = bake(player_small_crouch);
  SPRITES.playerBigIdle        = bake(player_big_idle);
  SPRITES.playerBigRun         = bake(player_big_run);
  SPRITES.playerBigJump        = bake(player_big_jump);
  SPRITES.playerBigCrouch      = bake(player_big_crouch);

  // mirrored copies for facing left
  SPRITES.playerSmallIdleL     = flipH(SPRITES.playerSmallIdle);
  SPRITES.playerSmallRunL      = flipH(SPRITES.playerSmallRun);
  SPRITES.playerSmallJumpL     = flipH(SPRITES.playerSmallJump);
  SPRITES.playerSmallCrouchL   = flipH(SPRITES.playerSmallCrouch);
  SPRITES.playerBigIdleL       = flipH(SPRITES.playerBigIdle);
  SPRITES.playerBigRunL        = flipH(SPRITES.playerBigRun);
  SPRITES.playerBigJumpL       = flipH(SPRITES.playerBigJump);
  SPRITES.playerBigCrouchL     = flipH(SPRITES.playerBigCrouch);

  SPRITES.goombaA              = bake(goomba_a);
  SPRITES.goombaB              = bake(goomba_b);
  SPRITES.goombaSquish         = bake(goomba_squish);

  SPRITES.koopaA               = bake(koopa_a);
  SPRITES.koopaB               = bake(koopa_b);
  SPRITES.koopaShell           = bake(koopa_shell);

  SPRITES.tileGround           = bake(tile_ground);
  SPRITES.tileBrick            = bake(tile_brick);
  SPRITES.tileQuestion         = bake(tile_question);
  SPRITES.tileQuestionUsed     = bake(tile_question_used);

  SPRITES.tilePipeTopL         = bake(tile_pipe_top_l);
  SPRITES.tilePipeTopR         = bake(tile_pipe_top_r);
  SPRITES.tilePipeBodyL        = bake(tile_pipe_body_l);
  SPRITES.tilePipeBodyR        = bake(tile_pipe_body_r);

  SPRITES.hill                 = bake(hill_chunk, 1);
  SPRITES.cloud                = bake(cloud_chunk, 1);

  SPRITES.coinA                = bake(coin_a);
  SPRITES.coinB                = bake(coin_b);

  SPRITES.mushroom             = bake(mushroom);
  SPRITES.flower               = bake(flower);
  SPRITES.fireball             = bake(fireball);

  SPRITES.flagTop              = bake(flag_top);
  SPRITES.flagPole             = bake(flag_pole);
  SPRITES.flagCloth            = bake(flag_cloth);
}
