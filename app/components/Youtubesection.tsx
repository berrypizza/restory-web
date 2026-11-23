"use client";

import { useState } from "react";
import Image from "next/image";
import s from "./customer.module.css";

const videos = [
  { id: "mvMybNNafKk", title: "식당 의자 천갈이 현장", photo: "/images/cases/case-070-after.jpg" },
  { id: "fp2clUUef24", title: "싱크대 수리 현장", photo: "/images/cases/case-037-after.jpg" },
];

export default function YoutubeSection() {
  const [playing, setPlaying] = useState("");
  return <section data-service-section="video" className={s.tintSection}><div className={s.wrap}>
    <div className={s.sectionHead}><h2>영상으로 보는 수리 과정</h2><a href="https://www.youtube.com/@surirang-911">채널 보기</a></div>
    <div className={s.columns}>{videos.map(video => <div key={video.id} className={s.videoBox}>
      {playing === video.id ? <iframe title={video.title} src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        : <button type="button" aria-label={video.title + " 재생"} onClick={() => setPlaying(video.id)}>
          <Image src={video.photo} alt="" fill sizes="(max-width: 760px) 92vw, 520px" /><span>{video.title} 재생</span>
        </button>}
    </div>)}</div>
  </div></section>;
}
