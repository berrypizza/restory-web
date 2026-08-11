import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 5;

const AI_RESPONSE_TIMEOUT_MS = 1800;

const FALLBACK_TEXT =
  "정확한 확인이 필요한 내용이에요.\n아래 [✅ 담당자에게 문의하기] 버튼을 눌러주시면 담당자가 직접 확인해드릴게요.";

const HOME_TEXT =
  "안녕하세요, 리스토리입니다.\n\n사진 한 장으로 수리·리폼 가능 여부를 먼저 확인해드립니다.\n문제 부위 사진, 전체 사진, 지역을 보내주세요.\n\n사진을 보내주셨다면 마지막으로 아래 [✅ 사진 상담 접수하기] 버튼을 눌러주세요.\n버튼을 눌러야 담당자가 사진을 확인할 수 있습니다.";

const CONSULTATION_TRIGGER_TEXT = "상담직원 연결";
const PHOTO_RECEIVED_TEXT =
  "사진이 전송되었습니다.\n\n아래 [✅ 사진 상담 접수하기] 버튼까지 눌러야 상담 접수가 완료됩니다.\n버튼을 눌러야 담당자가 사진을 확인할 수 있습니다.";
const PHOTO_CONSULT_INSTRUCTION =
  "\n\n사진을 보내주셨다면 아래 [✅ 사진 상담 접수하기] 버튼을 눌러주세요.\n버튼을 눌러야 담당자가 사진을 확인할 수 있습니다.";

type QuickReply = {
  label: string;
  action: "message";
  messageText: string;
};

const PHOTO_CONSULT_QUICK_REPLY: QuickReply = {
  label: "✅ 사진 상담 접수하기",
  action: "message",
  messageText: CONSULTATION_TRIGGER_TEXT,
};

const STAFF_CONSULT_QUICK_REPLY: QuickReply = {
  label: "✅ 담당자에게 문의하기",
  action: "message",
  messageText: CONSULTATION_TRIGGER_TEXT,
};

const SYSTEM_PROMPT = `너는 리스토리 카카오톡 상담 챗봇이다.

리스토리는 교체를 권하기 전에 살릴 수 있는지 먼저 확인하는 브랜드다. 수리는 목적이 아니라 고객이 더 좋은 선택을 하도록 돕는 결과다.

응답 원칙:
- 고객의 질문에 먼저 짧고 직접 답한 뒤, 다음 행동을 한 가지 제안한다.
- 사진을 받기 전에는 작업 가능 여부, 원인, 비용, 일정, 색상 일치를 확정하지 않는다.
- 이미 고객이 말한 정보는 다시 묻지 않는다.
- 한 번에 요청하는 정보는 최대 두 가지다. 기본 우선순위는 사진, 지역, 문제 부위, 희망 일정이다.
- 견적은 사진 확인 뒤 예상 범위를 안내할 수 있다고 말한다. 확인되지 않은 금액이나 최저가를 만들지 않는다.
- 일정, 방문 가능 시간, 주소, 연락처는 상담원이 확인해야 하므로 확정하지 않는다.
- 불가 작업 또는 출장 어려운 지역은 짧게 거절하지 말고, 확인한 범위와 다음 선택지를 함께 설명한다.
- 부분 교체, 색상 차이, 소재 매칭은 실제 자재와 기존 상태에 따라 달라질 수 있음을 설명한다.
- 개인정보는 필요한 단계에서만 요청한다. 사진 검토 단계에는 상세 주소나 연락처를 요구하지 않는다.
- 과장 표현(무조건, 완벽, 최저가, 당일 해결 등)을 사용하지 않는다.
- 350자 이하의 자연스러운 한국어로 답한다. 목록은 꼭 필요할 때만 사용한다.

작업별 사진 요청:
- 싱크대 문짝: 주방 전체, 문짝 또는 손상 부위 가까이, 지역.
- 상부장 처짐: 상부장 전체와 처진 부위, 지역. 안전상 무리하게 사용하지 않도록 안내한다.
- 식탁·의자·소파: 전체와 손상 부위, 수량 또는 소재가 보이면 함께 확인한다.

기본 마무리 문구는 상황에 맞게 한 번만 쓴다: "사진 보내주시면 먼저 상태를 확인해드리겠습니다."`;

type KakaoSkillRequest = {
  userRequest?: {
    utterance?: unknown;
    user?: {
      id?: unknown;
    };
  };
};

