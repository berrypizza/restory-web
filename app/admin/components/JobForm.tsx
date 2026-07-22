"use client";

import { useState } from "react";
import type { Job, JobFormState } from "../lib/types";
import type { Status, Tech } from "../lib/constants";
import { TECHS, STATUSES } from "../lib/constants";
import {
  getSupabase,
  adjTime,
  addOneYear,
  today,
  compressImage,
} from "../lib/utils";
import {
  getExtraTechsFromMemo,
  getVisibleMemo,
  setExtraTechsInMemo,
} from "../lib/jobTechs";

interface JobFormProps {
  form: JobFormState;
  setForm: React.Dispatch<React.SetStateAction<JobFormState>>;
  editId: string | null;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function JobForm({
  form,
  setForm,
  editId,
  saving,
  onSave,
  onClose,
}: JobFormProps) {
  const inputStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #dbe3f0",
    color: "#111827",
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  };

  const intakeList: string[] = form.intake_photos
    ? (() => {
        try {
          return JSON.parse(form.intake_photos);
        } catch {
          return [];
        }
      })()
    : [];

  const extraTechs = getExtraTechsFromMemo(form.memo);
  const visibleMemo = getVisibleMemo(form.memo);
  const setExtraTechs = (techs: Tech[]) => {
    setForm((p) => ({
      ...p,
      memo: setExtraTechsInMemo(p.memo, techs.filter((t) => t && t !== p.tech)),
    }));
  };

