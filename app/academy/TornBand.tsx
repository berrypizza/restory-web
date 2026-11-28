/* Deterministic torn-paper brush band (same shape on server and client). */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1600;
const H = 800;
const rand = seeded(20261128);

function tornEdge(from: number, to: number, side: 1 | -1) {
  const points: string[] = [];
  let drift = 0;
  for (let x = -40; x <= W + 40; x += 7) {
    drift = (drift + (rand() - 0.5) * 9) * 0.86;
    const spike = rand() < 0.06 ? side * (8 + rand() * 30) : 0;
    const base = from + ((to - from) * (x + 40)) / (W + 80);
    points.push(`${x},${(base + drift + spike).toFixed(1)}`);
  }
  return points;
}

function specks(count: number, from: number, to: number, spread: number) {
  return Array.from({ length: count }, () => {
    const x = rand() * W;
    const base = from + ((to - from) * x) / W;
    return { x: x.toFixed(1), y: (base + (rand() - 0.5) * spread).toFixed(1), r: 0.8 + rand() * rand() * 7 };
  });
}

const top = tornEdge(250, 70, -1);
const bottom = tornEdge(700, 560, 1).reverse();
const bandPath = `M${top.join("L")}L${bottom.join("L")}Z`;
const whiteSpecks = [...specks(70, 250, 70, 70), ...specks(90, 700, 560, 80)];
const inkSpecks = [...specks(40, 270, 90, 40), ...specks(60, 680, 545, 50)];

export default function TornBand({ className, paper = "#fbfbf8", ink = "var(--stage-blue)" }: { className?: string; paper?: string; ink?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={bandPath} fill={paper} />
      {whiteSpecks.map((s, i) => <circle key={`w${i}`} cx={s.x} cy={s.y} r={s.r.toFixed(1)} fill={paper} />)}
      {inkSpecks.map((s, i) => <circle key={`b${i}`} cx={s.x} cy={s.y} r={(s.r * 0.7).toFixed(1)} fill={ink} />)}
    </svg>
  );
}
