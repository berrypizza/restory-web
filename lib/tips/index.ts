/* ═══════════════════════════════════════════
   꿀팁 자동 수집 & 내보내기

   ✅ 새 글 추가하는 법:
   1. lib/tips/ 폴더에 새 .ts 파일 생성 (예: sofa-self-check.ts)
   2. 아래 import 목록에 추가
   3. tipModules 배열에 추가
   4. 끝!
   ═══════════════════════════════════════════ */

// 타입 & 카테고리 재export
export { TIP_CATEGORIES } from "./types";
export type { Tip, TipCategory } from "./types";

// ── 각 글 import ──────────────────────────
// 새 글 추가 시 여기에 한 줄 추가
import sangbujangRepairVsReplace from "./contents/sangbujang-repair-vs-replace";
import sinkDoorReplaceVsFullKitchenReplace from "./contents/sink-door-replace-vs-full-kitchen-replace";
import chairReupholsteryVsBuyNew from "./contents/chair-reupholstery-vs-buy-new";
import sofaRestorationVsBuyNew from "./contents/sofa-restoration-vs-buy-new";
import kitchendoormeasureguide from "./contents/kitchen-door-measure-guide";
import sangbujangpbvsplywood from "./contents/sangbujang-pb-vs-plywood";
import koreanvschineseleatherquality from "./contents/korean-vs-chinese-leather-quality";
import sinkDoorReplacementCostPetHighgloss from "./contents/sink-door-replacement-cost-pet-highgloss";
// import sofaSelfCheck from "./sofa-self-check";
// import chairReplaceTiming from "./chair-replace-timing";
// import doorReformGuide from "./door-reform-guide";
// ... 새 글 import 추가

// ── 모아서 export ─────────────────────────
// 새 글 추가 시 여기에도 한 줄 추가
const tipModules = [
  sangbujangRepairVsReplace,
  sinkDoorReplaceVsFullKitchenReplace,
  chairReupholsteryVsBuyNew,
  sofaRestorationVsBuyNew,
  kitchendoormeasureguide,
  sangbujangpbvsplywood,
  koreanvschineseleatherquality,
  sinkDoorReplacementCostPetHighgloss,

  // sofaSelfCheck,
  // chairReplaceTiming,
  // doorReformGuide,
  // ... 새 글 추가
];

// 최신순 정렬 후 export
export const tips = tipModules.sort((a, b) =>
  b.createdAt.localeCompare(a.createdAt),
);
