import { NextRequest, NextResponse } from "next/server";

function cleanAddress(addr: string): string {
  // 동호수, 아파트명 등 제거 → 도로명+건물번호까지만
  let cleaned = addr
    .replace(/\d+동\s*\d+호/g, "") // 101동 502호
    .replace(/\d+호/g, "") // 604호
    .replace(/\d+층/g, "") // 3층
    .replace(/\(.*?\)/g, "") // (괄호 안 내용)
    .trim();

  // 숫자로 끝나지 않으면 마지막 단어들 제거 (아파트명 등)
  // "경인로 644번길 40 아떼프랑스" → "경인로 644번길 40"
  const parts = cleaned.split(/\s+/);
  let lastNumIdx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/\d/.test(parts[i])) {
      lastNumIdx = i;
      break;
    }
  }
  if (lastNumIdx >= 2) {
    cleaned = parts.slice(0, lastNumIdx + 1).join(" ");
  }

  return cleaned.trim();
}

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "query 필요" }, { status: 400 });
  }

  const cleaned = cleanAddress(query);
  console.log("GEOCODE:", {
    query,
    cleaned,
    key: process.env.KAKAO_REST_API_KEY ? "있음" : "없음",
  });
  // 1차: 정제된 주소로 검색
  let res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(cleaned)}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    },
  );
  let data = await res.json();

  // 2차: 못 찾으면 키워드 검색으로 재시도
  console.log("1차 결과:", JSON.stringify(data).slice(0, 300));
  // 2차: 못 찾으면 키워드 검색으로 재시도
  if (!data.documents?.length) {
    res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      },
    );
    data = await res.json();
  }

  console.log("최종 결과:", JSON.stringify(data).slice(0, 300));
  const addresses = (data.documents || [])
    .map((doc: any) => ({
      x: doc.x || doc.address?.x,
      y: doc.y || doc.address?.y,
    }))
    .filter((a: any) => a.x && a.y);

  return NextResponse.json({ addresses });
}
