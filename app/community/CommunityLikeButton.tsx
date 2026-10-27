"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { communityClient } from "@/lib/community/client";
import { useCommunity } from "./CommunityProvider";
import type { CommunityLikeState } from "./useCommunityLikes";

export default function CommunityLikeButton({
  postId, state, loadError, reload, refresh, compact = false,
}: {
  postId: string;
  state?: CommunityLikeState;
  loadError: boolean;
  reload: () => void;
  refresh: (postId: string) => Promise<void>;
  compact?: boolean;
}) {
  const auth = useCommunity();
  const router = useRouter();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [needsRefresh, setNeedsRefresh] = useState(false);

  async function toggle() {
    if (pending.current || auth.loading) return;
    if (!auth.user) {
      router.push(`/community/login?next=${postId}`);
      return;
    }
    if (!state) {
      reload();
      return;
    }
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      if (!needsRefresh) {
        const db = communityClient();
        const { error: mutationError } = state.liked
          ? await db.from("community_likes").delete().eq("post_id", postId).eq("user_id", auth.user.id)
          : await db.from("community_likes").insert({ post_id: postId });
        if (mutationError && mutationError.code !== "23505") {
          setError("저장하지 못했어요. 다시 눌러주세요.");
          return;
        }
      }
      setNeedsRefresh(true);
      await refresh(postId);
      setNeedsRefresh(false);
    } catch {
      setError("상태를 확인하지 못했어요. 다시 눌러주세요.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  const label = loadError || needsRefresh ? "좋아요 다시 확인" : state?.liked ? "좋아요 취소" : "좋아요";
  return (
    <span className={`community-like-control${compact ? " compact" : ""}`}>
      <button
        type="button"
        className="community-like-button"
        aria-pressed={state?.liked ?? false}
        aria-label={`${label}${state ? ` · ${state.like_count}개` : ""}`}
        aria-busy={busy}
        disabled={auth.loading || busy || (!state && !loadError && Boolean(auth.user))}
        onClick={() => void toggle()}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill={state?.liked ? "currentColor" : "none"}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
        <span>{loadError || needsRefresh ? "다시 확인" : "좋아요"}</span>
        <span aria-live="polite">{state?.like_count.toLocaleString("ko-KR") ?? (loadError ? "—" : "…")}</span>
      </button>
      {error && <small className="community-like-error" role="alert">{error}</small>}
    </span>
  );
}
