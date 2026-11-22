"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { JobFormState } from "../lib/types";
import type { QueueField } from "../lib/schedule";
import {
  PRODUCT_OPTIONS,
  STATUSES,
  TECHS,
  isProductOption,
  type Tech,
  type Status,
} from "../lib/constants";
import { addOneYear, today } from "../lib/utils";
import { getExtraTechsFromMemo, getVisibleMemo, setExtraTechsInMemo } from "../lib/jobTechs";
import { photoList } from "../lib/photoList";
import JobDialog from "./JobDialog";
import ArrivalTime from "./ArrivalTime";
import JobPhotoEditor from "./JobPhotoEditor";
import common from "../operations.module.css";
import s from "./intake.module.css";

interface JobFormProps {
  form: JobFormState;
  customerNotes?: string | null;
  setForm: React.Dispatch<React.SetStateAction<JobFormState>>;
  editId: string | null;
  initialField?: QueueField;
  saveError: string;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

function Section({ title, summary, children }: { title: string; summary?: string; children: ReactNode }) {
  return (
    <details className={s.detail}>
      <summary>
        <span>{title}</span>
        {summary && <small>{summary}</small>}
      </summary>
      <div className={s.detailBody}>{children}</div>
    </details>
  );
}

export default function JobForm({ form, customerNotes, setForm, editId, initialField, saveError, saving, onSave, onClose }: JobFormProps) {
  const titleId = useId();
  const dismissId = useId();
  const formId = useId();
  const formElement = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!initialField) return;
    const field = formElement.current?.elements.namedItem(initialField);
    if (field instanceof HTMLElement) field.focus();
  }, [initialField]);
  const [original] = useState(form);
  const autoWarranty = useRef(!editId);
  const paidTerms = useRef({ price: form.price, as_until: form.as_until });
  const [customProduct, setCustomProduct] = useState(() =>
    Boolean(form.symptom && !isProductOption(form.symptom)),
  );
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [unresolvedPhotos, setUnresolvedPhotos] = useState(false);
  const [confirmDismiss, setConfirmDismiss] = useState(false);
  const installDraft = useRef({
    date: form.install_date,
    time: form.install_time,
    completed: form.install_completed,
  });
  const photos = photoList(form.intake_photos);
  const extra = getExtraTechsFromMemo(form.memo);
  const visibleMemo = getVisibleMemo(form.memo);
  const busy = saving || uploading;
  const edited =
    unresolvedPhotos ||
    (Object.keys(original) as (keyof JobFormState)[]).some((key) => form[key] !== original[key]);
  const set = <K extends keyof JobFormState>(key: K, value: JobFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function requestClose() {
    if (busy) return;
    if (edited) setConfirmDismiss(true);
    else onClose();
  }

  function setVisitDate(date: string) {
    const nextWarranty = date && autoWarranty.current && !form.is_aftercare ? addOneYear(date) : undefined;
    setForm((prev) => ({ ...prev, visit_date: date, as_until: nextWarranty ?? prev.as_until }));
  }

  function setVisitType(isMeasurement: boolean) {
    if (isMeasurement === form.is_measurement && !form.is_aftercare) return;
    if (!isMeasurement && form.is_measurement)
      installDraft.current = {
        date: form.install_date,
        time: form.install_time,
        completed: form.install_completed,
      };
    setForm((prev) => ({
      ...prev,
      ...(prev.is_aftercare ? {
        price: paidTerms.current.price,
        as_until: autoWarranty.current && prev.visit_date ? addOneYear(prev.visit_date) : paidTerms.current.as_until,
      } : {}),
      is_aftercare: false,
      is_measurement: isMeasurement,
      install_date: isMeasurement ? installDraft.current.date : null,
      install_time: isMeasurement ? installDraft.current.time : null,
      install_completed: isMeasurement && prev.status === "완료" && installDraft.current.completed,
    }));
  }
  function setAftercare() {
    if (editId || form.is_aftercare) return;
    paidTerms.current = { price: form.price, as_until: form.as_until };
    if (form.is_measurement) installDraft.current = { date: form.install_date, time: form.install_time, completed: false };
    setForm(previous => ({
      ...previous, is_aftercare: true, is_measurement: false, install_date: null, install_time: null,
      install_completed: false, price: 0, as_until: "",
    }));
  }

  const errors = {
    name: !form.name.trim() ? "고객명을 입력해 주세요." : "",
    region: !form.region.trim() ? "방문할 주소나 지역을 입력해 주세요." : "",
    symptom: !form.symptom.trim() ? "작업 품목을 선택하거나 직접 입력해 주세요." : "",
    visit_date: !form.visit_date ? "방문일을 선택해 주세요." : "",
    install_date: form.is_measurement && (
      (form.install_date && form.install_date < form.visit_date) || (!form.install_date && form.install_time)
    ) ? "실측일과 같거나 이후인 시공일을 선택해 주세요." : "",
  };
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || unresolvedPhotos) return;
    setSubmitted(true);
    const missing = Object.entries(errors).find(([, message]) => message);
    if (missing) {
      const field = event.currentTarget.elements.namedItem(missing[0]);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    onSave();
  }
  type FieldName = keyof typeof errors;
  const invalid = (key: FieldName) => submitted && Boolean(errors[key]);
  const errorId = (key: FieldName) => (invalid(key) ? formId + "-" + key : undefined);
  const errorLine = (key: FieldName) =>
    invalid(key) && (
      <small className={s.fieldError} id={errorId(key)}>
        {errors[key]}
      </small>
    );
  const setExtra = (techs: Tech[]) =>
    setForm((prev) => ({
      ...prev,
      memo: setExtraTechsInMemo(
        prev.memo,
        techs.filter((tech) => tech && tech !== prev.tech),
      ),
    }));
  const statusOptions = STATUSES.filter((status) => status !== "완료" || original.status === "완료");

  return (
    <JobDialog labelledBy={titleId} busy={busy} onClose={requestClose}>
      <div className={common.modalHeader}>
        <h2 id={titleId}>{editId ? "일정 수정" : "일정 등록"}</h2>
        <button
          type="button"
          className={common.close}
          aria-label="일정 창 닫기"
          disabled={busy}
          onClick={requestClose}
        >
          ×
        </button>
      </div>
      <form ref={formElement} id={formId} className={s.body} onSubmit={handleSubmit} noValidate inert={saving} aria-busy={saving}>
        <fieldset className={s.section}>
          <legend>고객과 작업</legend>
          <div className={s.pair}>
            <label className={common.field}>
              <span>
                고객명 <small>필수</small>
              </span>
              <input
                name="name"
                required
                autoComplete="off"
                placeholder="고객 이름"
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
                aria-invalid={invalid("name")}
                aria-describedby={errorId("name")}
              />
              {errorLine("name")}
            </label>
            <label className={common.field}>
              <span>연락처</span>
              <input
                type="tel"
                autoComplete="off"
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
              />
            </label>
          </div>
          <label className={common.field}>
            <span>
              방문 주소 <small>필수</small>
            </span>
            <input
              name="region"
              required
              autoComplete="off"
              placeholder="주소 또는 지역"
              value={form.region}
              onChange={(event) => set("region", event.target.value)}
              aria-invalid={invalid("region")}
              aria-describedby={errorId("region")}
            />
            {errorLine("region")}
          </label>
          <div className={s.pair}>
            <label className={common.field}>
              <span>
                작업 품목 <small>필수</small>
              </span>
              <select
                aria-label="작업 품목"
                required
                name={customProduct ? undefined : "symptom"}
                value={customProduct ? "__custom" : form.symptom}
                aria-invalid={invalid("symptom") && !customProduct}
                aria-describedby={!customProduct ? errorId("symptom") : undefined}
                onChange={(event) => {
                  setCustomProduct(event.target.value === "__custom");
                  set("symptom", event.target.value === "__custom" ? "" : event.target.value);
                }}
              >
                <option value="">품목 선택</option>
                {PRODUCT_OPTIONS.map((product) => (
                  <option key={product}>{product}</option>
                ))}
                <option value="__custom">직접 입력</option>
              </select>
              {!customProduct && errorLine("symptom")}
            </label>
            <label className={common.field}>
              <span>주담당 기사</span>
              <select
                aria-label="주담당 기사"
                name="tech"
                value={form.tech}
                onChange={(event) => {
                  const tech = event.target.value as Tech;
                  setForm((prev) => ({
                    ...prev,
                    tech,
                    memo: setExtraTechsInMemo(
                      prev.memo,
                      getExtraTechsFromMemo(prev.memo).filter((t) => t !== tech),
                    ),
                  }));
                }}
              >
                <option value="">미배정</option>
                {TECHS.map((tech) => (
                  <option key={tech}>{tech}</option>
                ))}
              </select>
            </label>
          </div>
          {customProduct && (
            <label className={common.field}>
              <span>품목 직접 입력</span>
              <input
                name="symptom"
                required
                value={form.symptom}
                onChange={(event) => set("symptom", event.target.value)}
                aria-invalid={invalid("symptom")}
                aria-describedby={errorId("symptom")}
              />
              {errorLine("symptom")}
            </label>
          )}
        </fieldset>
        <fieldset className={s.section}>
          <legend>방문 일정</legend>
          <div className={s.dateTimePair}>
            <label className={common.field}>
              <span>방문일</span>
              <input
                name="visit_date"
                required
                type="date"
                value={form.visit_date}
                onChange={(event) => setVisitDate(event.target.value)}
                aria-invalid={invalid("visit_date")}
                aria-describedby={errorId("visit_date")}
              />
              {errorLine("visit_date")}
            </label>
            <ArrivalTime
              name="visit_time"
              label="도착 시각"
              value={form.visit_time}
              onChange={(time) => set("visit_time", time)}
            />
          </div>
          {(!editId || (!original.is_aftercare && original.status !== "완료")) && <div className={s.typePicker} role="group" aria-label="방문 유형">
            <button type="button" aria-pressed={!form.is_measurement && !form.is_aftercare} onClick={() => setVisitType(false)}>
              일반 작업
            </button>
            <button type="button" aria-pressed={form.is_measurement} onClick={() => setVisitType(true)}>
              실측 후 시공
            </button>
            {!editId && <button type="button" aria-pressed={form.is_aftercare} onClick={setAftercare}>A/S 방문</button>}
          </div>}
          {form.is_aftercare && <p className={s.hint}>A/S 방문은 매출과 기사 실적에서 제외돼요.</p>}
          {form.is_measurement && (
            <div className={s.install}>
              <p>{form.install_completed ? "시공 일정을 비워도 완료 기록과 매출은 기존 시공일에 남아요." : "시공 일정은 실측 후에도 입력할 수 있어요."}</p>
              <div className={s.dateTimePair}>
                <label className={common.field}>
                  <span>시공일</span>
                  <input
                    type="date"
                    name="install_date"
                    min={form.visit_date}
                    aria-invalid={invalid("install_date")}
                    aria-describedby={errorId("install_date")}
                    value={form.install_date || ""}
                    onChange={(event) => {
                      const date = event.target.value || null;
                      setForm(prev => ({ ...prev, install_date: date, install_time: date ? prev.install_time : null }));
                    }}
                  />
                  {errorLine("install_date")}
                </label>
                <ArrivalTime
                  name="install_time"
                  label="시공 시각"
                  value={form.install_time || ""}
                  onChange={(time) => set("install_time", time || null)}
                />
              </div>
              {(form.install_date || form.install_time) && (
                <button
                  type="button"
                  className={s.textButton}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, install_date: null, install_time: null }));
                  }}
                >
                  시공 일정 비우기
                </button>
              )}
            </div>
          )}
        </fieldset>
        <div className={s.additional}>
          {!form.is_aftercare && <Section
            title="견적·A/S"
            summary={form.price ? form.price.toLocaleString("ko-KR") + "원" : undefined}
          >
            <label className={common.field}>
              <span>견적 금액 (원)</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="예) 150000"
                value={form.price || ""}
                onChange={(event) => set("price", parseInt(event.target.value) || 0)}
              />
            </label>
            <label className={common.field}>
              <span>A/S 만료일</span>
              <input
                type="date"
                value={form.as_until || ""}
                onChange={(event) => {
                  autoWarranty.current = false;
                  set("as_until", event.target.value);
                }}
              />
            </label>
            <button
              type="button"
              className={s.textButton}
              onClick={() => {
                autoWarranty.current = true;
                set("as_until", addOneYear(form.visit_date || today()));
              }}
            >
              방문일 기준 1년 적용
            </button>
          </Section>}
          <Section
            title="동행 기사·진행 상태"
            summary={[extra.length ? extra.length + "명" : "", form.status].filter(Boolean).join(" · ")}
          >
            <div className={s.pair}>
              <label className={common.field}>
                <span>동행 기사</span>
                <select
                  aria-label="동행 기사"
                  value=""
                  onChange={(event) => {
                    if (event.target.value) setExtra([...extra, event.target.value as Tech]);
                  }}
                  disabled={!TECHS.some((tech) => tech !== form.tech && !extra.includes(tech))}
                >
                  <option value="">동행 기사 추가</option>
                  {TECHS.filter((tech) => tech !== form.tech && !extra.includes(tech)).map((tech) => (
                    <option key={tech}>{tech}</option>
                  ))}
                </select>
              </label>
              <label className={common.field}>
                <span>진행 상태</span>
                <select
                  aria-label="진행 상태"
                  value={form.status}
                  onChange={(event) => {
                    const status = event.target.value as Status;
                    setForm((prev) => ({
                      ...prev,
                      status,
                      install_completed: status === "완료" && prev.is_measurement && original.install_completed,
                    }));
                  }}
                >
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>
            {!!extra.length && (
              <div className={common.crewChips}>
                {extra.map((tech) => (
                  <button
                    type="button"
                    key={tech}
                    aria-label={tech + " 동행에서 제외"}
                    onClick={() => setExtra(extra.filter((t) => t !== tech))}
                  >
                    {tech} ×
                  </button>
                ))}
              </div>
            )}
            {original.status !== "완료" && (
              <p className={s.hint}>작업 완료는 현장 일정의 작업 카드에서 처리해 주세요.</p>
            )}
          </Section>
          <Section
            title="사진·현장 메모"
            summary={[
              photos.length ? "사진 " + photos.length + "장" : "",
              visibleMemo.trim() || customerNotes ? "메모 있음" : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          >
            <JobPhotoEditor
              label="접수 사진"
              storagePrefix="intake"
              photos={photos}
              onChange={(urls) => set("intake_photos", urls.length ? JSON.stringify(urls) : "")}
              onBusyChange={setUploading}
              onUnresolvedChange={setUnresolvedPhotos}
              disabled={saving}
            />
            {customerNotes && <p className={common.memo} data-author="customer"><b>고객 메모</b>{customerNotes}</p>}
            <label className={common.field}>
              <span>{customerNotes != null ? "직원 메모" : "현장 메모"}</span>
              <textarea
                rows={3}
                value={visibleMemo}
                onChange={(event) => {
                  const memo = event.target.value;
                  setForm((prev) => ({
                    ...prev,
                    memo: setExtraTechsInMemo(memo, getExtraTechsFromMemo(prev.memo)),
                  }));
                }}
                placeholder="출입 방법, 작업 시 요청사항 등"
              />
            </label>
          </Section>
        </div>
      </form>
      <div className={common.modalFooter}>
        {saveError && <p className={common.validation} role="alert">{saveError}</p>}
        {submitted && Object.values(errors).some(Boolean) && (
          <p className={common.validation} role="alert">
            표시된 항목을 확인해 주세요.
          </p>
        )}
        {unresolvedPhotos && (
          <p className={common.validation} role="alert">
            저장 전에 실패한 사진을 다시 올리거나 제외해 주세요.
          </p>
        )}
        <button type="submit" form={formId} className={common.primary} disabled={busy || unresolvedPhotos}>
          {uploading ? "사진 업로드 중…" : saving ? "저장 중…" : editId ? "변경 사항 저장" : "일정 등록"}
        </button>
      </div>
      {confirmDismiss && (
        <JobDialog labelledBy={dismissId} onClose={() => setConfirmDismiss(false)}>
          <div className={s.discard}>
            <h3 id={dismissId}>저장하지 않고 닫을까요?</h3>
            <p>지금까지 입력한 변경 사항이 사라져요.</p>
            <div>
              <button type="button" className={common.neutral} onClick={onClose}>
                저장하지 않고 닫기
              </button>
              <button
                type="button"
                className={common.primary}
                autoFocus
                onClick={() => setConfirmDismiss(false)}
              >
                계속 작성
              </button>
            </div>
          </div>
        </JobDialog>
      )}
    </JobDialog>
  );
}
