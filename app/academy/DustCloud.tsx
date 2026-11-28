"use client";

import { useEffect, useRef } from "react";

type Particle = { bx: number; by: number; sx: number; sy: number; r: number; shade: number; a: number; ph: number; sp: number };

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Ridge of the cloud: rises from the lower left toward the centre-right, then falls away */
const ridge = (x: number) => 0.86 - 0.5 * Math.sin(Math.PI * Math.min(1, x * 0.9)) + 0.04 * Math.sin(x * 13);

/* Small value-noise fbm for smoky billows (deterministic) */
function makeNoise(seed: number) {
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const value = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  return (x: number, y: number) => {
    let sum = 0, amp = 0.55, freq = 1, norm = 0;
    for (let o = 0; o < 4; o++) { sum += value(x * freq, y * freq) * amp; norm += amp; amp *= 0.5; freq *= 2.1; }
    return sum / norm;
  };
}

function buildParticles(count: number, w: number, h: number, seed: number) {
  const rand = seeded(seed);
  const noise = makeNoise(7);
  const aspect = w / Math.max(1, h);
  const list: Particle[] = [];
  let guard = 0;
  while (list.length < count && guard++ < count * 12) {
    const x = rand();
    const y = rand();
    const d = y - ridge(x); // > 0 inside the cloud
    const n = noise(x * 3.2 * aspect, y * 3.2);
    const core = 1 / (1 + Math.exp(-d / 0.045));
    const billow = Math.min(1, Math.max(0, (n - 0.28) * 1.9));
    const spray = d < 0 ? Math.exp(d / 0.05) * 0.35 : 0;
    const density = core * (0.15 + 0.85 * billow) + spray * n;
    if (rand() > density) continue;
    const dark = Math.min(1, core * billow * 1.25 + Math.max(0, d) * 0.6);
    list.push({
      bx: x * w,
      by: y * h,
      sx: (rand() - 0.5) * 260,
      sy: (rand() - 0.2) * 220,
      r: 0.7 + rand() * rand() * 1.9,
      shade: Math.round(150 - dark * 135 - rand() * 20),
      a: 0.3 + rand() * 0.65,
      ph: rand() * Math.PI * 2,
      sp: 0.4 + rand() * 0.8,
    });
  }
  return list;
}

/* Animated grey dust cloud (particles assemble when the section scrolls in, then drift) */
export default function DustCloud({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 760px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);

    let w = 0, h = 0, particles: Particle[] = [];
    let raf = 0, running = false, visible = false, start = 0, last = 0;
    // Two dense static layers (drawn once) that drift against each other, so the whole cloud keeps shifting
    const layerA = document.createElement("canvas");
    const layerB = document.createElement("canvas");
    // Ash flakes: born inside the cloud, carried off by the wind, then reborn — the motion never stops
    type Flake = { x: number; y: number; vx: number; vy: number; age: number; life: number; r: number; shade: number; a: number };
    let pool: Particle[] = [];
    let flakes: Flake[] = [];
    const rnd = Math.random;

    const paintLayer = (target: HTMLCanvasElement, count: number, seed: number) => {
      target.width = canvas.width;
      target.height = canvas.height;
      const c = target.getContext("2d")!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const p of buildParticles(count, w, h, seed)) {
        c.globalAlpha = p.a * 0.85;
        c.fillStyle = `rgb(${p.shade},${p.shade},${p.shade})`;
        c.fillRect(p.bx, p.by, p.r, p.r);
      }
    };

    const spawn = (f?: Flake): Flake => {
      const p = pool[(rnd() * pool.length) | 0];
      const flake = f ?? ({} as Flake);
      flake.x = p.bx; flake.y = p.by;
      flake.vx = 18 + rnd() * 55;
      flake.vy = -(6 + rnd() * 30);
      flake.age = 0;
      flake.life = 3 + rnd() * 6;
      flake.r = 0.8 + rnd() * rnd() * 2.2;
      flake.shade = Math.min(150, p.shade + 10);
      flake.a = 0.35 + rnd() * 0.55;
      return flake;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = Math.max(0.45, Math.min(1, (w * h) / (1440 * 860)));
      paintLayer(layerA, Math.round((small ? 45000 : 120000) * density), 41);
      paintLayer(layerB, Math.round((small ? 40000 : 110000) * density), 97);
      particles = buildParticles(Math.round((small ? 2500 : 6000) * density), w, h, 1128);
      pool = buildParticles(Math.round((small ? 6000 : 16000) * density), w, h, 77);
      flakes = Array.from({ length: Math.round((small ? 1800 : 5000) * density) }, () => {
        const f = spawn();
        f.age = rnd() * f.life; // start mid-flight so the wind is already blowing
        return f;
      });
    };

    const draw = (time: number) => {
      // nothing to draw while the canvas has no size (hidden, mid-layout or unmounting)
      if (!w || !h || !layerA.width || !layerB.width) return;
      const t = time / 1000;
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0;
      last = time;
      const assemble = reduced ? 1 : Math.min(1, (time - start) / 1800);
      const ease = 1 - Math.pow(1 - assemble, 3);
      ctx.clearRect(0, 0, w, h);

      // cloud body: two layers sliding slowly against each other
      const ax = reduced ? 0 : Math.sin(t * 0.21) * 14 + (1 - ease) * -40;
      const ay = reduced ? 0 : Math.cos(t * 0.17) * 6 + (1 - ease) * 30;
      const bx = reduced ? 0 : Math.sin(t * 0.13 + 2) * -18;
      const by = reduced ? 0 : Math.cos(t * 0.19 + 1) * 8;
      ctx.globalAlpha = ease * 0.85;
      ctx.drawImage(layerA, ax, ay, w, h);
      ctx.globalAlpha = ease * 0.7;
      ctx.drawImage(layerB, bx, by, w, h);

      // shimmering grains on the surface
      for (const p of particles) {
        const wobbleX = reduced ? 0 : Math.sin(t * 0.5 * p.sp + p.ph) * 8 + Math.sin(t * 0.2 + p.by * 0.01) * 12;
        const wobbleY = reduced ? 0 : Math.cos(t * 0.45 * p.sp + p.ph) * 5;
        ctx.globalAlpha = p.a * (0.3 + 0.7 * ease);
        ctx.fillStyle = `rgb(${p.shade},${p.shade},${p.shade})`;
        ctx.fillRect(p.bx + wobbleX + p.sx * (1 - ease), p.by + wobbleY + p.sy * (1 - ease), p.r, p.r);
      }

      // ash carried off by the wind
      if (!reduced) {
        for (const f of flakes) {
          f.age += dt;
          if (f.age >= f.life || f.x > w + 20 || f.y < -20) { spawn(f); continue; }
          f.x += (f.vx + Math.sin(t * 0.8 + f.y * 0.02) * 22) * dt;
          f.y += (f.vy + Math.cos(t * 0.6 + f.x * 0.015) * 14) * dt;
          const fade = Math.sin(Math.PI * (f.age / f.life));
          ctx.globalAlpha = f.a * fade * ease;
          ctx.fillStyle = `rgb(${f.shade},${f.shade},${f.shade})`;
          ctx.fillRect(f.x, f.y, f.r, f.r);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = 0;
      if (!start) start = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const pause = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    if (reduced) { start = 1; draw(performance.now()); }

    const ro = new ResizeObserver(() => { resize(); if (!running) draw(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reduced) return;
      if (visible) play(); else pause();
    }, { threshold: 0.05 });
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
