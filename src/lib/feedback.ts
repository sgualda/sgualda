/**
 * Two reactions for the moment a form or a check returns its answer.
 *
 * The site is monochrome, so the celebration is too — coloured confetti would
 * be the one place the palette breaks, and it would read as a stock library
 * rather than part of the product.
 *
 * Both are canvas rather than DOM nodes: a hundred absolutely positioned
 * elements animating at once is the kind of thing that stutters on a mid-range
 * phone, which is where most of this will be seen.
 */

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function surface() {
  const c = document.createElement('canvas');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  Object.assign(c.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '90',
  });
  document.body.appendChild(c);
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return { c, ctx };
}

const ink = ['#1e1c1c', '#4a4a4a', '#6b6b6b', '#a8a8a8', '#d4d4d4'];

/**
 * Positive answer. A burst from the element that produced it, so the reaction
 * is attached to the thing the person just did rather than to the whole page.
 */
export function celebrate(from?: Element | null) {
  if (reduced()) return;

  const { c, ctx } = surface();
  const box = from?.getBoundingClientRect();
  const ox = box ? box.left + box.width / 2 : innerWidth / 2;
  const oy = box ? box.top + Math.min(box.height / 2, 160) : innerHeight / 3;

  const bits = Array.from({ length: 90 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const speed = 7 + Math.random() * 11;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 4 + Math.random() * 5,
      h: 7 + Math.random() * 7,
      spin: (Math.random() - 0.5) * 0.4,
      rot: Math.random() * Math.PI,
      fill: ink[(Math.random() * ink.length) | 0],
      life: 1,
    };
  });

  let raf = 0;
  const tick = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = false;

    for (const b of bits) {
      b.vy += 0.34;          // gravity
      b.vx *= 0.99;          // drag
      b.x += b.vx;
      b.y += b.vy;
      b.rot += b.spin;
      if (b.y > innerHeight * 0.62) b.life -= 0.022;
      if (b.life <= 0) continue;
      alive = true;

      ctx.save();
      ctx.globalAlpha = Math.max(0, b.life);
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.fillStyle = b.fill;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }

    if (alive) raf = requestAnimationFrame(tick);
    else { cancelAnimationFrame(raf); c.remove(); }
  };
  raf = requestAnimationFrame(tick);
}

/**
 * Negative answer. The opposite gesture: nothing bursts, everything drifts
 * down and settles. It marks the moment without pretending it is good news,
 * which matters on a site whose whole argument is that a straight no is worth
 * more than an encouraging maybe.
 */
export function settle(from?: Element | null) {
  if (reduced()) return;

  const { c, ctx } = surface();
  const box = from?.getBoundingClientRect();
  const top = box ? box.top : innerHeight / 4;
  const left = box ? box.left : innerWidth / 4;
  const width = box ? box.width : innerWidth / 2;
  const floor = box ? box.top + box.height : innerHeight * 0.8;

  const motes = Array.from({ length: 46 }, () => ({
    x: left + Math.random() * width,
    y: top - Math.random() * 40,
    vy: 0.35 + Math.random() * 0.7,
    drift: (Math.random() - 0.5) * 0.35,
    phase: Math.random() * Math.PI * 2,
    r: 1.2 + Math.random() * 2.2,
    life: 0.55 + Math.random() * 0.45,
  }));

  let raf = 0;
  let t = 0;
  const tick = () => {
    t += 0.02;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = false;

    for (const m of motes) {
      m.y += m.vy;
      m.x += Math.sin(t + m.phase) * m.drift;
      if (m.y > floor) m.life -= 0.03;
      if (m.life <= 0) continue;
      alive = true;

      ctx.globalAlpha = Math.max(0, m.life) * 0.5;
      ctx.fillStyle = '#6b6b6b';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (alive) raf = requestAnimationFrame(tick);
    else { cancelAnimationFrame(raf); c.remove(); }
  };
  raf = requestAnimationFrame(tick);
}
