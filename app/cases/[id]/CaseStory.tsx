import s from "../cases.module.css";

const headings = new Set(["작업 전 상태", "확인한 원인", "작업 과정과 변화", "비슷한 상태라면", "확인한 부분", "확인할 부분", "작업 과정", "작업 후 상태", "수리 전 상태", "작업 방향"]);

export default function CaseStory({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/).map(block => block.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
  function render(block: string, index: number) {
    return headings.has(block) ? <h3 key={index}>{block}</h3> : <p key={index}>{block}</p>;
  }
  if (blocks.length <= 4) return <div className={s.prose}>{blocks.map(render)}</div>;
  let cut = headings.has(blocks[0]) ? 2 : 3;
  if (headings.has(blocks[cut - 1])) cut--;
  return <div className={s.prose}>
    {blocks.slice(0, cut).map(render)}
    <details className={s.moreStory}>
      <summary><span className={s.moreText}>작업 내용 더 보기</span><span className={s.lessText}>작업 내용 접기</span></summary>
      {blocks.slice(cut).map(render)}
    </details>
  </div>;
}
