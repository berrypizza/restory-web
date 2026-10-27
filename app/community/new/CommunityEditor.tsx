"use client";
/* eslint-disable @next/next/no-img-element -- Local blob previews are not served by the image optimizer. */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { communityClient, communityError } from "@/lib/community/client";
import { BUCKET, COMMUNITY_CATEGORIES } from "@/lib/community/types";
import { prepareCommunityPhoto } from "@/lib/community/photos";
import { useCommunity } from "../CommunityProvider";

type Photo = { blob: Blob; preview: string };
export default function CommunityEditor() {
  const auth = useCommunity();
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const [category, setCategory] = useState("question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [existingPaths, setExistingPaths] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(Boolean(editId));
  const [prepared, setPrepared] = useState(false);
  const previews = useRef<string[]>([]);
  const inFlight = useRef(false);
  useEffect(
    () => () => previews.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );
  useEffect(() => {
    if (!editId || !auth.user) return;
    let active = true;
    void communityClient()
      .from("community_posts")
      .select("category,title,body,image_paths")
      .eq("id", editId)
      .eq("author_id", auth.user.id)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data, error: e }) => {
        if (!active) return;
        if (data && !e) {
          setCategory(data.category);
          setTitle(data.title);
          setBody(data.body);
          setExistingPaths(data.image_paths);
          setPrepared(true);
        } else setError("수정할 수 있는 글을 찾지 못했습니다.");
        setReading(false);
      });
    return () => {
      active = false;
    };
  }, [editId, auth.user]);

  async function addPhotos(files: FileList | null) {
    if (!files) return;
    if (photos.length + existingPaths.length + files.length > 4) {
      setError("사진은 최대 4장까지 첨부할 수 있어요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const additions: Photo[] = [];
      for (const file of Array.from(files)) {
        const blob = await prepareCommunityPhoto(file);
        const preview = URL.createObjectURL(blob);
        previews.current.push(preview);
        additions.push({ blob, preview });
      }
      setPhotos((current) => [...current, ...additions]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "사진을 처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.profile || busy || inFlight.current || (editId && !prepared))
      return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    const uploaded: string[] = [];
    let saved = false;
    const db = communityClient();
    try {
      for (const photo of photos) {
        const path = `${auth.profile.id}/${crypto.randomUUID()}.jpg`;
        const { error: e } = await db.storage
          .from(BUCKET)
          .upload(path, photo.blob, {
            contentType: "image/jpeg",
            upsert: false,
          });
        if (e)
          throw new Error(
            "사진 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.",
          );
        uploaded.push(path);
      }
      const values = {
        category,
        title: title.trim(),
        body: body.trim(),
        image_paths: [...existingPaths, ...uploaded],
      };
      const request = editId
        ? db
            .from("community_posts")
            .update(values)
            .eq("id", editId)
            .eq("author_id", auth.profile.id)
            .eq("status", "published")
        : db.from("community_posts").insert(values);
      const { data, error: e } = await request.select("id").single();
      if (e || !data) throw new Error(communityError(e));
      saved = true;
      router.push(`/community/${data.id}`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "등록하지 못했습니다. 다시 시도해주세요.",
      );
      if (!saved && uploaded.length)
        await db.storage.from(BUCKET).remove(uploaded);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  if (auth.loading)
    return (
      <main className="community-narrow">
        <p>로그인 상태를 확인하고 있어요.</p>
      </main>
    );
  if (!auth.profile)
    return (
      <main className="community-login">
        <div className="community-panel">
          <h1>이야기를 나눌 준비가 되었나요?</h1>
          <p>로그인하고 닉네임을 정하면 글을 쓸 수 있어요.</p>
          <Link
            className="community-button kakao"
            href="/community/login?next=new"
          >
            로그인하고 글쓰기
          </Link>
          <Link className="community-text-button" href="/community">
            목록으로
          </Link>
        </div>
      </main>
    );
  return (
    <main className="community-narrow">
      <Link className="community-text-button" href="/community">
        ← 커뮤니티로
      </Link>
      <section className="community-panel">
        <p className="community-eyebrow">
          작은 경험도 누군가에게는 도움이 됩니다
        </p>
        <h1>{editId ? "이야기 수정하기" : "어떤 이야기를 나눌까요?"}</h1>
        <p>확인한 사실과 아직 모르는 부분을 구분해서 적어주세요.</p>
        {reading ? (
          <p>글을 불러오는 중…</p>
        ) : (
          <form className="community-form" onSubmit={save}>
            <label>
              게시판
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {COMMUNITY_CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              제목
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={5}
                maxLength={100}
                placeholder="지금 고민이나 경험을 한 문장으로 적어주세요"
              />
            </label>
            <label>
              내용
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                minLength={20}
                maxLength={6000}
                placeholder={
                  category === "question"
                    ? "어떤 가구인가요?\n언제부터 어떤 상태였나요?\n직접 확인하거나 시도해본 방법이 있나요?\n함께 알아보고 싶은 점을 남겨주세요."
                    : "어떤 상태였는지, 무엇을 확인했는지, 어떤 선택을 했는지 들려주세요."
                }
              />
              <small>
                {body.length.toLocaleString()} / 6,000자 · 최소 20자
              </small>
            </label>
            <label>
              사진 첨부{" "}
              <small>최대 4장 · JPG, PNG, WebP · 한 장당 10MB 이하</small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={busy || existingPaths.length + photos.length >= 4}
                onChange={(e) => {
                  void addPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            {existingPaths.length > 0 && (
              <p className="community-muted">
                기존 사진 {existingPaths.length}장을 유지합니다.
              </p>
            )}
            {photos.length > 0 && (
              <div className="community-photo-grid">
                {photos.map((photo, index) => (
                  <div key={photo.preview}>
                    { }
                    <img src={photo.preview} alt={`첨부할 사진 ${index + 1}`} />
                    <button
                      type="button"
                      aria-label={`사진 ${index + 1} 제거`}
                      disabled={busy}
                      onClick={() => {
                        URL.revokeObjectURL(photo.preview);
                        setPhotos((current) =>
                          current.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="community-consent">
              <input type="checkbox" required />
              <span>
                공개할 수 있는 글·사진입니다. 얼굴, 상세 주소, 전화번호 등
                개인정보가 없는지 확인했습니다.
              </span>
            </label>
            {error && (
              <p className="community-alert" role="alert">
                {error}
              </p>
            )}
            <div className="community-actions">
              <Link href="/community" className="community-button secondary">
                목록으로
              </Link>
              <button
                className="community-button"
                disabled={busy || (Boolean(editId) && !prepared)}
              >
                {busy
                  ? "저장 중…"
                  : editId
                    ? "수정 내용 저장"
                    : "이야기 등록하기"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
