import { publicCommunityPosts } from "@/lib/community/public";
import CommunityBoard from "./CommunityBoard";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const result = await publicCommunityPosts();
  return (
    <CommunityBoard
      initialPosts={result.posts}
      initialUnavailable={result.unavailable}
    />
  );
}
