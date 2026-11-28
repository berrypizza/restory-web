import Image from "next/image";
import { Black_Han_Sans } from "next/font/google";
import styles from "./academy-chaos.module.css";

const heavy = Black_Han_Sans({ weight: "400", display: "swap", preload: false });

/* Simplified marks (not official logos) so the tiles read as the three tools */
function GptMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round">
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <rect key={angle} x="24" y="8" width="16" height="30" rx="8" transform={`rotate(${angle} 32 32)`} />
        ))}
      </g>
    </svg>
  );
}

function ClaudeMark() {
  const rays = [26, 20, 24, 18, 25, 21, 26, 19, 23, 20, 25, 18];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g stroke="#d97757" strokeWidth="5.2" strokeLinecap="round">
        {rays.map((len, i) => {
          const a = (i / rays.length) * Math.PI * 2 + 0.2;
          const x = Math.round((32 + Math.cos(a) * len) * 100) / 100;
          const y = Math.round((32 + Math.sin(a) * len) * 100) / 100;
          return <line key={i} x1="32" y1="32" x2={x} y2={y} />;
        })}
      </g>
    </svg>
  );
}

function HiggsMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M16 12v40M48 12v40M16 32h32" stroke="#d7ff3e" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const TOOLS = [
  { key: "gpt", name: "ChatGPT", Mark: GptMark },
  { key: "claude", name: "Claude", Mark: ClaudeMark },
  { key: "higgs", name: "Higgsfield", Mark: HiggsMark },
] as const;

/* AI chaos: a looming devil, then the tools everyone chases get sucked down a vortex,
   and the answer — a business that lasts, in your own way. */
export default function AcademyChaos() {
  return (
    <section className={styles.section} data-service-section="ai_chaos" aria-labelledby="ai-chaos-title">
      <div className={styles.devil} aria-hidden="true">
        <Image src="/gisal-assets/ai-devil.png" alt="" width={1400} height={1400} sizes="(max-width: 760px) 120vw, 900px" />
      </div>

      <h2 id="ai-chaos-title" className={`${styles.chaosTitle} ${heavy.className}`}>
        <span className={styles.bigAI}>AI,</span>
        <span className={styles.chaosLine}>이 혼돈의 시대에</span>
      </h2>

      <div className={styles.flow} aria-hidden="true">
        <svg className={styles.arrow} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M22 4 C 78 18, 82 36, 46 50 S 30 78, 50 92" />
        </svg>
        <div className={styles.vortex} />
        {[0, 1].flatMap(round =>
          TOOLS.map((tool, i) => (
            <div
              key={`${tool.key}-${round}`}
              className={`${styles.tile} ${styles[tool.key]}`}
              style={{ animationDelay: `${-(round * 3 + i) * 1}s` }}
            >
              <tool.Mark />
              <span>{tool.name}</span>
            </div>
          )),
        )}
        <svg className={styles.arrowHead} viewBox="0 0 40 40">
          <path d="M8 14 L20 28 L32 14" />
        </svg>
      </div>

      <p className={`${styles.answer} ${heavy.className}`}>
        <span>나답게 흔들리지 않고</span>
        <span><mark>지속할 수 있는</mark> 사업</span>
      </p>

      {/* Whiteboard sketch, one scene: technician alone (left) vs. technician + AI on a mastermind foundation (right) */}
      <div className={styles.scene}>
        <figure className={styles.sceneFigure}>
          <div className={styles.sceneImage}>
            <Image src="/gisal-assets/tech-versus-v2.png" alt="앞쪽에 AI 로봇과 함께 단단한 돌 기단 위에 당당히 선 기술 사업가, 뒤쪽 멀리 금 간 바닥에서 혼자 지친 기술자" width={1600} height={904} sizes="(max-width: 760px) 100vw, 1040px" />
          </div>
        </figure>
      </div>
    </section>
  );
}
