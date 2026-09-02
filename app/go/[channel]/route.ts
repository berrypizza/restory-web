import { NextRequest, NextResponse } from "next/server";
import {
  ATTRIBUTION_COOKIE_NAME,
  KAKAO_CHAT_URL,
  PHONE_HREF,
  decodeAttributionCookie,
} from "@/lib/attribution";

export const dynamic = "force-dynamic";

const ALLOWED_CHANNELS = new Set(["kakao", "phone"]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ channel: string }> },
) {
  const { channel } = await context.params;
  const safeChannel = ALLOWED_CHANNELS.has(channel) ? channel : "kakao";
  const cta = request.nextUrl.searchParams.get("cta") || "unknown";
  const attribution = decodeAttributionCookie(
    request.cookies.get(ATTRIBUTION_COOKIE_NAME)?.value,
  );

  const destination =
    safeChannel === "phone" ? new URL(PHONE_HREF) : new URL(KAKAO_CHAT_URL);

  if (safeChannel === "kakao") {
    destination.searchParams.set(
      "utm_source",
      attribution.utm_source ||
        attribution.source ||
        attribution.from ||
        attribution.ref ||
        "site",
    );
    destination.searchParams.set("utm_medium", attribution.utm_medium || "cta");
    destination.searchParams.set(
      "utm_campaign",
      attribution.utm_campaign || cta,
    );
    destination.searchParams.set("utm_content", cta);
  }

  return NextResponse.redirect(destination, 307);
}
