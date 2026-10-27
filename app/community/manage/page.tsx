"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { communityClient, communityError } from "@/lib/community/client";
import { communityDate } from "@/lib/community/types";
import { useCommunity } from "../CommunityProvider";

type Report = {
  id: string;
  post_id: string;
  reason: string;
  note: string;
  created_at: string;
  post: { title: string; body: string; status: string } | null;
};
type HiddenPost = { id: string; title: string; status: string };
export default function CommunityManage() {
  const auth = useCommunity();
  const [reports, setReports] = useState<Report[]>([]);
  const [hidden, setHidden] = useState<HiddenPost[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    if (!auth.moderator) return;
    let active = true;
    const db = communityClient();
    void Promise.all([
      db
        .from("community_reports")
        .select(
          "id,post_id,reason,note,created_at,post:community_posts(title,body,status)",
        )
        .eq("resolved", false)
        .order("created_at")
        .limit(100),
      db
        .from("community_posts")
        .select("id,title,status")
        .eq("status", "hidden")
        .order("updated_at", { ascending: false })
        .limit(100),
    ]).then(([r, p]) => {
      if (active) {
        setReports((r.data ?? []) as unknown as Report[]);
        setHidden(p.data ?? []);
        if (r.error || p.error) setError("관리 목록을 불러오지 못했습니다.");
      }
    });
    return () => {
      active = false;
    };
  }, [auth.moderator, reload]);
  async function update(
    table: "community_posts" | "community_reports",
    id: string,
    value: { status: string } | { resolved: boolean },
  ) {
    setBusy(true);
    setError("");
    try {
      const { data, error: e } = await communityClient()
        .from(table)
        .update(value)
        .eq("id", id)
        .select("id");
      if (e || !data?.length) setError(communityError(e));
      else setReload((value) => value + 1);
    } catch {
      setError("변경하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }
  if (auth.loading)
    return (
      <main className="community-narrow">운영 권한을 확인하고 있어요.</main>
    );
  if (!auth.moderator)
    return (
      <main className="community-narrow">
        <section className="community-panel">
          <h1>운영자 전용 화면입니다</h1>
          <p>운영 권한이 있는 계정으로 로그인해주세요.</p>
          <Link className="community-button secondary" href="/community">
            커뮤니티로 돌아가기
          </Link>
        </section>
      </main>
    );
  return (
    <main className="community-narrow">
      <Link href="/community" className="community-text-button">
        ← 커뮤니티로
      </Link>
      <section className="community-panel">
        <h1>커뮤니티 관리</h1>
        <p>신고 내용을 확인하고 필요한 글만 숨겨주세요.</p>
        {error && (
          <p role="alert" className="community-alert">
            {error}
          </p>
        )}
        <h2 style={{ marginTop: 28 }}>미처리 신고 {reports.length}건</h2>
        {reports.length ? (
          reports.map((report) => (
            <article className="community-manage-row" key={report.id}>
              <span className="community-muted">
                {communityDate(report.created_at)} ·{" "}
                {
                  (
                    {
                      privacy: "개인정보",
                      spam: "광고·도배",
                      abuse: "부적절한 내용",
                      other: "기타",
                    } as Record<string, string>
                  )[report.reason]
                }
              </span>
              <h3>{report.post?.title ?? "확인할 수 없는 글"}</h3>
              <p>{report.note || "추가 설명 없음"}</p>
              <details>
                <summary>신고된 글 내용 확인</summary>
                <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                  {report.post?.body}
                </p>
              </details>
              <div className="community-actions">
                {report.post?.status === "published" && (
                  <>
                    <Link
                      className="community-text-button"
                      href={`/community/${report.post_id}`}
                    >
                      글 보기
                    </Link>
                    <button
                      disabled={busy}
                      className="community-button secondary"
                      onClick={() =>
                        void update("community_posts", report.post_id, {
                          status: "hidden",
                        })
                      }
                    >
                      글 숨기기
                    </button>
                  </>
                )}
                <button
                  disabled={busy}
                  className="community-button"
                  onClick={() =>
                    void update("community_reports", report.id, {
                      resolved: true,
                    })
                  }
                >
                  처리 완료
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="community-muted">확인할 신고가 없습니다.</p>
        )}
        <h2 style={{ marginTop: 36 }}>숨긴 글 {hidden.length}건</h2>
        {hidden.map((post) => (
          <article className="community-manage-row" key={post.id}>
            <h3>{post.title}</h3>
            <button
              className="community-text-button"
              disabled={busy}
              onClick={() =>
                void update("community_posts", post.id, { status: "published" })
              }
            >
              다시 공개
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
