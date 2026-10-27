"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { communityClient, communityError } from "@/lib/community/client";
import { validNickname } from "@/lib/community/types";
import { useCommunity } from "../CommunityProvider";

export default function CommunityLogin() {
  const auth = useCommunity();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function destination() {
    return new URLSearchParams(window.location.search).get("next") === "new"
      ? "/community/new"
      : "/community";
  }
  async function login() {
    setBusy(true);
    setError("");
    sessionStorage.setItem("community-return", destination());
    try {
      const { error: e } = await communityClient().auth.signInWithOAuth({
        provider: "kakao",
        options: { redirectTo: `${window.location.origin}/community/auth` },
      });
      if (e) {
        setError(
          "카카오 로그인에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
        setBusy(false);
      }
    } catch {
      setError("네트워크 연결을 확인해주세요.");
      setBusy(false);
    }
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!auth.user) return;
    if (!validNickname(nickname.trim())) {
      setError(
        "닉네임은 한글·영문·숫자·밑줄 2~20자로 입력해주세요. 운영자를 나타내는 이름은 사용할 수 없습니다.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { error: e } = await communityClient()
        .from("community_profiles")
        .insert({ id: auth.user.id, nickname: nickname.trim() });
      if (e) {
        setError(communityError(e));
        return;
      }
      await auth.refreshProfile();
      router.replace(destination());
    } catch {
      setError("저장하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="community-login">
      <div className="community-panel">
        <div className="community-member-avatar" aria-hidden="true">
          Re:
        </div>
        <p className="community-eyebrow">리스토리 커뮤니티</p>
        <h1>
          {auth.user && !auth.profile
            ? "어떤 이름으로 만날까요?"
            : "함께 나눌 이야기가 있나요?"}
        </h1>
        <p>
          수리 질문부터 현장의 경험까지.
          <br />
          서로의 이야기에 귀 기울이는 곳입니다.
        </p>
        {auth.loading ? (
          <p className="community-muted">로그인 상태 확인 중…</p>
        ) : auth.profile ? (
          <>
            <p>{auth.profile.nickname}님으로 로그인되어 있습니다.</p>
            <Link href="/community" className="community-button">
              커뮤니티로 돌아가기
            </Link>
            <button
              className="community-text-button"
              onClick={() => void auth.signOut()}
            >
              로그아웃
            </button>
          </>
        ) : auth.user ? (
          <form className="community-form" onSubmit={save}>
            <label>
              공개 닉네임
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                minLength={2}
                maxLength={20}
                required
                autoComplete="nickname"
                placeholder="실명 대신 닉네임을 사용해주세요"
              />
              <small>글과 댓글에는 이 닉네임만 표시됩니다.</small>
            </label>
            <label className="community-consent">
              <input type="checkbox" required />{" "}
              <span>
                <Link href="/community/guide" target="_blank">
                  커뮤니티 이용 안내
                </Link>
                를 확인했습니다. 작성한 글과 사진이 공개되는 것을 이해합니다.
              </span>
            </label>
            <button className="community-button" disabled={busy}>
              {busy ? "저장 중…" : "닉네임 저장하고 시작하기"}
            </button>
          </form>
        ) : (
          <>
            <button
              className="community-button kakao"
              onClick={() => void login()}
              disabled={busy}
            >
              {busy ? "카카오로 이동 중…" : "카카오로 시작하기"}
            </button>
            <p className="community-muted" style={{ marginTop: 16 }}>
              로그인 후 공개 닉네임을 정할 수 있어요.
            </p>
          </>
        )}
        {(error || auth.error) && (
          <div role="alert" className="community-alert">
            {error || auth.error}
          </div>
        )}
        <Link href="/community" className="community-text-button">
          로그인 없이 둘러보기
        </Link>
      </div>
    </main>
  );
}
