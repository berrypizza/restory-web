"use client";
/* eslint-disable @next/next/no-img-element -- Private, short-lived photo URLs must not enter the shared image cache. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { communityClient } from "@/lib/community/client";
import { BUCKET } from "@/lib/community/types";

export default function CommunityPostThumbnail({
  postId,
  path,
  title,
  count,
}: {
  postId: string;
  path: string;
  title: string;
  count: number;
}) {
  const [photo, setPhoto] = useState<{ url?: string; failed?: boolean }>({});
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await communityClient()
          .storage.from(BUCKET)
          .createSignedUrl(path, 300);
        if (active) {
          setPhoto(
            !error && data?.signedUrl
              ? { url: data.signedUrl }
              : { failed: true },
          );
        }
      } catch {
        if (active) setPhoto({ failed: true });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [path, retry]);

  function retryPhoto() {
    // A lazy image may enter the viewport after its signed URL expires.
    setPhoto({ failed: retry > 0 });
    if (retry === 0) setRetry(1);
  }

  return (
    <Link
      href={`/community/${postId}`}
      className="community-post-thumbnail"
      aria-label={`${title} 사진 보기 · 사진 ${count}장`}
    >
      {photo.url ? (
        <img
          src={photo.url}
          alt={`${title}의 첫 번째 첨부 사진`}
          width={132}
          height={104}
          loading="lazy"
          decoding="async"
          onError={retryPhoto}
        />
      ) : (
        <span className="community-thumbnail-placeholder" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="8" cy="9" r="1.5" />
            <path d="m3 16 5-4 4 3 4-5 5 6" />
          </svg>
          {photo.failed && <small>사진 보기</small>}
        </span>
      )}
      {count > 1 && <span className="community-thumbnail-count">사진 {count}</span>}
    </Link>
  );
}
