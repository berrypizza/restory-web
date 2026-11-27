// Restory 프리미엄 랜딩 히어로 제목용 글자 채움 텍스처 3장 생성 (외부 의존성 없음)
// 사용: node textfill.mjs <출력폴더>  → text-fill-1.png ~ text-fill-3.png (1200×360)
// 오른쪽 위(진함) → 왼쪽 아래(밝음) 대각선 그라데이션 + 살짝 기울어진 붓결 + 큰 색 얼룩 + 미세 그레인
// 색을 바꾸려면 LINES 배열의 stops/accent/warm 값을 수정

import fs from "node:fs";
import zlib from "node:zlib";

const W = 1200, H = 360;
const outDir = process.argv[2];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function ramp(stops, t) {
  t = clamp(t) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(t));
  return mix(stops[i], stops[i + 1], smooth(t - i));
}

// 1D 값 노이즈 (부드러움)
function noise1D(n) {
  const v = Array.from({ length: n + 2 }, rnd);
  return (x) => {
    const i = Math.floor(x), f = x - i;
    return v[i % (n + 1)] + (v[(i + 1) % (n + 1)] - v[i % (n + 1)]) * smooth(f);
  };
}

function png(w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w * 3; x++) raw[y * (w * 3 + 1) + 1 + x] = clamp(Math.round(rgb[y * w * 3 + x]), 0, 255);
  const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b) => { let c = -1; for (const v of b) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ih), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

// stops: 어두운 → 밝은, accent: 오른쪽 위에 스며드는 색, warm: 왼쪽 아래에 스며드는 색
const LINES = [
  { stops: ["#142266", "#22339a", "#2741b8", "#3563df", "#4a80f0"], accent: "#3a2a8c", warm: "#3f8cff", slant: -0.05 },
  { stops: ["#1a3cc0", "#2553e0", "#2f6cf4", "#4a8fff", "#63a9ff"], accent: "#2b3fc8", warm: "#3fb3ff", slant: 0.04 },
  { stops: ["#2e6ff0", "#3f88ff", "#5ea6ff", "#82c3ff", "#a8d9ff"], accent: "#3570ee", warm: "#7fe0ff", slant: 0.05 },
];

LINES.forEach((L, li) => {
  seed = 101 + li * 313;
  const stops = L.stops.map(hex), accent = hex(L.accent), warm = hex(L.warm);
  const streakA = noise1D(24), streakB = noise1D(60), along = noise1D(8);
  const blobs = Array.from({ length: 4 }, () => ({ x: rnd() * W, y: rnd() * H, r: 260 + rnd() * 360, k: (rnd() - 0.5) * 0.35 }));
  const out = new Float32Array(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const nx = x / W, ny = y / H;
    // 대각선 축: 오른쪽 위 0 → 왼쪽 아래 1 (가로가 길어 세로 비중을 조금 더)
    let t = 0.32 * ny + 0.68 * (1 - nx) - 0.05;
    for (const b of blobs) {
      const d = Math.hypot(x - b.x, (y - b.y) * 2.2) / b.r;
      t += b.k * Math.exp(-d * d);
    }
    // 기울어진 붓결: 회전 좌표의 세로값으로 줄무늬, 가로로 천천히 강약 변화
    const yr = y + (x - W / 2) * L.slant;
    const s = (streakA(clamp(yr / H, 0, 0.999) * 24) - 0.5) * 0.075 + (streakB(clamp(yr / H, 0, 0.999) * 60) - 0.5) * 0.02;
    t += s * (0.6 + along(nx * 8) * 0.8);
    let c = ramp(stops, t);
    // 색 스며듦: 오른쪽 위 accent, 왼쪽 아래 warm
    c = mix(c, accent, clamp((nx - 0.55) * 1.6) * clamp(1 - ny * 1.6) * 0.55);
    c = mix(c, warm, clamp((0.45 - nx) * 1.8) * clamp((ny - 0.45) * 1.8) * 0.45);
    const g = (rnd() - 0.5) * 14;
    out.set([c[0] + g, c[1] + g, c[2] + g], (y * W + x) * 3);
  }
  fs.writeFileSync(`${outDir}/text-fill-${li + 1}.png`, png(W, H, out));
});
console.log("ok");