  const handleIntakeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newUrls: string[] = [];
    for (const file of files) {
      const compressed = await compressImage(file);
      const path = `intake-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
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
    const all = [...intakeList, ...newUrls];
    setForm((p) => ({
      ...p,
      intake_photos: all.length ? JSON.stringify(all) : "",
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.88)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-5 flex flex-col gap-3"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #dbe3f0",
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold" style={{ color: "#111827" }}>
            {editId ? "수정" : "새 접수"}
          </h3>
          <button onClick={onClose} style={{ color: "#64748b", fontSize: 20 }}>
            ✕
          </button>
        </div>

        {/* 기본 텍스트 필드 */}
        {(
          [
            { label: "이름 *", key: "name", placeholder: "홍길동" },
            { label: "연락처", key: "phone", placeholder: "010-0000-0000" },
            { label: "지역 *", key: "region", placeholder: "인천 서구 ○○동" },
            {
              label: "증상 *",
              key: "symptom",
              placeholder: "싱크대 상부장 처짐",
            },
          ] as const
        ).map((f) => (
          <label key={f.key} className="flex flex-col gap-1.5">
            <span
              className="text-xs font-semibold"
              style={{ color: "#6b7280" }}>
              {f.label}
            </span>
            <input
              value={form[f.key]}
              onChange={(e) =>
                setForm((p) => ({ ...p, [f.key]: e.target.value }))
              }
              placeholder={f.placeholder}
              style={inputStyle}
            />
          </label>
        ))}

        {/* 방문일 + 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-semibold"
              style={{ color: "#6b7280" }}>
              방문일
            </span>
            <input
              type="date"
              value={form.visit_date}
              onChange={(e) =>
                setForm((p) => ({ ...p, visit_date: e.target.value }))
              }
              style={inputStyle}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-semibold"
              style={{ color: "#6b7280" }}>
              도착 시간
            </span>
            <div className="flex items-center gap-1">
              <input
                type="time"
                value={form.visit_time}
                onChange={(e) =>
                  setForm((p) => ({ ...p, visit_time: e.target.value }))
                }
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    visit_time: adjTime(p.visit_time, -30),
                  }))
                }
                className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                style={{
                  backgroundColor: "#f8fafc",
                  color: "#64748b",
                  border: "1px solid #dbe3f0",
                }}>
                －
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    visit_time: adjTime(p.visit_time, 30),
                  }))
                }
                className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                style={{
                  backgroundColor: "#f8fafc",
                  color: "#64748b",
                  border: "1px solid #dbe3f0",
                }}>
                ＋
              </button>
            </div>
          </label>
        </div>

        {/* 금액 */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>
            금액 (원)
          </span>
          <input
            type="number"
            value={form.price || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, price: parseInt(e.target.value) || 0 }))
            }
            placeholder="150000"
            style={inputStyle}
          />
        </label>

        {/* 기사 + 상태 */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-semibold"
              style={{ color: "#6b7280" }}>
              기사
            </span>
            <select
              value={form.tech}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  tech: e.target.value as Tech,
                  memo: setExtraTechsInMemo(
                    p.memo,
                    getExtraTechsFromMemo(p.memo).filter(
                      (t) => t !== (e.target.value as Tech),
                    ),
                  ),
                }))
              }
              style={inputStyle}>
              <option value="">미배정</option>
              {TECHS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-col gap-1.5">
              {extraTechs.map((tech, idx) => (
                <div key={`${tech}-${idx}`} className="flex items-center gap-1.5">
                  <select
                    value={tech}
                    onChange={(e) => {
                      const next = [...extraTechs];
                      next[idx] = e.target.value as Tech;
                      setExtraTechs(next);
                    }}
                    style={{ ...inputStyle, padding: "7px 9px", fontSize: 12 }}>
                    <option value="">동행 기사 선택</option>
                    {TECHS.filter(
                      (t) =>
                        t !== form.tech && (!extraTechs.includes(t) || t === tech),
                    ).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setExtraTechs(extraTechs.filter((_, i) => i !== idx))}
                    className="rounded-xl px-2 py-1.5 text-xs font-bold"
                    style={{
                      backgroundColor: "#fef2f2",
                      color: "#ef4444",
                      border: "1px solid #fecaca",
                    }}>
                    제거
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const nextTech = TECHS.find(
                    (t) => t !== form.tech && !extraTechs.includes(t),
                  );
                  if (nextTech) setExtraTechs([...extraTechs, nextTech]);
                }}
                disabled={!TECHS.some((t) => t !== form.tech && !extraTechs.includes(t))}
                className="rounded-xl px-3 py-2 text-xs font-bold"
                style={{
                  backgroundColor: "#eff6ff",
                  color: "#1f66ff",
                  border: "1px solid #bfd3ff",
                  opacity: TECHS.some((t) => t !== form.tech && !extraTechs.includes(t))
                    ? 1
                    : 0.45,
                }}>
                + 기사 추가
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-semibold"
              style={{ color: "#6b7280" }}>
              상태
            </span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value as Status }))
              }
              style={inputStyle}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* AS 만료일 */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>
            🛡 AS 만료일{" "}
            <span className="ml-1 font-normal" style={{ color: "#94a3b8" }}>
              (기본 1년)
            </span>
          </span>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={form.as_until || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, as_until: e.target.value }))
              }
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  as_until: addOneYear(p.visit_date || today()),
                }))
              }
              className="rounded-xl px-3 py-2 text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor: "#f8fafc",
                color: "#64748b",
                border: "1px solid #dbe3f0",
              }}>
              1년
            </button>
          </div>
        </label>

        {/* 실측 토글 */}
        <button
          type="button"
          onClick={() =>
            setForm((p) => ({
              ...p,
              is_measurement: !p.is_measurement,
              install_date: null,
              install_time: null,
              install_completed: false,
            }))
          }
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            backgroundColor: form.is_measurement ? "#a855f718" : "#ffffff",
            border: `1px solid ${form.is_measurement ? "#a855f755" : "#dbe3f0"}`,
          }}>
          <div className="flex items-center gap-2.5">
            <span className="text-base">📐</span>
            <div className="text-left">
              <p
                className="text-sm font-bold"
                style={{ color: form.is_measurement ? "#a855f7" : "#334155" }}>
                실측 방문
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                체크 시 완료해도 매출에 포함 안 됨
              </p>
            </div>
          </div>
          <div
            className="rounded-full flex-shrink-0"
            style={{
              width: 44,
              height: 24,
              backgroundColor: form.is_measurement ? "#a855f7" : "#dbe3f0",
              position: "relative",
            }}>
            <div
              style={{
                position: "absolute",
                top: 3,
                left: form.is_measurement ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "white",
                transition: "left 0.2s",
              }}
            />
          </div>
        </button>

        {/* 시공 날짜/시간 (실측일 때만) */}
        {form.is_measurement && (
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #bfd3ff" }}>
            <p className="text-xs font-bold" style={{ color: "#1f66ff" }}>
              🔨 시공 날짜 · 시간{" "}
              <span className="font-normal" style={{ color: "#94a3b8" }}>
                (미정이면 비워두세요)
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#6b7280" }}>
                  시공 날짜
                </span>
                <input
                  type="date"
                  value={form.install_date || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      install_date: e.target.value || null,
                    }))
                  }
                  style={inputStyle}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#6b7280" }}>
                  시공 시간
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={form.install_time || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        install_time: e.target.value || null,
                      }))
                    }
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        install_time: adjTime(p.install_time || "00:00", -30),
                      }))
                    }
                    className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #dbe3f0",
                    }}>
                    －
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        install_time: adjTime(p.install_time || "00:00", 30),
                      }))
                    }
                    className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #dbe3f0",
                    }}>
                    ＋
                  </button>
                </div>
              </label>
            </div>
            {form.install_date && (
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    install_date: null,
                    install_time: null,
                  }))
                }
                className="text-xs font-bold py-2 rounded-xl"
                style={{
                  backgroundColor: "#ef444418",
                  color: "#ef4444",
                  border: "1px solid #ef444430",
                }}>
                시공 날짜 초기화
              </button>
            )}
          </div>
        )}

        {/* 접수 사진 */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold" style={{ color: "#f59e0b" }}>
            📷 접수 사진{" "}
            <span className="font-normal" style={{ color: "#94a3b8" }}>
              (고장 상태)
            </span>
          </span>
          <div className="flex flex-col gap-2">
            {intakeList.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {intakeList.map((url, idx) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt={`접수 ${idx + 1}`}
                      className="rounded-xl"
                      style={{
                        height: 172,
                        width: 172,
                        objectFit: "cover",
                        border: "1px solid #f59e0b44",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = intakeList.filter((_, i) => i !== idx);
                        setForm((p) => ({
                          ...p,
                          intake_photos: next.length
                            ? JSON.stringify(next)
                            : "",
                        }));
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: "#ef4444", color: "white" }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer"
              style={{
                backgroundColor: "#ffffff",
                border: "1px dashed #f59e0b55",
                color: "#f59e0b",
              }}>
              <span className="text-sm">📷</span>
              <span className="text-xs font-semibold">
                사진 추가 (갤러리 / 카메라)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleIntakeUpload}
              />
            </label>
          </div>
        </label>

        {/* 메모 */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>
            메모
          </span>
          <textarea
            value={visibleMemo}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                memo: setExtraTechsInMemo(e.target.value, getExtraTechsFromMemo(p.memo)),
              }))
            }
            placeholder="특이사항, 요청사항..."
            rows={2}
            style={{ ...inputStyle, resize: "none" }}
          />
        </label>

        {/* 저장 버튼 */}
        <button
          onClick={onSave}
          disabled={saving}
          className="mt-1 rounded-xl py-3.5 text-sm font-bold text-white"
          style={{ backgroundColor: "#1f66ff", opacity: saving ? 0.7 : 1 }}>
          {saving ? "저장 중..." : editId ? "수정 완료" : "접수 저장"}
        </button>
      </div>
    </div>
  );
}
