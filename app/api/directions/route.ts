import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const goal = searchParams.get("goal");
  const departureTime = searchParams.get("departure_time"); // ISO 형식

  if (!start || !goal) {
    return NextResponse.json({ error: "start, goal 필요" }, { status: 400 });
  }

  const [startLng, startLat] = start.split(",");
  const [goalLng, goalLat] = goal.split(",");

  let url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${startLng},${startLat}&destination=${goalLng},${goalLat}`;

  if (departureTime) {
    url += `&departure_time=${departureTime}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
    },
  });

  const data = await res.json();

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
    });
  }

  return NextResponse.json({ route: null });
}
