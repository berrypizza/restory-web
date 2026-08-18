import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tips } from "@/lib/tips";

export const dynamic = "force-dynamic";

type TipViewRow = {
  tip_id: string;
  views: number | null;
};

type TipViewsDatabase = {
  public: {
    Tables: {
      tip_views: {
        Row: { tip_id: string; views: number; updated_at: string };
        Insert: { tip_id: string; views?: number; updated_at?: string };
        Update: { tip_id?: string; views?: number; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

function getSupabaseForViews() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!url || !key) return null;

  return createClient<TipViewsDatabase>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getStaticViews(ids: string[]) {
  const map: Record<string, number> = {};

  for (const id of ids) {
    const tip = tips.find((item) => item.id === id);
    if (tip) map[id] = tip.views;
  }

  return map;
}

function getRequestedIds(request: Request) {
  const { searchParams } = new URL(request.url);
  const knownIds = new Set(tips.map((tip) => tip.id));
  const requested = searchParams
    .get("ids")
    ?.split(",")
    .map((id) => id.trim())
    .filter((id) => knownIds.has(id));

  return requested?.length ? requested : tips.map((tip) => tip.id);
}

export async function GET(request: Request) {
  const ids = getRequestedIds(request);
  const views = getStaticViews(ids);
  const supabase = getSupabaseForViews();

  if (!supabase || ids.length === 0) {
    return NextResponse.json(
      { views, source: "static" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const { data, error } = await supabase
    .from("tip_views")
    .select("tip_id, views")
    .in("tip_id", ids);

  if (error) {
    return NextResponse.json(
      { views, source: "static", error: "storage_unavailable" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  for (const row of (data || []) as TipViewRow[]) {
    if (!row.tip_id || typeof row.views !== "number") continue;
    views[row.tip_id] = Math.max(views[row.tip_id] || 0, row.views);
  }

  return NextResponse.json(
    { views, source: "supabase" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
