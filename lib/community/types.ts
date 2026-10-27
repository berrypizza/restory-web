export const COMMUNITY_CATEGORIES = [
  {
    id: "question",
    label: "수리 질문",
    description: "지금 상태를 함께 살펴봐요",
    symbol: "?",
  },
  {
    id: "story",
    label: "작업 이야기",
    description: "고치고, 바꾸고, 다시 쓰는 경험",
    symbol: "↗",
  },
  {
    id: "knowledge",
    label: "기술 정보",
    description: "현장에서 배운 방법과 관리 팁",
    symbol: "+",
  },
  {
    id: "chat",
    label: "자유 이야기",
    description: "가구와 공간에 관한 일상",
    symbol: "···",
  },
] as const;

export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number]["id"];
export type CommunityProfile = { id: string; nickname: string };
export type CommunityPost = {
  id: string;
  author_id: string;
  category: CommunityCategory;
  title: string;
  body: string;
  image_paths: string[];
  status: "published" | "hidden" | "deleted";
  created_at: string;
  updated_at: string;
  author: { nickname: string } | null;
  comments?: { count: number }[];
};
export type CommunityComment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  status: string;
  created_at: string;
  author: { nickname: string } | null;
};

export const POST_SELECT =
  "id,author_id,category,title,body,image_paths,status,created_at,updated_at,author:community_profiles(nickname),comments:community_comments(count)";
export const BUCKET = "community-photos";

export function communityReturnPath(value: string | null) {
  if (value === "new" || value === "/community/new") return "/community/new";
  const id = value?.replace(/^\/community\//, "");
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    ? `/community/${id}`
    : "/community";
}

export function categoryLabel(id: string) {
  return (
    COMMUNITY_CATEGORIES.find((category) => category.id === id)?.label ??
    "이야기"
  );
}

export function communityDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

export function validNickname(value: string) {
  return (
    /^[가-힣a-zA-Z0-9_]{2,20}$/.test(value) &&
    !/관리자|운영자|리스토리|admin|restory/i.test(value)
  );
}
