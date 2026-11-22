import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return new Response(null, { status: 415 });
  if (Number(request.headers.get("content-length")) > 12_000)
    return new Response(null, { status: 413 });

  try {
    const body = await request.text();
    if (body.length > 6000) return new Response(null, { status: 413 });
    const input = JSON.parse(body);
    if (!input || !["id", "name", "phone", "address", "item", "notes"].every(key => typeof input[key] === "string")
      || input.consent !== true) return new Response(null, { status: 400 });

    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    const { error } = await db.rpc("submit_customer_intake", {
      p_id: input.id, p_name: input.name, p_phone: input.phone, p_address: input.address,
      p_item: input.item, p_notes: input.notes, p_consent: input.consent,
    });
    if (error) return new Response(null, { status: error.code.startsWith("22") ? 400 : 503 });
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return new Response(null, { status: error instanceof SyntaxError ? 400 : 503 });
  }
}
