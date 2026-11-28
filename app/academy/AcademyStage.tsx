import Image from "next/image";
import { Montserrat, Nanum_Brush_Script, Noto_Serif_KR } from "next/font/google";
import AcademyIntro from "./AcademyIntro";
import { INTRO_SEEN_KEY as SEEN_KEY } from "./introKey";
import TornBand from "./TornBand";
import styles from "./academy-stage.module.css";

const display = Montserrat({ subsets: ["latin"], weight: "800", display: "swap" });
const brush = Nanum_Brush_Script({ weight: "400", display: "swap", preload: false });
/* Only the two hanja glyphs' unicode-range slice is downloaded */
const seal = Noto_Serif_KR({ weight: "900", display: "swap", preload: false });

/* Red seal stamp (落款) with 技術 — rough edges and ink gaps via an SVG filter */
function SealStamp({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <filter id="seal-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.45" result="holes" />
          <feComposite in="rough" in2="holes" operator="in" />
        </filter>
      </defs>
      <g filter="url(#seal-ink)">
        <rect x="6" y="6" width="88" height="88" rx="9" fill="#d8262b" />
        <rect x="13" y="13" width="74" height="74" rx="5" fill="none" stroke="#fff" strokeWidth="2.4" />
        <text x="50" y="48" textAnchor="middle" fill="#fff" fontSize="36" style={{ fontFamily: seal.style.fontFamily, fontWeight: 900 }}>技</text>
        <text x="50" y="81" textAnchor="middle" fill="#fff" fontSize="36" style={{ fontFamily: seal.style.fontFamily, fontWeight: 900 }}>術</text>
      </g>
    </svg>
  );
}

const TOP_LINE = "TECHNIQUE. BUSINESS. ";
const BOTTOM_LINE = "BUSINESS. TECHNIQUE. ";

function Marquee({ text, className }: { text: string; className: string }) {
  return (
    <div className={`${styles.word} ${className} ${display.className}`} aria-hidden="true">
      <div className={styles.wordTrack}>
        <span>{text.repeat(2)}</span>
        <span>{text.repeat(2)}</span>
      </div>
    </div>
  );
}

export default function AcademyStage() {
  return (
    <>
      <AcademyIntro>
        <p className={`${styles.introFirst} ${brush.className}`}>
          <span>기술은</span>
          <span>배신하지 않는다.</span>
        </p>
        <div className={styles.introBandWrap}>
          <TornBand className={styles.introBand} />
          <p className={`${styles.introSecond} ${brush.className}`}>
            <span>처음이어도,</span>
            <span>괜찮습니다.</span>
          </p>
        </div>
      </AcademyIntro>
      {/* Hide the intro before first paint on repeat visits (rendered from the server so it runs during HTML parsing) */}
      <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("${SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.getElementById("gisal-intro").dataset.off=""}catch(e){}` }} />

      <section className={styles.stage} data-service-section="intro_stage" aria-labelledby="academy-stage-copy">
        <Marquee text={TOP_LINE} className={styles.wordTop} />
        <Marquee text={BOTTOM_LINE} className={styles.wordBottom} />

        <div className={styles.stageInner}>
        <TornBand className={styles.band} />

        <div className={styles.people} aria-hidden="true">
          <Image className={styles.personBack} src="/gisal-assets/restory-second-cutout-v2.png" width={1060} height={1484} alt="" sizes="(max-width: 760px) 50vw, 30vw" priority />
          <Image className={styles.personMain} src="/gisal-assets/restory-field-cutout-v2.png" width={1600} height={1589} alt="" sizes="(max-width: 760px) 90vw, 46vw" priority />
        </div>

        <h1 id="academy-stage-copy" className={`${styles.copy} ${brush.className}`}>
          <SealStamp className={styles.seal} />
          <span>기술로 노동하세요?</span>
          <span className={styles.copyIndent}>사업하세요?</span>
        </h1>

        <a className={styles.scroll} href="#five-years">SCROLL</a>
        </div>
      </section>
    </>
  );
}
