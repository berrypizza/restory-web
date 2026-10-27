import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { publicCommunityPosts } from "@/lib/community/public";
import CommunityDetail from "./CommunityDetail";

export const dynamic = "force-dynamic";
const readPost = cache(publicCommunityPosts);
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return { title: "이야기를 찾을 수 없습니다", robots: { index: false } };
  const result = await readPost(id);
  const post = result.posts[0];
  return {
    title: post?.title ?? "커뮤니티 이야기",
    description: post?.body.slice(0, 140),
    alternates: { canonical: `/community/${id}` },
    openGraph: {
      title: post?.title ?? "리스토리 커뮤니티",
      description: post?.body.slice(0, 140),
      url: `/community/${id}`,
    },
    robots: { index: Boolean(post), follow: true },
  };
}
export default async function CommunityPostPage({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const result = await readPost(id);
  if (result.unavailable)
    return (
      <main className="community-narrow">
        <div className="community-panel">
          <h1>글을 불러오지 못했어요</h1>
          <p>잠시 후 새로고침해주세요.</p>
        </div>
      </main>
    );
  // Private/hidden posts are available to authorized owners/moderators only through their dashboard.
  if (!result.posts[0]) notFound();
  return <CommunityDetail initialPost={result.posts[0]} />;
}
