import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tips } from "@/lib/tips";

export const dynamic = "force-dynamic";

type TipViewRow = {
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
    Functions: {
      increment_tip_view: {
        Args: { p_tip_id: string; p_base_views: number };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type SupabaseRpcClient = {
  rpc: (
    fn: string,
    args: Record<string, string | number>,
  ) => Promise<{ data: unknown; error: unknown }>;
};

type Props = {
  params: Promise<{ id: string }>;
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

async function incrementWithFallback(
  supabase: NonNullable<ReturnType<typeof getSupabaseForViews>>,
  tipId: string,
  baseViews: number,
) {
  const { data: rpcData, error: rpcError } = await (
    supabase as unknown as SupabaseRpcClient
  ).rpc(
    "increment_tip_view",
    {
      p_tip_id: tipId,
      p_base_views: baseViews,
    },
  );

  if (!rpcError && typeof rpcData === "number") {
    return { views: rpcData, counted: true, source: "supabase_rpc" };
  }

  const { data: existing, error: readError } = await supabase
    .from("tip_views")
    .select("views")
    .eq("tip_id", tipId)
    .maybeSingle();

  if (readError) {
    return { views: baseViews, counted: false, source: "static" };
  }

  const existingRow = existing as TipViewRow | null;
  const current =
    typeof existingRow?.views === "number"
      ? Math.max(baseViews, existingRow.views || 0)
      : baseViews;
  const nextViews = current + 1;

  if (!existing) {
    const { error: insertError } = await supabase.from("tip_views").insert({
      tip_id: tipId,
      views: nextViews,
      updated_at: new Date().toISOString(),
    });

    if (!insertError) {
      return { views: nextViews, counted: true, source: "supabase" };
    }

    const { data: reread } = await supabase
      .from("tip_views")
      .select("views")
      .eq("tip_id", tipId)
      .maybeSingle();
    const rereadViews = (reread as TipViewRow | null)?.views;

    return {
      views: typeof rereadViews === "number" ? rereadViews : baseViews,
      counted: false,
      source: "supabase",
    };
  }

  const { error: updateError } = await supabase
    .from("tip_views")
    .update({
      views: nextViews,
      updated_at: new Date().toISOString(),
    })
    .eq("tip_id", tipId);

  return {
    views: updateError ? current : nextViews,
    counted: !updateError,
    source: updateError ? "static" : "supabase",
  };
}

export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;
  const tip = tips.find((item) => item.id === id);

  if (!tip) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const supabase = getSupabaseForViews();
  if (!supabase) {
    return NextResponse.json(
      { views: tip.views, counted: false, source: "static" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const result = await incrementWithFallback(supabase, tip.id, tip.views);

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
