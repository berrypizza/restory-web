export const CONSENT_VERSION = "2026-11-28.v3";
export const CONSULTATION_TYPES = [
  { value: "online", label: "1:1 무료 진단", format: "온라인", price: "무료", description: "기술 창업을 고민하는 지금, 나의 상황과 시작할 방향을 함께 살펴봅니다." },
  { value: "offline", label: "오프라인 상담", format: "대면", price: "5만 원", description: "직접 만나 현재의 고민과 기술 사업의 다음 단계를 이야기합니다." },
  { value: "coaching", label: "1:1 코칭", format: "2시간 · 1:1", price: "50만 원", description: "사업체 진단과 마케팅 진단으로, 지금 내 사업에서 먼저 손볼 것을 함께 정합니다." },
] as const;
/** The only option the consultation form offers now; the others stay for historical requests. */
export const COACHING = CONSULTATION_TYPES[2];
export const COACHING_DIAGNOSES = [
  { title: "사업체 진단", detail: "지금 하는 일, 서비스·가격 구성, 고객이 들어오는 흐름과 매출 구조를 점검합니다." },
  { title: "마케팅 진단", detail: "네이버 플레이스·블로그·광고·SNS 현황을 보고, 먼저 할 일의 순서를 정합니다." },
] as const;
export const COACHING_MATERIALS = [
  "홈페이지 · SaaS, 누구나 혼자 만들 수 있는 강의 + 자료",
  "네이버 블로그 글 작성 팁 자료",
  "네이버 파워링크 세팅 자료",
  "릴스 · 쇼츠 AI 편집 강의",
  "부하율 · 잠재의식 · 사이코사이버네틱스 · 신념 · 사명 · 원칙 강의 자료",
] as const;
/** Blue-collar trades (must match the trade check in the DB). */
export const TRADES = [
  { value: "house_repair", label: "집수리" },
  { value: "aircon_cleaning", label: "에어컨 청소" },
  { value: "sofa_clinic", label: "소파 클리닉" },
  { value: "furniture_repair", label: "가구 수리" },
  { value: "interior", label: "인테리어 · 시공" },
  { value: "move_cleaning", label: "입주 · 이사 청소" },
  { value: "plumbing", label: "설비 · 배관" },
  { value: "electrical", label: "전기" },
  { value: "other", label: "기타 · 아직 정하지 않았어요" },
] as const;
export const SITUATIONS = [
  { value: "employee", label: "직장인", description: "직장을 다니며 새로운 시작을 고민하고 있어요." },
  { value: "freelancer", label: "프리랜서", description: "내 일과 기술을 사업으로 이어가고 싶어요." },
  { value: "student", label: "대학생", description: "나에게 맞는 진로와 창업의 방향을 찾고 있어요." },
  { value: "technician", label: "기술자", description: "현장에서 일하며 내 사업을 키우고 싶어요." },
  { value: "other", label: "기타", description: "상담에서 말해주세요." },
] as const;
export const CALL_TIMES = ["평일 오전", "평일 오후", "평일 저녁", "주말 낮", "언제든 가능"];
export const REPAIR_EXPERIENCES = [
  { value: "experienced", label: "집수리·가구수리 등 관련 일을 해봤어요" },
  { value: "explored", label: "관심이 있어서 찾아보거나 배워본 적 있어요" },
  { value: "beginner", label: "아직 경험이 없고, 이번이 처음이에요" },
] as const;
export const MARKETING_EXPERIENCES = [
  { value: "business", label: "사업이나 일을 알리기 위한 마케팅을 해봤어요" },
  { value: "personal", label: "블로그 일상글이나 SNS 게시물을 올려봤어요" },
  { value: "beginner", label: "직접 글을 쓰거나 마케팅을 해본 적은 없어요" },
] as const;
export const CONSULTATION_STATUSES = { new: "신규", contacted: "연락 완료", scheduled: "상담 예정", completed: "상담 완료" } as const;
export type ConsultationStatus = keyof typeof CONSULTATION_STATUSES;
export type Consultation = {
  id: string; consultation_type: string; situation: string | null; trade: string | null; name: string; phone: string; email: string; region: string; age_range: string; repair_experience: string | null; marketing_experience: string | null; available_time: string; message: string; consent_version: string; consented_at: string; created_at: string; status: ConsultationStatus; fee_krw: number;
};
