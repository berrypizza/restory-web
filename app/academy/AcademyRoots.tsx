import { Black_Han_Sans } from "next/font/google";
import { EnrollButton } from "./EnrollmentDialog";
import styles from "./academy-roots.module.css";

const heavy = Black_Han_Sans({ weight: "400", display: "swap", preload: false });

/* ---- Deterministic geometry (rounded so server and client render the same SVG) ---- */
const r2 = (n: number) => Math.round(n * 100) / 100;
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seeded(2026);

const ROOT = { x: 500, y: 830 };
const DEPTH = 5; // 32 branches at the top of the tree
const levelY = (d: number) => ROOT.y - d * 82;
const levelX = (d: number, i: number) => {
  const count = 2 ** d;
  const spread = 120 + d * 120; // the tree widens as it goes up
  return ROOT.x + (count === 1 ? 0 : (i / (count - 1) - 0.5) * spread);
};

type Seg = { d: string; level: number };
const branches: Seg[] = [];
const nodes: { x: number; y: number; level: number }[] = [{ ...ROOT, level: 0 }];
for (let d = 1; d <= DEPTH; d++) {
  for (let i = 0; i < 2 ** d; i++) {
    const px = levelX(d - 1, Math.floor(i / 2));
    const py = levelY(d - 1);
    const cx = levelX(d, i);
    const cy = levelY(d);
    branches.push({ d: `M${r2(px)} ${r2(py)}C${r2(px)} ${r2(py - 46)} ${r2(cx)} ${r2(cy + 40)} ${r2(cx)} ${r2(cy)}`, level: d });
    if (d < DEPTH) nodes.push({ x: r2(cx), y: r2(cy), level: d });
  }
}

/* Each top branch frays into a few hairlines that flow up into the dense bands */
const fray: string[] = [];
const topY = levelY(DEPTH);
for (let i = 0; i < 2 ** DEPTH; i++) {
  const x = levelX(DEPTH, i);
  for (let k = 0; k < 4; k++) {
    const tx = 150 + ((i * 4 + k) / (2 ** DEPTH * 4 - 1)) * 700;
    fray.push(`M${r2(x)} ${r2(topY)}C${r2(x)} ${r2(topY - 30)} ${r2(tx)} ${r2(topY - 20)} ${r2(tx)} ${r2(topY - 64)}`);
  }
}

/* Dense hairline bands — everything we pick up along the way — widening as they rise */
const BANDS = [
  { y: 286, h: 58, x0: 150, x1: 850 },
  { y: 224, h: 58, x0: 110, x1: 890 },
  { y: 162, h: 58, x0: 72, x1: 928 },
  { y: 100, h: 58, x0: 36, x1: 964 },
];
const bandPaths = BANDS.map(band => {
  let d = "";
  const count = Math.round((band.x1 - band.x0) * 0.42);
  for (let n = 0; n < count; n++) {
    const x = r2(band.x0 + rand() * (band.x1 - band.x0));
    const top = r2(band.y + rand() * 10);
    d += `M${x} ${top}V${r2(band.y + band.h)}`;
  }
  return d;
});

/* Left-hand ticks: one generation every 30 years, from distant ancestors down to my parents */
const TICKS = [
  { y: 100, year: 1756, who: "" },
  { y: 162, year: 1786, who: "" },
  { y: 224, year: 1816, who: "" },
  { y: 286, year: 1846, who: "" },
  { y: levelY(5), year: 1876, who: "" },
  { y: levelY(4), year: 1906, who: "고조부모" },
  { y: levelY(3), year: 1936, who: "증조부모" },
  { y: levelY(2), year: 1966, who: "조부모" },
  { y: levelY(1), year: 1996, who: "부모" },
];
const PARENTS = [
  { x: levelX(1, 0), label: "엄마", anchor: "end" as const, dx: -16 },
  { x: levelX(1, 1), label: "아빠", anchor: "start" as const, dx: 16 },
];

/* Generations of ancestors converge, through mom and dad, into one glowing point: me —
   and a business that is mine. */
export default function AcademyRoots() {
  return (
    <section className={styles.section} data-service-section="roots" aria-labelledby="roots-title">
      <div className={styles.dust} aria-hidden="true" />
      <p className={`${styles.gene} ${heavy.className}`}>
        <span>한 사람의 유전자에</span>
        <span>인류 전체의 가능성이 잠자고 있다.</span>
      </p>
      <div className={styles.stage}>
        <svg className={styles.tree} viewBox="0 0 1000 900" aria-hidden="true">
          <defs>
            <radialGradient id="roots-glow">
              <stop offset="0%" stopColor="#fff6dd" />
              <stop offset="28%" stopColor="#ffc46a" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#ff9a2e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff9a2e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="roots-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffd38a" stopOpacity="0" />
              <stop offset="20%" stopColor="#ffd38a" />
              <stop offset="80%" stopColor="#ffd38a" />
              <stop offset="100%" stopColor="#ffd38a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {TICKS.map(tick => (
            <g key={tick.year} className={styles.tick}>
              <line x1="20" x2="36" y1={tick.y} y2={tick.y} />
              <text x="42" y={tick.y + 5}>
                {tick.year}
                {tick.who && <tspan className={styles.who} dx="8">{tick.who}</tspan>}
              </text>
            </g>
          ))}

          <g className={styles.bands}>
            {bandPaths.map((d, i) => <path key={i} d={d} style={{ ["--b" as string]: i }} />)}
          </g>
          <rect className={styles.horizon} x="0" y="99" width="1000" height="2.4" fill="url(#roots-line)" />

          <g className={styles.fray}>
            {fray.map((d, i) => <path key={i} d={d} pathLength={1} />)}
          </g>
          <g className={styles.branches}>
            {branches.map((b, i) => <path key={i} d={b.d} pathLength={1} style={{ ["--l" as string]: b.level }} />)}
          </g>
          <g className={styles.nodes}>
            {nodes.slice(1).map((n, i) => <circle key={i} cx={n.x} cy={n.y} r={3.4} />)}
          </g>

          {PARENTS.map(p => (
            <text key={p.label} className={`${styles.parent} ${heavy.className}`} x={r2(p.x + p.dx)} y={levelY(1) + 7} textAnchor={p.anchor}>{p.label}</text>
          ))}

          <circle className={styles.glow} cx={ROOT.x} cy={ROOT.y} r="70" fill="url(#roots-glow)" />
          <circle cx={ROOT.x} cy={ROOT.y} r="9" fill="#fff8e6" />
          <text className={`${styles.me} ${heavy.className}`} x={ROOT.x} y={ROOT.y + 62} textAnchor="middle">나</text>
        </svg>
      </div>

      <h2 id="roots-title" className={`${styles.copy} ${heavy.className}`}>
        <span>순수하게</span>
        <span>나다운 사업</span>
        <span className={styles.copySub}>지속 가능하고 행복하게</span>
      </h2>
      <EnrollButton location="closing" className={styles.cta} label="기술로 살아남기 1:1 컨설팅 신청하기" />
    </section>
  );
}
