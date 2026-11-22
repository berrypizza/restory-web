import { findService, INTAKE_LABEL, services, type Service } from "@/lib/consultation-services";
import { findArea, isPhotoUrl, newConversation, type Conversation, type SkillRequest } from "./conversation";

type Choice = readonly [label: string, message: string];
export type Reply = {
  title?: string;
  text: string;
  firstButton?: "intake" | "operator";
  choices?: readonly Choice[];
};

export const COUNSELOR_LABEL = "리스토리 AI 상담사 리사";
export const COUNSELOR_GREETING = `안녕하세요, ${COUNSELOR_LABEL}예요`;

const PRICE: Choice = ["예상 비용", "예상 비용이 궁금해요"];
const VISIT: Choice = ["방문 일정", "언제 방문할 수 있나요?"];
const AREA: Choice = ["출장 지역", "어느 지역까지 방문하나요?"];
const PHOTOS: Choice = ["사진 찍는 법", "어떤 사진을 찍으면 되나요?"];
const priceItems: Service[] = ["doors", "upper", "sofa", "chairs"];
const priceChoices: Choice[] = priceItems.map(key => [services[key].label, `${services[key].label} 비용이 궁금해요`]);

const intake: Reply = {
  title: "먼저 상담 내용을 남겨 주세요",
  text: "아래 양식에 상담 품목과 방문 주소, 연락처를 적어 주세요. 담당자가 내용을 확인한 뒤 남겨 주신 번호로 답변드려요.",
  firstButton: "intake",
};
const welcome: Reply = {
  title: COUNSELOR_GREETING,
  text: `궁금한 점은 이 채팅에서 바로 물어보세요.\n아래 ‘${INTAKE_LABEL}’로 상담 내용을 남겨 주시면 담당자가 연락드려요.`,
  firstButton: "intake",
  choices: [PRICE, VISIT, AREA],
};
const handoff: Reply = {
  title: "상담원과 이야기할 수 있어요",
  text: "‘상담원 연결’을 누르면 1:1 채팅으로 이어져요.",
  firstButton: "operator",
};
const submitted: Reply = {
  title: "접수 후에는 담당자가 연락드려요",
  text: "양식에 남긴 번호로 연락드려요. 내용을 추가하거나 접수 상태를 확인하려면 상담원에게 문의해 주세요.",
  firstButton: "operator",
};

export function fallback(context: Conversation): Reply {
  if (context.submitted) return handoff;
  return {
    title: "담당자가 직접 확인할 내용이에요",
    text: "아래 접수 양식에 궁금한 점을 남겨 주세요. 내용을 확인한 뒤 연락드려요.",
    firstButton: "intake",
  };
}

const restartCommands = new Set(["처음으로", "시작", "시작하기", "홈", "새상담", "다른품목상담"]);
const welcomeCommands = new Set(["안내", "사용안내", "help", "안녕", "안녕하세요", "하이", "문의", "문의가능", "상담", "상담가능"]);
const intakeCommands = new Set(["상담접수", "상담접수하기", "상담신청", "상담신청하기", "접수", "접수하기",
  "빠른상담접수", "빠른상담접수하기", "접수링크", "접수양식", "상담양식", "양식보내주세요", "상담양식보내주세요", "접수링크보내주세요"]);

function priceReply(context: Conversation, waitingForItem: boolean): Reply {
  const guide = context.service && services[context.service];
  if (guide) {
    return {
      title: `${guide.label} 비용`,
      text: guide.cost,
      choices: context.photo ? [VISIT, AREA] : [PHOTOS, VISIT],
    };
  }
  context.awaitingPriceItem = true;
  if (context.submitted || context.photo === "sent" || waitingForItem) {
    return { title: "비용은 품목과 수리 범위에 따라 달라요", text: "담당자가 상태와 필요한 자재를 살펴본 뒤 예상 비용을 안내해요.", choices: priceChoices };
  }
  return {
    title: "비용은 품목과 수리 범위에 따라 달라요",
    text: "접수 양식에 수리할 품목을 남겨 주세요. 품목별 비용 기준도 아래에서 볼 수 있어요.",
    firstButton: "intake", choices: priceChoices,
  };
}

