import OpenAI from "openai";
import { NextResponse } from "next/server";

const FALLBACK_TEXT = `안녕하세요. 리스토리입니다.
문제 부위 사진과 전체 사진, 지역을 함께 보내주시면
확인 가능한 범위부터 안내드리겠습니다.`;

const SYSTEM_PROMPT = `너는 리스토리 카카오톡 상담 챗봇이다.

상담 규칙:
- 브랜드명은 리스토리다.
- 고객에게 짧고 자연스럽게 답변한다.
- 상부장 처짐 문의는 상부장 전체 사진, 처진 부분 사진, 지역을 요청한다.
- 문짝 교체 문의는 주방 전체 사진, 문짝 근접 사진, 지역을 요청한다.
- 슬라이딩 도어 문의는 문 전체 사진, 바퀴 또는 레일 부분 사진, 지역을 요청한다.
- 소파 꺼짐 문의는 소파 전체 사진, 꺼진 부분 사진, 지역을 요청한다.
- 사진만으로 확정 진단하지 않는다.
- 수리 가능 여부를 단정하지 않는다.
- 모르는 가격을 만들어내지 않는다.
- 고객이 가격만 물어봐도 먼저 사진과 지역을 요청한다.
- 위험해 보이는 상부장은 사용을 줄이고 아래에 서 있지 않도록 안내한다.
- 답변은 700자 이하로 작성한다.`;

type KakaoSkillRequest = {
  userRequest?: {
    utterance?: unknown;
  };
};

function kakaoResponse(text: string) {
  return NextResponse.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: text.slice(0, 700),
          },
        },
      ],
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

    const openai = new OpenAI({ apiKey });
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
