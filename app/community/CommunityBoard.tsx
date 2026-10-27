"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { communityClient } from "@/lib/community/client";
import {
  COMMUNITY_CATEGORIES,
  POST_SELECT,
  categoryLabel,
  communityDate,
  type CommunityPost,
} from "@/lib/community/types";
import { useCommunity } from "./CommunityProvider";
import CommunityPostThumbnail from "./CommunityPostThumbnail";

export default function CommunityBoard({
  initialPosts,
  initialUnavailable,
}: {
  initialPosts: CommunityPost[];
  initialUnavailable: boolean;
}) {
  const auth = useCommunity();
  const [posts, setPosts] = useState(initialPosts);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(initialUnavailable);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        let request = communityClient()
          .from("community_posts")
          .select(POST_SELECT)
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .order("id")
          .range(page * 20, page * 20 + 19);
        if (category !== "all") request = request.eq("category", category);
        if (query)
          request = request.ilike("title", `%${query.replace(/[%_\\]/g, "")}%`);
        const { data, error } = await request.abortSignal(controller.signal);
        if (!controller.signal.aborted) {
          setPosts((data ?? []) as unknown as CommunityPost[]);
          setUnavailable(Boolean(error));
        }
      } catch {
        if (!controller.signal.aborted) setUnavailable(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [category, query, page, reload]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setQuery(search.trim());
    setPage(0);
  }

  return (
    <main className="community-container">
      <div className="community-breadcrumb">
        <Link href="/">홈</Link>
        <span>/</span>
        <span>커뮤니티</span>
      </div>
      <header className="community-hero">
        <div>
          <p className="community-eyebrow">RE’STORY COMMUNITY</p>
          <h1>
            함께 고치고,
            <br className="community-mobile-break" /> 함께 배우는 이야기.
          </h1>
          <p>
            살릴 수 있을까 하는 질문부터, 현장에서 배운 작은 발견까지.
            <br className="community-desktop-break" /> 고객과 기술자가 서로의
            경험을 나눕니다.
          </p>
        </div>
        <div className="community-hero-mark" aria-hidden="true">
          <span>Re:</span>
          <i>
            당신의 이야기에
            <br />
            경험을 더해요.
          </i>
        </div>
      </header>
      <div className="community-grid">
        <section className="community-main" aria-label="커뮤니티 게시판">
          <div className="community-board-heading">
            <h2>우리의 이야기</h2>
            <Link
              className="community-button"
              href={
                auth.profile ? "/community/new" : "/community/login?next=new"
              }
            >
              ＋ 글쓰기
            </Link>
          </div>
          <div className="community-tabs" role="group" aria-label="게시판 선택">
            {[{ id: "all", label: "전체" }, ...COMMUNITY_CATEGORIES].map(
              (item) => (
                <button
                  key={item.id}
                  aria-pressed={category === item.id}
                  onClick={() => {
                    setCategory(item.id);
                    setPage(0);
                  }}
                >
                  {item.label}
                </button>
              ),
            )}
          </div>
          <div className="community-board-tools">
            <p>{query ? `“${query}” 검색 결과` : "최근 올라온 이야기"}</p>
            <form onSubmit={submitSearch} role="search">
              <label className="sr-only" htmlFor="community-search">
                글 제목 검색
              </label>
              <input
                id="community-search"
                placeholder="궁금한 이야기를 검색해보세요"
                value={search}
                maxLength={60}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button aria-label="검색" type="submit">
                ⌕
              </button>
            </form>
          </div>
          <Link className="community-notice" href="/community/guide">
            <span>이용 안내</span>
            <strong>서로의 경험을 존중하며, 더 좋은 선택을 함께 찾아요.</strong>
            <b aria-hidden="true">→</b>
          </Link>
          <div aria-live="polite" aria-busy={loading}>
            {unavailable ? (
              <div className="community-empty">
                <span className="community-empty-icon">···</span>
                <h3>이야기를 불러오지 못했어요</h3>
                <p>
                  잠시 후 다시 시도해주세요. 작성 중인 글은 등록되지 않습니다.
                </p>
                <button
                  className="community-button secondary"
                  onClick={() => setReload((value) => value + 1)}
                >
                  다시 불러오기
                </button>
              </div>
            ) : posts.length ? (
              <div className="community-post-list">
                {posts.map((post) => (
                  <article key={post.id} className="community-post-row">
                    <div className="community-post-summary">
                      <span className={`community-category ${post.category}`}>
                        {categoryLabel(post.category)}
                      </span>
                      <Link href={`/community/${post.id}`}>
                        <h3>{post.title}</h3>
                        <p>{post.body.replace(/\s+/g, " ")}</p>
                      </Link>
                      <div className="community-meta">
                        <span>{post.author?.nickname ?? "탈퇴한 회원"}</span>
                        <span>{communityDate(post.created_at)}</span>
                        {post.image_paths.length > 0 && (
                          <span>사진 {post.image_paths.length}</span>
                        )}
                      </div>
                    </div>
                    {post.image_paths[0] && (
                      <CommunityPostThumbnail
                        key={post.image_paths[0]}
                        postId={post.id}
                        path={post.image_paths[0]}
                        title={post.title}
                        count={post.image_paths.length}
                      />
                    )}
                    <Link
                      href={`/community/${post.id}#comments`}
                      className="community-comment-count"
                      aria-label={`댓글 ${post.comments?.[0]?.count ?? 0}개`}
                    >
                      <span aria-hidden="true">◯</span>
                      {post.comments?.[0]?.count ?? 0}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="community-empty">
                <span className="community-empty-icon" aria-hidden="true">
                  {query ? "⌕" : "“"}
                </span>
                <h3>
                  {query
                    ? "아직 같은 제목의 이야기가 없어요"
                    : "첫 이야기를 기다리고 있어요"}
                </h3>
                <p>
                  {query
                    ? "다른 검색어를 입력하거나 직접 질문을 남겨보세요."
                    : "작은 질문도, 짧은 경험도 괜찮아요.\n함께 살펴보고 이야기 나눠요."}
                </p>
                <Link
                  className="community-button secondary"
                  href={
                    auth.profile
                      ? "/community/new"
                      : "/community/login?next=new"
                  }
                >
                  첫 이야기 남기기 <span aria-hidden="true">↗</span>
                </Link>
              </div>
            )}
          </div>
          {(page > 0 || posts.length === 20) && (
            <nav className="community-pagination" aria-label="게시글 페이지">
              <button
                disabled={page === 0 || loading}
                onClick={() => setPage(page - 1)}
              >
                이전
              </button>
              <span>{page + 1} 페이지</span>
              <button
                disabled={posts.length < 20 || loading}
                onClick={() => setPage(page + 1)}
              >
                다음
              </button>
            </nav>
          )}
          <div className="community-starting">
            <p className="community-eyebrow">어떤 이야기를 나누면 좋을까요?</p>
            <div>
              {COMMUNITY_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCategory(item.id);
                    setPage(0);
                  }}
                >
                  <span aria-hidden="true">{item.symbol}</span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </div>
        </section>
        <aside className="community-sidebar">
          <section className="community-member-card">
            <div className="community-member-avatar" aria-hidden="true">
              Re:
            </div>
            <h2>
              {auth.profile
                ? `${auth.profile.nickname}님, 반가워요.`
                : "경험이 모이면, 선택이 쉬워져요."}
            </h2>
            <p>
              {auth.profile
                ? "오늘의 질문과 발견을 들려주세요."
                : "읽기는 누구나, 이야기는 로그인 후 함께 나눌 수 있어요."}
            </p>
            {auth.loading ? (
              <span className="community-muted">로그인 상태 확인 중</span>
            ) : auth.profile ? (
              <>
                <Link className="community-button" href="/community/new">
                  이야기 남기기
                </Link>
                <button
                  className="community-text-button"
                  onClick={() => void auth.signOut()}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/community/login" className="community-button kakao">
                카카오로 시작하기
              </Link>
            )}
            {auth.moderator && (
              <Link className="community-text-button" href="/community/manage">
                커뮤니티 관리 →
              </Link>
            )}
            {auth.error && <p role="alert">{auth.error}</p>}
          </section>
          <section className="community-side-section">
            <p className="community-eyebrow">함께 참고해요</p>
            <Link href="/cases">
              <span>실제 작업사례</span>
              <strong>어떻게 다시 쓰게 되었을까요?</strong>
              <b>↗</b>
            </Link>
            <Link href="/tips">
              <span>가구 관리 팁</span>
              <strong>알아두면 도움이 되는 이야기</strong>
              <b>↗</b>
            </Link>
          </section>
          <section className="community-principles">
            <span className="community-eyebrow">우리의 약속</span>
            <p>
              사진을 보고,
              <br />
              원인을 확인하고,
              <br />
              <strong>선택지를 함께 생각합니다.</strong>
            </p>
            <Link href="/community/guide">커뮤니티 이용 안내 →</Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
