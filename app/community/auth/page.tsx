"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { communityClient } from "@/lib/community/client";
import { communityReturnPath } from "@/lib/community/types";

export default function CommunityAuthCallback() {
  const [error, setError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    async function finish() {
      // supabase-js detects and exchanges the PKCE callback once during initialization.
      const db = communityClient();
      const {
        data: { user },
      } = await db.auth.getUser();
      if (!active) return;
      if (!user) {
        setError(true);
        return;
      }
      const { data } = await db
        .from("community_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      const destination = communityReturnPath(sessionStorage.getItem("community-return"));
      sessionStorage.removeItem("community-return");
      if (active)
        router.replace(
          data
            ? destination
            : `/community/login${destination === "/community" ? "" : `?next=${encodeURIComponent(destination.split("/").pop()!)}`}`,
        );
    }
    void finish().catch(() => {
      if (active) setError(true);
    });
    return () => {
      active = false;
    };
  }, [router]);
  return (
    <main className="community-login">
      <div className="community-panel">
        <h1>
          {error ? "로그인을 마치지 못했어요" : "로그인을 확인하고 있어요"}
        </h1>
        <p>
          {error
            ? "처음 로그인했던 브라우저에서 다시 시도해주세요."
            : "잠시 후 커뮤니티로 이동합니다."}
        </p>
        {error && (
          <Link className="community-button" href="/community/login">
            로그인 다시 하기
          </Link>
        )}
      </div>
    </main>
  );
}
