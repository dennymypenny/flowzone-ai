/**
 * The generative field.
 *
 * Every work session grows its own piece of moving artwork. It is not a stock
 * loop and it is not decoration bolted on: the seed comes from what the visitor
 * has actually typed, so two people never get the same image, and the palette
 * they pick drives the colour. Answer another question and the field visibly
 * changes, which is the whole point. Their idea is generating something.
 *
 * Deliberately plain maths and plain canvas. No library, no WebGL, no model
 * call, nothing to fail on a slow phone or an offline train.
 */

export type FieldColors = { bg: string; a: string; b: string; ink: string };

/** Stable 32 bit hash so the same answers always regrow the same field. */
export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Small deterministic PRNG. Same seed, same artwork, every time. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Particle = { x: number; y: number; px: number; py: number; vx: number; vy: number; c: string; life: number };

/**
 * The angle field. Three offset waves crossing each other, which gives the
 * long sweeping currents rather than the noisy static a single wave produces.
 * `warp` is driven by how far through the session the visitor is, so the
 * currents genuinely reorganise as they answer.
 */
export function fieldAngle(x: number, y: number, t: number, warp: number): number {
  return (
    (Math.sin(x * 0.0075 + t) +
      Math.cos(y * 0.0091 - t * 0.7) +
      Math.sin((x + y) * 0.0045 + t * 1.25 + warp * 2.2)) *
    Math.PI
  );
}

export function seedParticles(
  count: number,
  w: number,
  h: number,
  rand: () => number,
  colors: FieldColors
): Particle[] {
  const palette = [colors.a, colors.a, colors.b, colors.b, colors.ink];
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    out.push({
      x,
      y,
      px: x,
      py: y,
      vx: 0,
      vy: 0,
      c: palette[Math.floor(rand() * palette.length)],
      life: rand() * 220,
    });
  }
  return out;
}

/** Advance and draw one frame. Returns nothing, mutates the particles. */
export function stepField(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  t: number,
  warp: number,
  rand: () => number,
  opts: { alpha?: number; width?: number } = {}
) {
  const alpha = opts.alpha ?? 0.5;
  ctx.lineWidth = opts.width ?? 1;
  ctx.globalAlpha = alpha;

  for (const p of particles) {
    const a = fieldAngle(p.x, p.y, t, warp);
    p.vx = p.vx * 0.86 + Math.cos(a) * 0.36;
    p.vy = p.vy * 0.86 + Math.sin(a) * 0.36;
    p.px = p.x;
    p.py = p.y;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    // Respawn off-screen or expired particles so the field never thins out.
    if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
      p.x = rand() * w;
      p.y = rand() * h;
      p.px = p.x;
      p.py = p.y;
      p.vx = 0;
      p.vy = 0;
      p.life = 120 + rand() * 220;
      continue;
    }

    ctx.strokeStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(p.px, p.py);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * Draw a finished still of the field. Used for the downloadable brief, so the
 * document someone keeps carries the same artwork their session grew.
 */
export function renderStill(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  colors: FieldColors,
  warp: number,
  frames = 190
) {
  const rand = mulberry32(seed);
  ctx.save();
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, w, h);
  const particles = seedParticles(Math.round((w * h) / 2600), w, h, rand, colors);
  for (let f = 0; f < frames; f++) {
    stepField(ctx, particles, w, h, f * 0.006, warp, rand, { alpha: 0.28, width: 1.1 });
  }
  ctx.restore();
}
