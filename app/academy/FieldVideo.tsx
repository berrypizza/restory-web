"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackAcademy } from "@/lib/academy/analytics";
import { ACADEMY_VIDEOS, videoProperties, type AcademyVideo } from "@/lib/academy/video-attribution";
import { recordVideoState } from "@/lib/academy/video-store";
import { createPlaybackObserver, loadYouTubeAPI, type YouTubePlayer } from "@/lib/academy/youtube-player";
import styles from "./field-video.module.css";

type FieldVideoProps = {
  videoId?: string;
  videoTitle?: string;
  playLabel?: string;
};

export default function FieldVideo({
  videoId = "TcMbB4Skd90",
  videoTitle = "형제끼리 사업하면 매일 싸울까요?",
  playLabel = "영상 보기",
}: FieldVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || !playerHost.current) return;
    const container = playerHost.current;
    let disposed = false;
    let player: YouTubePlayer | undefined;
    // This subtree belongs to the SDK, so destroy() cannot remove a React-owned iframe.
    const iframe = document.createElement("iframe");
    const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1", enablejsapi: "1", origin: window.location.origin });
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
    iframe.title = videoTitle;
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.onload = () => iframe.focus();
    container.appendChild(iframe);
    const video = (Object.keys(ACADEMY_VIDEOS) as AcademyVideo[]).find(key => ACADEMY_VIDEOS[key].id === videoId);
    const observe = createPlaybackObserver(stage => {
      if (disposed || !video) return;
      const record = recordVideoState(video, stage);
      trackAcademy(stage === "started" ? "academy_video_start" : "academy_video_complete", {
        academy_video: video, video_id: ACADEMY_VIDEOS[video].id, video_title: ACADEMY_VIDEOS[video].title,
        video_provider: "youtube", ...videoProperties(record),
      });
    });
    void loadYouTubeAPI().then(api => {
      if (disposed) return;
      player = new api.Player(iframe, { events: {
        onReady: event => observe(event.target.getPlayerState()),
        onStateChange: event => observe(event.data),
      } });
    }).catch(() => { /* The ordinary iframe still works when measurement SDKs are blocked. */ });
    return () => { disposed = true; iframe.onload = null; player?.destroy(); container.replaceChildren(); };
  }, [isPlaying, videoId, videoTitle]);

  return (
    <figure className={styles.video}>
      <div className={styles.frame}>
        {isPlaying ? (
          <div ref={playerHost} />
        ) : (
          <button
            type="button"
            className={styles.poster}
            aria-label={`${videoTitle} 영상 재생`}
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              unoptimized
            />
            <span className={styles.play} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            </span>
            <span className={styles.hint}>{playLabel}</span>
          </button>
        )}
      </div>
      <figcaption className={styles.caption}>
        <strong>{videoTitle}</strong>
        <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" aria-label={`${videoTitle} YouTube에서 보기 (새 창)`}>YouTube ↗</a>
      </figcaption>
    </figure>
  );
}