function areaReply(context: Conversation): Reply {
  if (context.area === "other") return {
    title: "이 지역은 방문 가능 여부를 먼저 확인해요",
    text: "서울·인천·경기 외 지역은 담당자가 이동 거리와 작업 내용을 보고 안내해요.", choices: [VISIT],
  };
  if (context.area === "metro" || context.submitted) return {
    title: "서울·인천·경기를 중심으로 방문해요",
    text: context.submitted ? "담당자가 접수하신 주소를 확인하고 가능한 일정을 안내해요." : "말씀하신 지역의 방문 가능 일정은 담당자가 확인해 드려요.",
    choices: [VISIT, PRICE],
  };
  return {
    title: "서울·인천·경기를 중심으로 방문해요",
    text: "접수 양식에 방문 주소를 남겨 주시면 출장 가능 여부를 확인해 드려요.",
    firstButton: "intake",
    choices: [["서울", "서울이에요"], ["인천", "인천이에요"], ["경기", "경기도예요"], ["그 외 지역", "그 외 지역이에요"]],
  };
}

export function answerTurn(body: SkillRequest, utterance: string, attached: boolean, context: Conversation): Reply | null {
  const text = utterance.replace(/\s+/g, "").replace(/[.!?~。！？]+$/, "").toLowerCase();
  const blocks = [body.intent?.name, body.userRequest?.block?.name];
  const waitingForItem = context.awaitingPriceItem;
  context.awaitingPriceItem = false;

  if (intakeCommands.has(text)) return intake;
  if (restartCommands.has(text) || blocks.includes("웰컴 블록")) {
    Object.assign(context, newConversation());
    return welcome;
  }
  const reportedSubmission = /(?:접수|신청)(?:를|을|은|는|도)?(?:이미|방금)?(?:했|해뒀|마쳤|완료(?:했|$))|(?:양식|신청서|접수폼)(?:을|를)?(?:작성했|제출했|보냈)|^(?:작성|제출)(?:했어요|했습니다)$/.test(text);
  if (reportedSubmission) context.submitted = true;
  if (!reportedSubmission && (blocks.includes("상담 접수") || blocks.includes(INTAKE_LABEL))) return intake;
  if (welcomeCommands.has(text) || (!text && !attached)) return context.submitted ? submitted : welcome;

  const service = findService(text);
  if (service && context.service && context.service !== service) {
    context.photo = null;
  }
  context.service = service ?? context.service;
  const area = findArea(utterance);
  context.area = area ?? context.area;
  const unavailable = /사진.{0,8}(?:없|못|어려|나중|힘들)/.test(text);
  const reportedPhoto = /(?:사진|이미지)(?:은|는|을|를|도)?(?:이미|방금|아까|먼저)?(?:보냈|보냄|보내드렸|올렸|첨부했|전송했|(?:첨부|전송)(?:완료|$))|^첨부했/.test(text);
  if (attached || reportedPhoto) context.photo = "sent";
  else if (unavailable) context.photo = "unavailable";

  const guide = context.service ? services[context.service] : null;
  const nextChoice = context.photo ? VISIT : PHOTOS;
  if (/(?:양식|접수|링크|제출).*(?:안열|안돼|안되|열리지|오류|실패|멈)/.test(text)) return {
    title: "접수가 어려우면 채팅으로 도와드려요",
    text: "‘상담원 연결’을 누르고 어느 단계에서 멈췄는지 알려 주세요.", firstButton: "operator",
  };
  if (/(?:상담원|직원).*연결.*(?:안돼|안되|되지않)/.test(text)) return context.submitted ? submitted : intake;
  if (/같은말|같은답|자꾸.*(?:물어|물으|사진|반복)|말이자꾸|다시묻|답변.*반복|반복.*(?:답변|질문)|사진과설명했/.test(text)) {
    return { title: "같은 내용을 다시 물었네요", text: "다시 적으실 필요 없어요. 상담원과 채팅을 이어가실 수 있어요.", firstButton: "operator" };
  }
  if (/^(?:상담직원|상담원|상담사|담당자|직원)$|(?:상담직원|상담원|상담사|담당자|사람|직원)(?:에게|한테|이랑|과|와)?(?:직접)?(?:문의|연결|상담|채팅|통화|얘기|대화|바꿔)/.test(text)) return handoff;
  if (/접수(?:가|는)?(?:됐|되었|상태|내역|확인)|접수.*(?:수정|취소)/.test(text)) {
    return { title: "접수 내역은 상담원이 확인해요", text: "‘상담원 연결’에서 접수 확인이나 변경을 요청해 주세요.", firstButton: "operator" };
  }
  if (/소요시간|얼마나걸|몇시간|시간이얼마|작업시간|시공시간/.test(text)) {
    return { title: "작업 시간은 수리 범위에 따라 달라요", text: "담당자가 상태를 살펴본 뒤 방문 전에 예상 작업 시간을 알려드려요.", choices: [VISIT, PRICE] };
  }
  if (/출장비|방문비/.test(text)) return {
    title: "출장비는 방문 전에 확인해 드려요",
    text: "담당자가 방문 지역과 작업 내용을 확인한 뒤 출장비가 견적에 포함되는지 알려드려요.", choices: [AREA],
  };
  if (/가격|비용|견적|얼마|금액|단가/.test(text)) return priceReply(context, waitingForItem);
  if (/언제|일정|예약|가능한날|방문시간|(?:오늘|내일|주말|평일).*(?:방문|가능)/.test(text)) {
    if (context.submitted) return submitted;
    return {
      title: "방문일은 상담 후 정해요",
      text: "접수할 때 상담 내용에 원하는 날짜를 적어 주세요. 담당자가 가능한 시간을 확인해 연락드려요.",
      firstButton: "intake", choices: [AREA, PRICE],
    };
  }
  if (!unavailable && /사진|이미지/.test(text) && /어떤|어떻게|무슨|찍|몇장|사진상담|보내는법|보내면|보내야|사진보내기/.test(text)) {
    if (context.photo === "sent") return {
      title: "추가 사진은 필요할 때 안내해 드려요", text: "보내 주신 사진에 대해 궁금한 점은 상담원에게 물어보세요.", firstButton: "operator", choices: [PRICE, VISIT],
    };
    return {
      title: "이렇게 찍으면 상태를 보기 쉬워요",
      text: guide?.photos ?? "전체 모습 한 장과 손상 부위를 가까이 찍은 한 장을 준비해 주세요.", choices: [PRICE],
    };
  }
  if (unavailable) return {
    title: "사진은 나중에 준비해도 돼요",
    text: context.submitted ? "필요한 사진은 담당자가 상담할 때 안내해 드려요." : "접수 양식에서 현장 사진은 선택 항목이에요. 사진 없이도 접수할 수 있어요.",
    firstButton: context.submitted ? "operator" : "intake", choices: [PRICE, VISIT],
  };
  if (/지역|출장(?:가능|오|와|되)|^출장$|어디까지/.test(text) || (area && /방문|출장/.test(text))) return areaReply(context);
  if (/색상|색감|색차이|색깔/.test(text)) return {
    title: "부분 교체는 색 차이가 날 수 있어요",
    text: "기존 가구의 색과 광택을 구할 수 있는 자재와 비교해 봐요.", choices: [PRICE, nextChoice],
  };
  if (reportedSubmission) return submitted;
  if (/주소|전화번호|연락처/.test(text)) {
    if (context.submitted) return submitted;
    return { title: "주소와 연락처는 접수할 때 남겨 주세요", text: "담당자가 상담 내용을 확인하고 방문 일정을 조율할 때 사용해요.", firstButton: "intake" };
  }

  const question = /[?？]|나요|까요|궁금|알려|문의드|어떻게|어떤/.test(utterance);
  if ((attached || reportedPhoto) && (!question || isPhotoUrl(utterance))) return {
    title: attached ? "사진을 받았어요" : "사진을 보내셨군요",
    text: context.submitted ? "이어서 궁금한 점은 상담원에게 문의해 주세요." : "아래 접수 양식에 연락처를 남겨 주세요. 담당자가 상담 내용을 확인한 뒤 답변드려요.",
    firstButton: context.submitted ? "operator" : "intake", choices: [PRICE, VISIT],
  };
  if (waitingForItem && service) return priceReply(context, true);
  if (service && guide && (!question || /(?:수리|교체|복원)(?:도|가)?(?:가능|할수|되)|고칠수|살릴수/.test(text))) {
    return { title: guide.label, text: guide.overview, choices: [PRICE, nextChoice] };
  }
  if (area && !question && !service) return areaReply(context);
  if (text === "기타문의" || text === "기타") return context.submitted ? handoff : intake;
  if (/^(?:감사(?:합니다|해요)?|고마워요|고맙습니다)$/.test(text)) return { text: "도움이 필요하면 언제든 이어서 물어보세요." };
  return null;
}
