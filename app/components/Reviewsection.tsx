"use client";

import { useState } from "react";
import s from "./customer.module.css";

const reviews = [
  {
    category: "싱크대 수리",
    text: "상부장이 떨어질 것 같아서 걱정했는데, 사진 보내니까 바로 가능 여부 알려주시고 당일 방문해서 고쳐주셨어요. 가격도 합리적이었습니다.",
    reviewer: "@kim*****님 후기 중",
  },
  {
    category: "소파 복원",
    text: "소파 꺼짐이 심해서 버리려고 했는데, 리스토리에서 내부 보강으로 새것처럼 만들어주셨어요. 200만원 아꼈습니다.",
    reviewer: "@park*****님 후기 중",
  },
  {
    category: "가죽 리폼",
    text: "식당 의자 30개 천갈이 했는데 하루 만에 끝났어요. 영업 중에 작업해주셔서 매출 손해도 없었습니다. 강추!",
    reviewer: "@lee*****님 후기 중",
  },
  {
    category: "싱크대 리폼",
    text: "주방 전체 리모델링 견적이 500만원이었는데, 문짝만 교체하니까 훨씬 저렴하게 새 주방 느낌 났어요. 진작 할 걸.",
    reviewer: "@choi*****님 후기 중",
  },
  {
    category: "싱크대 수리",
    text: "수리 불가하면 출장비 안 받는다고 해서 부담 없이 불렀는데, 다행히 고쳐지더라고요. 1년 AS까지 해주셔서 믿음이 갑니다.",
    reviewer: "@jung*****님 후기 중",
  },
];

export default function ReviewSection() {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  return <section data-service-section="reviews" className={s.section}><div className={s.wrap}>
    <div className={s.reviewBox}>
      <div><h2 className={s.subHeading}>고객 후기</h2><div className={s.reviewControls}>
        <button type="button" onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)}>이전 후기</button>
        <button type="button" onClick={() => setIndex((index + 1) % reviews.length)}>다음 후기</button>
      </div></div>
      <figure aria-live="polite"><figcaption>{review.category} · {review.reviewer}</figcaption><blockquote>{review.text}</blockquote></figure>
    </div>
  </div></section>;
}
