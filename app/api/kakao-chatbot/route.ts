import OpenAI from "openai";
import { NextResponse } from "next/server";

const FALLBACK_TEXT = `안녕하세요. 리스토리입니다.
문제 부위 사진과 전체 사진, 지역을 함께 보내주시면
확인 가능한 범위부터 안내드리겠습니다.`;

const HOME_TEXT = `리스토리 상담 챗봇입니다.
수리할 가구 종류와 문제 부위를 짧게 남겨주세요.
사진과 지역을 함께 보내주시면 확인 가능한 범위부터 안내드리겠습니다.`;

const SYSTEM_PROMPT = `너는 리스토리 카카오톡 상담 챗봇이다.

상담 규칙:
- 브랜드명은 리스토리다.
- 고객에게 짧고 자연스럽게 답변한다.
- 같은 요청을 기계적으로 반복하지 않는다.
- 답변 첫 문장마다 "안녕하세요"를 반복하지 않는다. 첫 인사나 일반 문의일 때만 자연스럽게 사용한다.
- 이미 고객이 말한 정보는 다시 요구하지 말고 확인했다고 답한다.
- 고객이 지역명만 말하면 지역은 확인했다고 답하고, 필요한 사진만 요청한다.
- 고객이 "사진", "보냈어요", "첨부했어요"처럼 답하면 사진을 보낸 상황으로 보고, 지역이나 불편 부위처럼 남은 정보만 짧게 요청한다.
- 단, 실제로 보지 못한 사진 내용을 본 것처럼 구체적으로 판단하지 않는다.
- 실제 상담 톤은 차분하고 실무적으로 유지한다. "넵", "확인했습니다", "사진 부탁드립니다"처럼 짧게 답한다.
- 일정, 방문 가능 시간, 주소, 연락처는 상담원이 확인해야 하므로 확정하지 않는다.
- 상부장 처짐 문의는 상부장 전체 사진, 처진 부분 사진, 지역을 요청한다.
- 문짝 교체 문의는 주방 전체 사진, 문짝 근접 사진, 지역을 요청한다.
- 슬라이딩 도어 문의는 문 전체 사진, 바퀴 또는 레일 부분 사진, 지역을 요청한다.
- 소파 꺼짐 문의는 소파 전체 사진, 꺼진 부분 사진, 지역을 요청한다.
- 소파 천갈이, 누박가죽 복원, 염색, 클리닝 문의는 가능하다고 답하지 말고 상담원 확인이 필요하다고 안내한다.
- 사진만으로 확정 진단하지 않는다.
- 수리 가능 여부를 단정하지 않는다.
- 모르는 가격을 만들어내지 않는다.
- 가격표가 필요한 상황이라도 사진 확인 전에는 금액을 단정하지 않는다.
- 고객이 가격만 물어봐도 먼저 사진과 지역을 요청한다.
- 위험해 보이는 상부장은 사용을 줄이고 아래에 서 있지 않도록 안내한다.
- 답변은 450자 이하로 작성한다.
- 고객에게 한 번에 묻는 항목은 최대 2개로 제한한다.`;

type KakaoSkillRequest = {
  userRequest?: {
    utterance?: unknown;
  };
};

function kakaoResponse(text: string) {
  const answer = text.slice(0, 700);

  return NextResponse.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: answer,
          },
        },
      ],
    },
    data: {
      answer,
    },
  });
}

function getUtterance(body: KakaoSkillRequest): string {
  const utterance = body.userRequest?.utterance;

  if (typeof utterance !== "string") {
    return "";
  }

  return utterance.trim();
}

