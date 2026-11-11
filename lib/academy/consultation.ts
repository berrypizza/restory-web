export const CONSENT_VERSION = "2026-11-11.v2";
export const CONSULTATION_TYPES = [
  { value: "online", label: "1:1 무료 진단", format: "온라인", price: "무료", description: "기술 창업을 고민하는 지금, 나의 상황과 시작할 방향을 함께 살펴봅니다." },
  { value: "offline", label: "오프라인 상담", format: "대면", price: "5만 원", description: "직접 만나 현재의 고민과 기술 사업의 다음 단계를 이야기합니다." },
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
  id: string; consultation_type: string; situation: string; name: string; phone: string; email: string; region: string; age_range: string; repair_experience: string | null; marketing_experience: string | null; available_time: string; message: string; consent_version: string; consented_at: string; created_at: string; status: ConsultationStatus; fee_krw: number;
};
