import styles from "./academy.module.css";

export default function FieldVideo() {
  return (
    <figure className={styles.fieldFigure}>
      <iframe
        className={styles.videoFrame}
        src="https://www.youtube-nocookie.com/embed/tDAtB2ClG08?start=6"
        title="리스토리 싱크대 상부장 현장 이야기"
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <figcaption>
        싱크대 상부장 현장 이야기 ·{" "}
        <a href="https://www.youtube.com/watch?v=tDAtB2ClG08&t=6s" target="_blank" rel="noopener noreferrer">유튜브에서 보기 ↗</a>
      </figcaption>
    </figure>
  );
}