function getDirectReply(utterance: string): string | null {
  const normalized = utterance.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();
  const regionOnly =
    /^(서울|경기|인천|부천|김포|고양|일산|파주|의정부|남양주|구리|하남|성남|분당|용인|수원|안양|과천|광명|시흥|안산|화성|평택|오산|군포|의왕)(입니다|이에요|예요|요)?[.!?]?$/.test(
      normalized,
    );

  if (regionOnly) {
    const region = normalized
      .replace(/[.!?]$/, "")
      .replace(/(입니다|이에요|예요|요)$/, "");

    return `${region} 지역 확인했습니다. 문제 부위 전체 사진과 가까이 찍은 사진을 함께 보내주시면 확인 가능한 범위부터 안내드리겠습니다.`;
  }

  if (/^(사진|사진입니다|사진 보냈어요|사진 보냈습니다|첨부했어요|첨부했습니다|보냈어요|보냈습니다)[.!?]?$/.test(normalized)) {
    return "사진을 보내주신 경우 확인 가능한 범위부터 살펴보겠습니다. 지역을 이미 보내주셨다면 함께 확인하겠습니다. 사진만으로 확정 진단은 어렵고, 필요하면 상담원이 추가 확인드리겠습니다.";
  }

  if (/^(홈|시작|시작하기|봇사용\s*안내|사용\s*안내|도움말|help)[.!?~ ]*$/.test(lower)) {
    return HOME_TEXT;
  }

  if (/^(자주\s*묻는\s*질문|faq|관리자\s*변경)[.!?~ ]*$/.test(lower)) {
    return "챗봇 관리자센터 안내는 카카오 관리자센터에서 확인 가능합니다. 수리 상담은 문제 부위 사진과 지역을 남겨주시면 리스토리 상담원이 확인하겠습니다.";
  }

  if (/시공\s*가능\s*지역|지역이\s*어떻게|어디까지|출장\s*지역/.test(normalized)) {
    return "리스토리는 서울, 인천, 경기 지역을 중심으로 출장 상담을 진행합니다. 정확한 가능 여부는 지역명과 사진을 함께 보내주시면 확인해드리겠습니다.";
  }

  if (/통화|전화|연락\s*가능|전화\s*가능/.test(normalized)) {
    return "통화 상담 원하시면 연락처와 편하신 시간대를 남겨주세요. 상담원이 확인 후 가능한 시간에 연락드리겠습니다.";
  }

  if (/주소|연락처|전화번호/.test(normalized)) {
    return "정보 남겨주셔서 감사합니다. 주소와 연락처는 상담원이 확인 후 일정 안내드리겠습니다.";
  }

  if (/(천갈이|누박|염색|클리닝)/.test(normalized) && /(소파|쇼파|가죽)/.test(normalized)) {
    return "문의 감사합니다. 소파 천갈이, 누박가죽 복원, 염색, 클리닝은 사진만으로 가능 여부를 단정하기 어렵습니다. 사진과 지역을 남겨주시면 상담원이 가능한 작업인지 확인드리겠습니다.";
  }

  if (/(문짝|문\s*교체|하부장|싱크대\s*문)/.test(normalized) && /(견적|교체|가능|문의|부분)/.test(normalized)) {
    return "싱크대 문짝 교체 문의 확인했습니다. 주방 전체 사진과 문짝 가까운 사진, 지역을 보내주시면 확인 가능한 범위부터 안내드리겠습니다. 색상과 자재에 따라 금액은 달라질 수 있습니다.";
  }

  if (/^(안녕|안녕하세요|안녕하세요~|ㅎㅇ|하이|문의|상담|상담 가능|문의 가능)[.!?~ ]*$/.test(lower)) {
    return "안녕하세요. 리스토리입니다. 불편한 가구 종류와 문제 부위를 짧게 말씀해 주세요. 사진을 보내주시면 확인 가능한 범위부터 안내드리겠습니다.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return kakaoResponse(FALLBACK_TEXT);
    }

    const body = (await request.json()) as KakaoSkillRequest;
    const utterance = getUtterance(body);

    if (!utterance) {
      return kakaoResponse(FALLBACK_TEXT);
    }

    const directReply = getDirectReply(utterance);

    if (directReply) {
      return kakaoResponse(directReply);
    }

    const openai = new OpenAI({
      apiKey,
      maxRetries: 0,
      timeout: 2500,
    });
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: utterance,
      max_output_tokens: 500,
    });

    const answer = response.output_text.trim();

    return kakaoResponse(answer || FALLBACK_TEXT);
  } catch (error) {
    console.error("KAKAO_CHATBOT_ERROR", error);
    return kakaoResponse(FALLBACK_TEXT);
  }
}