type ConversationContext = {
  hasPhoto: boolean;
  hasArea: boolean;
  issue: "upper-cabinet" | "kitchen-door" | "other" | null;
  updatedAt: number;
};

const CONTEXT_TTL_MS = 30 * 60 * 1000;
const conversationContexts = new Map<string, ConversationContext>();

function kakaoResponse(text: string, quickReply: QuickReply = STAFF_CONSULT_QUICK_REPLY) {
  const answer = text.slice(0, 700);

  return NextResponse.json({
    version: "2.0",
    template: {
      outputs: [{ simpleText: { text: answer } }],
      quickReplies: [quickReply],
    },
    data: { answer },
  });
}

function photoConsultResponse(text: string) {
  const answer = text.includes("사진 상담 접수하기")
    ? text
    : `${text.slice(0, 520)}${PHOTO_CONSULT_INSTRUCTION}`;
  return kakaoResponse(answer, PHOTO_CONSULT_QUICK_REPLY);
}

function getUtterance(body: KakaoSkillRequest): string {
  const utterance = body.userRequest?.utterance;
  return typeof utterance === "string" ? utterance.trim() : "";
}

function requestHasMedia(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  if (Array.isArray(value)) {
    return value.some((item) => requestHasMedia(item));
  }

  for (const [key, child] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes("image") ||
      normalizedKey.includes("photo") ||
      normalizedKey.includes("media") ||
      normalizedKey.includes("file")
    ) {
      return true;
    }
    if (typeof child === "string") {
      const normalizedValue = child.toLowerCase();
      if (
        normalizedValue.includes("image/") ||
        normalizedValue.includes("photo") ||
        normalizedValue.includes("media") ||
        normalizedValue.includes(".jpg") ||
        normalizedValue.includes(".jpeg") ||
        normalizedValue.includes(".png") ||
        normalizedValue.includes(".webp")
      ) {
        return true;
      }
    }
    if (requestHasMedia(child)) return true;
  }

  return false;
}

function getUserKey(body: KakaoSkillRequest): string | null {
  const userId = body.userRequest?.user?.id;
  return typeof userId === "string" && userId.trim() ? userId : null;
}

function getConversationContext(userKey: string | null): ConversationContext {
  if (!userKey) {
    return { hasPhoto: false, hasArea: false, issue: null, updatedAt: Date.now() };
  }

  const existing = conversationContexts.get(userKey);
  if (existing && Date.now() - existing.updatedAt < CONTEXT_TTL_MS) {
    return existing;
  }

  if (conversationContexts.size >= 500) {
    const now = Date.now();
    for (const [key, value] of conversationContexts) {
      if (now - value.updatedAt >= CONTEXT_TTL_MS) conversationContexts.delete(key);
    }
  }

  const context = { hasPhoto: false, hasArea: false, issue: null, updatedAt: Date.now() };
  conversationContexts.set(userKey, context);
  return context;
}

