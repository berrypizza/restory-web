"use client";

import { useEffect, useState } from "react";
import { communityClient } from "@/lib/community/client";
import { useCommunity } from "./CommunityProvider";

export type CommunityLikeState = {
  post_id: string;
  like_count: number;
  liked: boolean;
};

export function useCommunityLikes(postIds: string[]) {
  const auth = useCommunity();
  const ids = postIds.join(",");
  const scope = `${auth.user?.id ?? "guest"}:${ids}`;
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<{
    scope: string;
    items: Record<string, CommunityLikeState>;
    error: boolean;
  }>({ scope: "", items: {}, error: false });

  useEffect(() => {
    if (auth.loading || !ids) return;
    const controller = new AbortController();
    async function load() {
      try {
        const { data, error } = await communityClient()
          .rpc("community_get_likes", { post_ids: ids.split(",") })
          .abortSignal(controller.signal);
        if (!controller.signal.aborted) {
          setSnapshot({
            scope,
            items: Object.fromEntries(
              ((data ?? []) as CommunityLikeState[]).map((item) => [item.post_id, item]),
            ),
            error: Boolean(error),
          });
        }
      } catch {
        if (!controller.signal.aborted) setSnapshot({ scope, items: {}, error: true });
      }
    }
    void load();
    return () => controller.abort();
  }, [ids, scope, auth.loading, reload]);

  async function refresh(postId: string) {
    const { data, error } = await communityClient()
      .rpc("community_get_likes", { post_ids: [postId] });
    const item = (data as CommunityLikeState[] | null)?.[0];
    if (error || !item) throw new Error("community_like_refresh_failed");
    setSnapshot((current) => current.scope === scope
      ? { ...current, items: { ...current.items, [postId]: item }, error: false }
      : current);
  }

  return {
    items: snapshot.scope === scope ? snapshot.items : {},
    error: snapshot.scope === scope && snapshot.error,
    reload: () => setReload((value) => value + 1),
    refresh,
  };
}
