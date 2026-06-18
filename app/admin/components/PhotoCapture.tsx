"use client";

import { useState } from "react";
import { getSupabase, compressImage } from "../lib/utils";

interface PhotoCaptureProps {
  jobId: string;
  photos: string[];
  onDone: (urls: string[]) => void;
  onCancel: () => void;
  revertStatus?: string;
}

export default function PhotoCapture({
  jobId,
  photos,
  onDone,
  onCancel,
  revertStatus,
}: PhotoCaptureProps) {
  const [list, setList] = useState<string[]>(photos);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`압축 중... (${i + 1}/${files.length})`);
      const compressed = await compressImage(file);
      const path = `${jobId}-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      setUploadProgress(`업로드 중... (${i + 1}/${files.length})`);
      const { error } = await getSupabase()
        .storage.from("completion-photos")
        .upload(path, compressed, { upsert: true, contentType: "image/jpeg" });
      if (error) {
        alert("업로드 실패: " + error.message);
        continue;
      }
      const { data } = getSupabase()
        .storage.from("completion-photos")
        .getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
    setList((prev) => [...prev, ...newUrls]);
    setUploading(false);
    setUploadProgress("");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ backgroundColor: "rgba(15,23,42,0.45)" }}>
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dbe3f0",
            maxHeight: "88vh",
          }}>
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <span className="text-sm font-bold" style={{ color: "#111827" }}>
                완료 사진
              </span>
              <span className="text-xs ml-2" style={{ color: "#64748b" }}>
                {list.length}장
              </span>
            </div>
            <button
              onClick={onCancel}
              style={{ color: "#64748b", fontSize: 18 }}>
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-3xl">📷</p>
                <p className="text-sm" style={{ color: "#64748b" }}>
                  사진이 없어요
                </p>
                {revertStatus && (
                  <p className="text-xs" style={{ color: "#ef4444" }}>
                    사진 없이 닫으면 &apos;{revertStatus}&apos;으로 돌아가요
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {list.map((url, idx) => (
                  <div
                    key={url}
                    className="relative rounded-xl overflow-hidden"
                    style={{ aspectRatio: "1", border: "1px solid #f3f4f6" }}>
                    <img
                      src={url}
                      alt={`사진 ${idx + 1}`}
                      onClick={() => setLightbox(url)}
                      className="w-full h-full cursor-pointer"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 flex gap-1 p-1"
                      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                      <button
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `restory-${jobId}-${idx + 1}.jpg`;
                          a.target = "_blank";
                          a.click();
                        }}
                        className="flex-1 rounded-lg py-1 text-xs"
                        style={{
                          backgroundColor: "#ffffff18",
                          color: "#1f2937",
                        }}>
                        ⬇
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm("이 사진을 삭제할까요?")) return;
                          setList((prev) => prev.filter((u) => u !== url));
                        }}
                        className="flex-1 rounded-lg py-1 text-xs"
                        style={{
                          backgroundColor: "#ef444430",
                          color: "#ef4444",
                        }}>
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="flex gap-2 p-3 flex-shrink-0"
            style={{ borderTop: "1px solid #f3f4f6" }}>
            <label
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-center cursor-pointer"
              style={{ backgroundColor: "#f3f4f6", color: "#475569" }}>
              📷 카메라
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </label>
            <label
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-center cursor-pointer"
              style={{ backgroundColor: "#f3f4f6", color: "#475569" }}>
              🖼 갤러리
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </label>
            <button
              onClick={() => onDone(list)}
              disabled={uploading}
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white"
              style={{
                backgroundColor: "#1f66ff",
                opacity: uploading ? 0.7 : 1,
              }}>
              {uploading ? uploadProgress || "저장중..." : "확인 ✓"}
            </button>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.82)" }}
          onClick={() => setLightbox(null)}>
          <img
            src={lightbox}
            alt="사진"
            className="rounded-2xl max-w-full max-h-full"
            style={{ maxHeight: "85vh" }}
          />
        </div>
      )}
    </>
  );
}
