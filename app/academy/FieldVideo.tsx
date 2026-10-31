"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./field-video.module.css";

const videoId = "TcMbB4Skd90";
const videoTitle = "형제끼리 사업하면 매일 싸울까요?";

export default function FieldVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <figure className={styles.video}>
      <div className={styles.frame}>
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
            title={videoTitle}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={(event) => event.currentTarget.focus()}
          />
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
            <span className={styles.hint}>영상 보기</span>
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
