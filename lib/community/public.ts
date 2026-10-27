import { createClient } from "@supabase/supabase-js";
import { POST_SELECT, type CommunityPost } from "./types";

export async function publicCommunityPosts(id?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { posts: [] as CommunityPost[], unavailable: true };
  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        }),
    },
  });
  try {
    let query = db
      .from("community_posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20);
    if (id) query = query.eq("id", id);
    const { data, error } = await query;
    return {
      posts: (data ?? []) as unknown as CommunityPost[],
      unavailable: Boolean(error),
    };
  } catch {
    return { posts: [] as CommunityPost[], unavailable: true };
  }
}
