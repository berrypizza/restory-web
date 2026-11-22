import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/landing-seo";
import { hasAttachedPhoto, newConversation, readConversation, saveConversation, type Conversation, type SkillRequest } from "./conversation";
import { answerTurn, COUNSELOR_GREETING, COUNSELOR_LABEL, fallback, type Reply } from "./replies";
import { INTAKE_LABEL, services } from "@/lib/consultation-services";

export const runtime = "nodejs";
export const maxDuration = 5;

const AI_RESPONSE_TIMEOUT_MS = 1800;
const COUNSELOR_PHOTO = {
  imageUrl: new URL("/images/ritori-counselor.png", SITE_URL).href,
  altText: COUNSELOR_LABEL,
};
const SYSTEM_PROMPT = `너는 ${COUNSELOR_LABEL}다. 가구 수리·리폼 상담을 맡는다.
고객이 물어본 것부터 쉬운 한국어 해요체로 답한다. 두세 문장, 180자 이내로 쓴다.
접수 양식과 상담원 연결은 답변 아래 버튼에서 안내하므로 질문에 대한 답만 쓴다.
이미 알려준 지역이나 보낸 사진을 다시 요구하지 않는다. 사진이 없으면 글로도 상담할 수 있다.
검토 전에는 수리 가능 여부, 원인, 색상 일치, 금액, 방문 일정을 확정하지 않는다. 모르는 작업이나 정책은 상담원이 확인하도록 안내한다.
사진을 직접 살펴봤다거나 접수·예약·연결을 마쳤다고 말하지 않는다. 채팅에 상세 주소나 연락처를 요청하지 않는다.
상부장이 떨어질 위험이 있으면 사용을 멈추고 안전한 거리를 두도록 안내한다. 인사나 상투적인 맺음말, 마크다운은 생략한다.`;

function respond(reply: Reply, context: Conversation, firstTurn: boolean) {
  const intakeUrl = new URL("/request", SITE_URL);
  if (context.service) intakeUrl.searchParams.set("service", context.service);

  const intake = { label: INTAKE_LABEL, action: "webLink", webLinkUrl: intakeUrl.href };
  const operator = { label: "상담원 연결", action: "operator" };
  const showIntake = !context.submitted || reply.firstButton === "intake";
  const buttons = showIntake ? [intake, operator] : [operator];
  if (showIntake && reply.firstButton === "operator") buttons.reverse();
  const title = firstTurn ? COUNSELOR_GREETING : reply.title;
  const answer = reply.title && reply.title !== title ? `${reply.title}\n${reply.text}` : reply.text;
  const introduceForm = showIntake && firstTurn && !reply.firstButton;
  const description = introduceForm
    ? `${answer}\n\n‘${INTAKE_LABEL}’로 신청하시면 담당자가 연락드려요.`
    : answer;
  const quickReplies = reply.choices?.map(([label, messageText]) => ({
    label, action: "message", messageText, extra: { consultation: context },
  }));
  const card = { title, description, buttons, buttonLayout: "horizontal" };
  let outputs;
  if (title !== COUNSELOR_GREETING) {
    outputs = [{ textCard: card }];
  } else if (description.length <= 230) {
    outputs = [{ basicCard: { ...card, thumbnail: { ...COUNSELOR_PHOTO, fixedRatio: true } } }];
  } else {
    // Kakao limits the image card description to 230 characters.
    outputs = [{ simpleImage: COUNSELOR_PHOTO }, { textCard: card }];
  }

  return NextResponse.json({
    version: "2.0",
    template: {
      outputs,
      quickReplies,
    },
    data: { answer: [title, description, showIntake && `${INTAKE_LABEL}\n${intakeUrl.href}`].filter(Boolean).join("\n\n") },
  });
}

async function askAI(utterance: string, context: Conversation, apiKey: string, signal: AbortSignal): Promise<Reply> {
  // Common questions return before loading the SDK, including on cold starts.
  const { default: OpenAI } = await import("openai");
  signal.throwIfAborted();
  const openai = new OpenAI({ apiKey, maxRetries: 0, timeout: AI_RESPONSE_TIMEOUT_MS });
  const known = [
    context.service && `상담 품목: ${services[context.service].label}`,
    context.area && "작업 지역을 이미 알려줌",
    context.photo === "sent" && "사진을 이미 보냄",
    context.photo === "unavailable" && "지금 사진을 준비하기 어려움",
    context.submitted && "고객이 이미 접수 양식을 제출했다고 말함",
  ].filter(Boolean).join(", ");
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: known ? `${SYSTEM_PROMPT}\n현재 상담 정보: ${known}` : SYSTEM_PROMPT,
    input: utterance,
    max_output_tokens: 320,
  }, { signal });
  const text = response.output_text.trim();
  // Never cut off a sentence or its qualification to fit a Kakao card.
  return response.status === "completed" && text && text.length <= 280 ? { text } : fallback(context);
}

export async function POST(request: Request) {
  let context = newConversation();
  let firstTurn = true;
  try {
    const body: SkillRequest = await request.json();
    const value = body.userRequest?.utterance;
    const utterance = typeof value === "string" ? value.trim() : "";
    const id = body.userRequest?.user?.id;
    const userId = typeof id === "string" && id.trim() ? id : null;
    context = readConversation(userId, body.action?.clientExtra?.consultation);
    firstTurn = context.updatedAt === 0;
    const direct = answerTurn(body, utterance, hasAttachedPhoto(body, utterance), context);
    saveConversation(userId, context);
    if (direct) return respond(direct, context, firstTurn);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return respond(fallback(context), context, firstTurn);

    const signal = AbortSignal.timeout(AI_RESPONSE_TIMEOUT_MS);
    const deadline = new Promise<never>((_, reject) => {
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    });
    return respond(await Promise.race([askAI(utterance, context, apiKey, signal), deadline]), context, firstTurn);
  } catch (error) {
    console.error("KAKAO_CHATBOT_ERROR", { reason: error instanceof Error ? error.name : "UnknownError" });
    return respond(fallback(context), context, firstTurn);
  }
}
