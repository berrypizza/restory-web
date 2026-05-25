import { NextRequest, NextResponse } from "next/server";

function toKakaoFutureTime(iso: string) {
  // 2026-05-26T07:30:00 -> 202605260730
  return iso.replace(/[-:T]/g, "").slice(0, 12);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const goal = searchParams.get("goal");
  const departureTime = searchParams.get("departure_time");

  if (!start || !goal) {
    return NextResponse.json({ error: "start, goal 필요" }, { status: 400 });
  }

  const [startLng, startLat] = start.split(",");
  const [goalLng, goalLat] = goal.split(",");

  const isFuture = !!departureTime;

  const baseUrl = isFuture
    ? "https://apis-navi.kakaomobility.com/v1/future/directions"
    : "https://apis-navi.kakaomobility.com/v1/directions";
  const params = new URLSearchParams({
    origin: `${startLng},${startLat}`,
    destination: `${goalLng},${goalLat}`,
    priority: "TIME",
    summary: "true",
  });

  if (isFuture) {
    params.set("departure_time", toKakaoFutureTime(departureTime));
  }

  const res = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  console.log("KAKAO DIRECTIONS:", {
    isFuture,
    url: `${baseUrl}?${params.toString()}`,
    status: res.status,
    result: JSON.stringify(data).slice(0, 500),
  });

  const summary = data.routes?.[0]?.summary;

  if (summary) {
    return NextResponse.json({
      route: {
        traoptimal: [
          {
            summary: {
              duration: summary.duration * 1000,
              distance: summary.distance,
            },
          },
        ],
      },
      debug: {
        api: isFuture ? "future" : "normal",
        departure_time: isFuture ? toKakaoFutureTime(departureTime) : null,
      },
    });
  }

  return NextResponse.json({
    route: null,
    error: data,
    debug: {
      api: isFuture ? "future" : "normal",
      departure_time: isFuture ? toKakaoFutureTime(departureTime) : null,
    },
  });
}
