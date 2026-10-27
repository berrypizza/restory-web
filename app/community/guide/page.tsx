import Link from "next/link";
export const metadata = {
  title: "커뮤니티 이용 안내",
  alternates: { canonical: "/community/guide" },
};
export default function CommunityGuide() {
  return (
    <main className="community-narrow">
      <Link href="/community" className="community-text-button">
        ← 커뮤니티로
      </Link>
      <article className="community-panel community-guide">
        <p className="community-eyebrow">우리의 약속</p>
        <h1>
          서로의 경험이
          <br />더 좋은 선택으로 이어지도록.
        </h1>
        <p>
          리스토리 커뮤니티는 고객과 기술자가 수리 질문, 작업 경험, 기술 정보를
          나누는 공간입니다.
        </p>
        <h2>01. 실제로 확인한 이야기를 나눠요</h2>
        <p>
          직접 겪은 상태와 확인한 사실을 적어주세요. 사진만으로 원인을 알기
          어려우면 모르는 부분을 남겨주세요. 다른 사람의 답변은 참고 의견이며,
          실제 작업 여부는 현장 상태를 확인한 뒤 판단해주세요.
        </p>
        <h2>02. 사진 속 개인정보를 확인해요</h2>
        <p>
          글과 사진은 로그인하지 않은 방문자도 볼 수 있습니다. 얼굴, 이름,
          전화번호, 상세 주소, 차량번호, 주문서 등이 드러나지 않도록 가려주세요.
          다른 사람이 촬영한 사진은 공개할 권한이 있을 때만 올려주세요.
        </p>
        <h2>03. 사람을 존중하고 경험을 비교해요</h2>
        <p>
          다른 선택을 했다는 이유로 비난하지 않아요. 확인되지 않은 주장, 반복
          광고, 도배, 개인정보 노출이 있는 글은 신고할 수 있으며 운영자가 확인해
          숨길 수 있습니다.
        </p>
        <h2>04. 상담이 필요하면 따로 이야기해요</h2>
        <p>
          공개 게시판에는 연락처나 방문 주소를 남기지 마세요. 개별 상담이
          필요하면 리스토리 상담 채널을 이용해주세요.
        </p>
        <a
          className="community-button secondary"
          href="http://pf.kakao.com/_hQExjX/chat"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 20 }}
        >
          사진으로 상태 확인하기 ↗
        </a>
      </article>
    </main>
  );
}
