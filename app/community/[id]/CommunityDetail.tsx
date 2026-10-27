"use client";
/* eslint-disable @next/next/no-img-element -- Short-lived private storage URLs must not enter the shared image cache. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { communityClient, communityError } from "@/lib/community/client";
import {
  BUCKET,
  categoryLabel,
  communityDate,
  type CommunityComment,
  type CommunityPost,
} from "@/lib/community/types";
import { useCommunity } from "../CommunityProvider";
import CommunityLikeButton from "../CommunityLikeButton";
import { useCommunityLikes } from "../useCommunityLikes";

export default function CommunityDetail({
  initialPost: post,
}: {
  initialPost: CommunityPost;
}) {
  const auth = useCommunity();
  const router = useRouter();
  const likes = useCommunityLikes([post.id]);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<{ path: string; signedUrl: string }[]>(
    [],
  );
  const [photoError, setPhotoError] = useState(false);
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("privacy");
  const [reportNote, setReportNote] = useState("");
  const [reported, setReported] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  useEffect(() => {
    let active = true;
    const db = communityClient();
    void db
      .from("community_comments")
      .select(
        "id,post_id,author_id,body,status,created_at,author:community_profiles(nickname)",
      )
      .eq("post_id", post.id)
      .eq("status", "published")
      .order("created_at")
      .limit(200)
      .then(({ data, error: e }) => {
        if (active) {
          setComments((data ?? []) as unknown as CommunityComment[]);
          setCommentError(Boolean(e));
        }
      });
    return () => {
      active = false;
    };
  }, [post.id, reload]);
  useEffect(() => {
    if (!post.image_paths.length) return;
    let active = true;
    async function load() {
      const { data, error: e } = await communityClient()
        .storage.from(BUCKET)
        .createSignedUrls(post.image_paths, 300);
      if (active) {
        setPhotos(
          (data ?? []).flatMap((item) =>
            item.path && item.signedUrl
              ? [{ path: item.path, signedUrl: item.signedUrl }]
              : [],
          ),
        );
        setPhotoError(
          Boolean(e) || data?.some((item) => Boolean(item.error)) === true,
        );
      }
    }
    void load().catch(() => {
      if (active) setPhotoError(true);
    });
    return () => {
      active = false;
    };
  }, [post.image_paths, reload]);

  async function comment(event: FormEvent) {
    event.preventDefault();
    if (!auth.profile || busy) return;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await communityClient()
        .from("community_comments")
        .insert({ post_id: post.id, body: body.trim() });
      if (e) {
        setError(communityError(e));
        return;
      }
      setBody("");
      setReload((value) => value + 1);
    } catch {
      setError("댓글을 저장하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }
  async function changeStatus(
    table: "community_posts" | "community_comments",
    id: string,
    status: "hidden" | "deleted",
  ) {
    setBusy(true);
    setError("");
    try {
      const { data, error: e } = await communityClient()
        .from(table)
        .update({ status })
        .eq("id", id)
        .select("id");
      if (e || !data?.length) {
        setError(communityError(e));
        return;
      }
      if (table === "community_posts") router.replace("/community");
      else setReload((value) => value + 1);
    } catch {
      setError("변경하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }
  async function report(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await communityClient()
        .from("community_reports")
        .insert({
          post_id: post.id,
          reason: reportReason,
          note: reportNote.trim(),
        });
      if (e && e.code !== "23505") {
        setError(communityError(e));
        return;
      }
      setReported(true);
      setReportOpen(false);
    } catch {
      setError("신고를 접수하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="community-narrow">
      <Link href="/community" className="community-text-button">
        ← 이야기 목록
      </Link>
      <article className="community-panel community-detail">
        <span className={`community-category ${post.category}`}>
          {categoryLabel(post.category)}
        </span>
        <h1>{post.title}</h1>
        <div className="community-meta">
          <span>{post.author?.nickname ?? "탈퇴한 회원"}</span>
          <time dateTime={post.created_at}>
            {communityDate(post.created_at)}
          </time>
          {post.updated_at !== post.created_at && <span>수정됨</span>}
        </div>
        <div className="community-post-body">{post.body}</div>
        <div className="community-detail-photos">
          {photos.map((photo, i) => (
            <div key={photo.path}>
              { }
              <img
                src={photo.signedUrl}
                alt={`작성자가 첨부한 사진 ${i + 1}`}
                loading="lazy"
                onError={() => setPhotoError(true)}
              />
            </div>
          ))}
          {photoError && (
            <button
              className="community-retry-photo"
              onClick={() => {
                setPhotoError(false);
                setReload((value) => value + 1);
              }}
            >
              사진을 다시 불러오기
            </button>
          )}
        </div>
        <div className="community-detail-reactions">
          <CommunityLikeButton
            key={`${post.id}:${auth.user?.id ?? "guest"}`}
            postId={post.id}
            state={likes.items[post.id]}
            loadError={likes.error}
            reload={likes.reload}
            refresh={likes.refresh}
          />
        </div>
        <div className="community-detail-actions">
          {auth.user?.id === post.author_id && (
            <>
              <Link
                className="community-text-button"
                href={`/community/new?edit=${post.id}`}
              >
                수정
              </Link>
              <button
                className="community-text-button"
                onClick={() => setDeleteOpen(true)}
              >
                내 글 삭제
              </button>
            </>
          )}
          {auth.moderator && (
            <button
              className="community-text-button"
              disabled={busy}
              onClick={() =>
                void changeStatus("community_posts", post.id, "hidden")
              }
            >
              운영자 숨김
            </button>
          )}
          {auth.user && (
            <button
              className="community-text-button"
              disabled={reported}
              onClick={() => setReportOpen(!reportOpen)}
            >
              {reported ? "신고가 접수되었습니다" : "신고하기"}
            </button>
          )}
        </div>
        {deleteOpen && (
          <div className="community-alert">
            <p>이 글을 목록에서 삭제할까요?</p>
            <div className="community-actions">
              <button
                className="community-text-button"
                onClick={() => setDeleteOpen(false)}
              >
                취소
              </button>
              <button
                className="community-text-button"
                disabled={busy}
                onClick={() =>
                  void changeStatus("community_posts", post.id, "deleted")
                }
              >
                삭제하기
              </button>
            </div>
          </div>
        )}
        {reportOpen && (
          <section className="community-report-form">
            <h2>운영자에게 알려주세요</h2>
            <form className="community-form" onSubmit={report}>
              <label>
                신고 사유
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="privacy">개인정보 노출</option>
                  <option value="spam">광고·도배</option>
                  <option value="abuse">비방·부적절한 내용</option>
                  <option value="other">기타</option>
                </select>
              </label>
              <label>
                추가 설명 (선택)
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  maxLength={500}
                />
              </label>
              <button className="community-button secondary" disabled={busy}>
                신고 접수
              </button>
            </form>
          </section>
        )}
        {error && (
          <p className="community-alert" role="alert">
            {error}
          </p>
        )}
        <section className="community-comments" id="comments">
          <h2>
            함께 나눈 이야기{" "}
            <span className="community-muted">{comments.length}</span>
          </h2>
          {commentError ? (
            <p className="community-alert">
              댓글을 불러오지 못했습니다.{" "}
              <button onClick={() => setReload((value) => value + 1)}>
                다시 시도
              </button>
            </p>
          ) : comments.length ? (
            comments.map((item) => (
              <div className="community-comment" key={item.id}>
                <strong>{item.author?.nickname ?? "탈퇴한 회원"}</strong>
                <p>{item.body}</p>
                <time dateTime={item.created_at}>
                  {communityDate(item.created_at)}
                </time>
                {auth.user?.id === item.author_id && (
                  <button
                    className="community-text-button"
                    disabled={busy}
                    onClick={() =>
                      void changeStatus(
                        "community_comments",
                        item.id,
                        "deleted",
                      )
                    }
                  >
                    내 댓글 삭제
                  </button>
                )}
                {auth.moderator && (
                  <button
                    className="community-text-button"
                    disabled={busy}
                    onClick={() =>
                      void changeStatus("community_comments", item.id, "hidden")
                    }
                  >
                    운영자 숨김
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="community-muted" style={{ padding: "20px 0" }}>
              아직 댓글이 없어요. 첫 이야기를 더해주세요.
            </p>
          )}
          {auth.profile ? (
            <form className="community-comment-form" onSubmit={comment}>
              <label>
                <span className="sr-only">댓글 내용</span>
                <textarea
                  required
                  minLength={2}
                  maxLength={2000}
                  placeholder="직접 확인한 경험을 나누고, 모르는 부분은 함께 물어봐요."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </label>
              <button className="community-button" disabled={busy}>
                {busy ? "저장 중…" : "댓글 남기기"}
              </button>
            </form>
          ) : (
            <Link
              className="community-button secondary"
              href="/community/login"
            >
              로그인하고 댓글 남기기
            </Link>
          )}
        </section>
      </article>
    </main>
  );
}