function rememberConversation(
  userKey: string | null,
  context: ConversationContext,
  utterance: string,
) {
  const normalized = utterance.replace(/\s+/g, " ").trim();
  context.hasPhoto ||= includesAny(normalized, [
    "사진 보냈",
    "사진보냈",
    "사진 보냄",
    "사진 첨부",
    "사진첨부",
    "사진 전송",
    "사진전송",
    "사진 올렸",
    "사진올렸",
    "첨부했",
    "전송했",
    "보내드렸",
  ]);
  context.hasArea ||= includesAny(normalized, [
    "서울",
    "경기",
    "인천",
    "부천",
    "고양",
    "일산",
    "파주",
    "하남",
    "성남",
    "분당",
    "용인",
    "수원",
    "안양",
    "과천",
    "광명",
    "시흥",
    "안산",
    "화성",
    "평택",
    "남양주",
    "구리",
    "의정부",
    "제주",
  ]);
  if (includesAny(normalized, ["상부장", "처짐", "떨어질", "흔들", "내려왔"])) {
    context.issue = "upper-cabinet";
  } else if (includesAny(normalized, ["싱크대", "문짝", "하부장", "상부장"])) {
    context.issue = "kitchen-door";
  } else if (normalized && context.issue === null) {
    context.issue = "other";
  }
  context.updatedAt = Date.now();
  if (userKey) conversationContexts.set(userKey, context);
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function getDirectReply(
  utterance: string,
  context: ConversationContext,
): string | null {
  const normalized = utterance.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();
  const hasPhoto = context.hasPhoto;
  const hasArea = context.hasArea;
  const hasRepeatedReplyComplaint = includesAny(normalized, [
    "같은말",
    "반복",
    "말이 자꾸",
    "사진과설명했",
    "사진과 설명했",
  ]);
  const hasAreaInMessage = includesAny(normalized, [
    "서울",
    "경기",
    "인천",
    "부천",
    "고양",
    "일산",
    "파주",
    "하남",
    "성남",
    "분당",
    "용인",
    "수원",
    "안양",
    "과천",
    "광명",
    "시흥",
    "안산",
    "화성",
    "평택",
    "남양주",
    "구리",
    "의정부",
    "제주",
  ]);

  if (hasRepeatedReplyComplaint) {
    return "맞습니다. 이미 보내주신 내용을 다시 요청해 불편을 드렸습니다. 사진·지역·증상은 이 채팅에 남아 있으니 추가로 보내실 필요 없습니다. 상담원 확인 전에는 확정 견적을 안내하지 않는 점 양해 부탁드립니다.";
  }

  if (/^(시작|시작하기|안내|사용 안내|help|홈)$/i.test(lower)) {
    return HOME_TEXT;
  }

  if (/^(안녕|안녕하세요|하이|문의|상담|상담 가능|문의 가능)[.!?~ ]*$/i.test(lower)) {
    return HOME_TEXT;
  }

  if (includesAny(normalized, ["소파 천갈이", "소파 가죽 수선", "누박가죽", "가죽 복원", "염색", "클리닝"])) {
    return "문의 주신 작업은 사진만으로 가능 여부를 단정하기 어렵습니다. 전체 사진과 손상 부위 사진, 지역을 보내주시면 상담원이 확인 가능한 범위와 다음 선택지를 안내해드리겠습니다.";
  }

  if (normalized.includes("제주")) {
    return "제주 지역은 현재 바로 작업 가능하다고 확정드리기 어렵습니다. 사진과 작업 내용을 보내주시면 상담원이 가능 여부를 먼저 확인해드리겠습니다.";
  }

  if (includesAny(normalized, ["가격", "비용", "견적", "얼마", "금액"])) {
    if (hasPhoto && hasArea) {
      return "사진과 지역은 확인된 것으로 보고, 추가 자료를 다시 요청하지 않겠습니다. 자재·수량·고정 상태를 상담원이 확인한 뒤 수리 가능 범위와 예상 비용을 안내드립니다.";
    }

    if (hasPhoto) {
      return "사진은 확인된 것으로 보고, 지역만 알려주시면 상담원이 수리·교체 가능 범위와 예상 비용을 확인해드리겠습니다.";
    }

    return "비용은 수리 범위와 자재에 따라 달라집니다. 전체 사진과 문제 부위 사진, 지역을 보내주시면 먼저 가능한 방법과 예상 비용 범위를 확인해드리겠습니다.";
  }

  if (includesAny(normalized, ["언제", "일정", "예약", "가능한 날", "작업 가능"])) {
    return "방문 일정은 상담원이 작업 가능 시간을 확인한 뒤 안내드리고 있습니다. 사진과 지역, 원하시는 요일 또는 시간대를 남겨주시면 확인 후 연락드리겠습니다.";
  }

  if (includesAny(normalized, ["색상", "색감", "색 차이", "부분 교체", "문짝만", "도어만"])) {
    return "부분 교체는 기존 색상·소재와 자재 수급 상태에 따라 차이가 날 수 있습니다. 전체 사진과 교체할 부위 사진을 보내주시면, 살릴 수 있는 범위와 교체 시 참고할 점을 먼저 확인해드리겠습니다.";
  }

  if (includesAny(normalized, ["상부장", "처짐", "떨어질", "흔들"])) {
    if (hasPhoto && hasArea) {
      return "상부장 처짐으로 접수했습니다. 안전을 위해 무리하게 사용하지 말아주세요. 사진과 지역 정보는 다시 보내지 않으셔도 되며, 상담원이 보강 또는 수리 가능 범위와 견적을 확인합니다.";
    }
    return "상부장 처짐은 안전을 위해 무리하게 사용하지 않는 편이 좋습니다. 상부장 전체와 처진 부위 사진, 지역을 보내주시면 보강 또는 수리 가능 여부부터 확인해드리겠습니다.";
  }

  if (includesAny(normalized, ["지역", "출장", "어디", "가능 지역"]) || (hasAreaInMessage && normalized.length < 25)) {
    return hasAreaInMessage
      ? hasPhoto
        ? "지역은 접수했습니다. 사진도 이미 보내셨다면 더 보내지 않으셔도 됩니다. 문제 부위만 한 줄로 남겨주시면 상담원이 확인 가능한 범위를 안내드립니다."
        : "보내주신 지역은 상담원이 작업 가능 범위를 확인해드리겠습니다. 문제 부위가 보이는 사진 한 장을 보내주시면 함께 검토하겠습니다."
      : "서울·인천·경기 지역을 중심으로 상담하고 있습니다. 정확한 가능 여부는 지역과 사진을 함께 보내주시면 확인해드리겠습니다.";
  }

  if (hasPhoto) {
    if (hasArea && context.issue === "upper-cabinet") {
      return "사진과 지역, 상부장 처짐 내용은 접수했습니다. 같은 자료를 다시 보내실 필요 없습니다. 안전을 위해 상부장은 무리하게 사용하지 말아주시고, 상담원이 보강 또는 수리 가능 범위를 확인합니다.";
    }
    if (hasArea) {
      return "사진과 지역은 접수했습니다. 이미 보낸 사진을 다시 보내실 필요 없습니다. 문제 부위나 원하시는 작업만 한 줄로 남겨주시면 상담원이 확인 가능한 범위를 안내드립니다.";
    }
    return "사진 확인했습니다. 사진만으로 확정 진단은 어렵지만, 먼저 수리·교체 가능 범위를 살펴보겠습니다. 아직 지역을 안 보내주셨다면 시·구 정도만 함께 남겨주세요.";
  }

  if (includesAny(normalized, ["주소", "전화", "연락처"])) {
    return "일정 조율이 필요한 단계에서만 상담원이 주소와 연락처를 확인합니다. 우선 사진과 시·구 정도의 지역을 보내주시면 작업 가능 여부부터 살펴보겠습니다.";
  }

  return null;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("KAKAO_CHATBOT_AI_TIMEOUT")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as KakaoSkillRequest;
    const utterance = getUtterance(body);
    const userKey = getUserKey(body);
    const context = getConversationContext(userKey);
    const hasMedia = requestHasMedia(body);

    if (!utterance) {
      if (hasMedia) {
        context.hasPhoto = true;
        context.updatedAt = Date.now();
        if (userKey) conversationContexts.set(userKey, context);
        return photoConsultResponse(PHOTO_RECEIVED_TEXT);
      }
      return kakaoResponse(FALLBACK_TEXT);
    }

    rememberConversation(userKey, context, utterance);
    if (hasMedia) {
      context.hasPhoto = true;
      context.updatedAt = Date.now();
      if (userKey) conversationContexts.set(userKey, context);
    }

    if (context.hasPhoto && (context.hasArea || includesAny(utterance, ["상담", "접수", "담당자", "연결"]))) {
      return photoConsultResponse(PHOTO_RECEIVED_TEXT);
    }

    const directReply = getDirectReply(utterance, context);
    if (directReply) {
      return context.hasPhoto
        ? photoConsultResponse(directReply)
        : kakaoResponse(directReply);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return kakaoResponse(FALLBACK_TEXT);
    }

    // Fast, fixed replies skip the OpenAI bundle entirely. This keeps Kakao's
    // webhook response inside its time limit even when the function is cold.
    const { default: OpenAI } = await withTimeout(
      import("openai"),
      AI_RESPONSE_TIMEOUT_MS,
    );
    const openai = new OpenAI({
      apiKey,
      maxRetries: 0,
      timeout: AI_RESPONSE_TIMEOUT_MS,
    });
    const response = await withTimeout(
      openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: SYSTEM_PROMPT,
        input: utterance,
        max_output_tokens: 500,
      }),
      AI_RESPONSE_TIMEOUT_MS,
    );

    const aiText = response.output_text.trim() || FALLBACK_TEXT;
    return context.hasPhoto
      ? photoConsultResponse(aiText)
      : kakaoResponse(aiText);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    console.error("KAKAO_CHATBOT_ERROR", { reason });
    return kakaoResponse(FALLBACK_TEXT);
  }
}
