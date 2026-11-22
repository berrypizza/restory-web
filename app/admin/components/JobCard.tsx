"use client";

import { useId, useState } from "react";
import AdminIcon from "./AdminIcon";
import TechnicianAvatar from "./TechnicianAvatar";
import PhotoCapture, { type PhotoMode } from "./PhotoCapture";
import MaterialSection from "./MaterialSection";
import { mergePhotoChanges, photoList } from "../lib/photoList";
import JobPhotoViewer from "./JobPhotoViewer";
import { CustomerPhotoViewer } from "./CustomerPhotos";
import photoStyle from "./jobPhotos.module.css";
import type { Job } from "../lib/types";
import type { FollowUpKind } from "../lib/followUp";
import { isFinishedJob } from "../lib/settlement";
import { STATUSES, TECH_COLOR, TECHS, type Status, type Tech } from "../lib/constants";
import { canScheduleInstall, visitStatus } from "../lib/schedule";
import { addOneYear, formatDate, formatFullDate, formatTime, naverMapUrl, today } from "../lib/utils";
import {
  getExtraTechsFromMemo,
  getJobTechs,
  getVisibleMemo,
  setExtraTechsInMemo,
} from "../lib/jobTechs";
import s from "../operations.module.css";

interface JobCardProps {
  job: Job;
  onUpdate: (id: string, patch: Partial<Job>, expected?: Partial<Job>) => Promise<boolean>;
  onEdit: (job: Job) => void;
  onRemoveInstall: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
  onFollowUp: (job: Job, kind: FollowUpKind) => void;
  onShowSource: (id: string) => void;
  isAdmin?: boolean;
  defaultExpanded?: boolean;
  scheduleDate?: string | null;
  schedulePhase?: "visit" | "install";
}

export default function JobCard({
  job,
  onUpdate,
  onEdit,
  onRemoveInstall,
  onDeleteJob,
  onFollowUp,
  onShowSource,
  isAdmin = true,
  defaultExpanded = false,
  scheduleDate,
  schedulePhase,
}: JobCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [photoAction, setPhotoAction] = useState<PhotoMode | null>(null);
  const [viewPhotos, setViewPhotos] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [notice, setNotice] = useState("");
  const detailId = useId();
  const techs = getJobTechs(job);
  const extra = getExtraTechsFromMemo(job.memo);
  const memo = getVisibleMemo(job.memo).trim();
  const intake = photoList(job.intake_photos);
  const photos = photoList(job.completion_photo);
  const date = scheduleDate || job.visit_date;
  const installVisit = schedulePhase
    ? schedulePhase === "install"
    : date === job.install_date && date !== job.visit_date;
  const measurementVisit = job.is_measurement && Boolean(scheduleDate || schedulePhase) && !installVisit;
  const time = installVisit ? job.install_time : job.visit_time;
  const now = today();
  const setExtra = (next: Tech[]) => onUpdate(job.id, { memo: setExtraTechsInMemo(job.memo, next) });
  const daysLeft = job.as_until
    ? Math.round((Date.parse(job.as_until) - Date.parse(now)) / 86_400_000)
    : null;

  const allPhotos = [
    ...intake.map((url, i) => ({ url, label: `접수 사진 ${i + 1}`, group: "접수" })),
    ...photos.map((url, i) => ({ url, label: `완료 사진 ${i + 1}`, group: "완료" })),
  ];
  const finished = isFinishedJob(job);
  const customerPhotos = job.customer_photo_count ?? 0;
  const photoCount = allPhotos.length + customerPhotos;
  const measured = canScheduleInstall(job);
  const statusText = visitStatus(job, installVisit ? "install" : measurementVisit ? "visit" : undefined);
  const canCompleteThisVisit =
    !finished &&
    job.status !== "취소" &&
    !(measured && (measurementVisit || !job.install_date)) &&
    !(installVisit && !measured);
  const stateGuard = {
    status: job.status,
    is_measurement: job.is_measurement,
    install_completed: job.install_completed,
  };
  async function changeStatus(next: Status) {
    if (changingStatus || next === job.status) return;
    if (next === "완료" && !job.is_measurement) {
      setPhotoAction(job.is_aftercare ? "aftercare" : "complete");
      return;
    }
    if (
      job.status === "완료" &&
      !confirm(
        job.is_aftercare ? "A/S 방문 완료를 해제할까요?" : finished
          ? "완료 처리를 해제할까요? 이 작업은 완료 매출에서 빠집니다."
          : "실측 완료를 해제할까요?",
      )
    )
      return;
    setChangingStatus(true);
    setNotice("");
    try {
      const patch: Partial<Job> = { status: next };
      if (job.is_measurement) patch.install_completed = false;
      if (await onUpdate(job.id, patch, stateGuard)) {
        setNotice(
          next === "완료" ? "실측을 마쳤어요. 시공 대기로 이동합니다." : "진행 상태를 변경했어요.",
        );
        if (isAdmin && job.is_measurement && next === "완료" && !job.install_date)
          onFollowUp({ ...job, ...patch }, "install");
      }
    } finally {
      setChangingStatus(false);
    }
  }
  return (
    <article className={s.jobCard}>
      <div className={s.jobBody}>
        <div className={s.jobMeta}>
          <span className={s.visitTime}>
            <AdminIcon name="time" size={16} />
            {!scheduleDate && formatFullDate(date) + " · "}{time ? formatTime(time) : "시간 미정"}
          </span>
          {job.is_measurement && (
            <span className={s.measure}>{installVisit ? "시공 방문" : "실측 방문"}</span>
          )}
          {job.is_aftercare && <span className={s.measure}>A/S · 매출 제외</span>}
          <span className={s.status} data-status={statusText}>{statusText}</span>
        </div>
        <div className={s.jobName}>
          <h4>
            {job.name || "이름 미입력"} <small>고객님</small>
          </h4>
          {!job.is_aftercare && job.price > 0 && (
            <span aria-label={`견적 금액 ${job.price.toLocaleString("ko-KR")}원`}>
              {job.price.toLocaleString("ko-KR")}원
            </span>
          )}
        </div>
        {job.symptom && <p className={s.jobProduct}>{job.symptom}</p>}
        {job.region && (
          <a
            href={naverMapUrl(job.region)}
            target="_blank"
            rel="noopener noreferrer"
            className={s.mapLink}
          >
            <AdminIcon name="pin" size={16} />
            <span>{job.region}</span>
            <b>길찾기 ↗</b>
          </a>
        )}
        <div className={s.jobContacts}>
          <div className={s.crewList}>
            {techs.length ? (
              techs.map((tech, i) => (
                <span key={tech} title={`${i ? "동행" : "주담당"} 기사`}>
                  <TechnicianAvatar name={tech} small />
                  {tech}
                </span>
              ))
            ) : (
              <span>기사 미배정</span>
            )}
          </div>
          {job.phone && (
            <a href={`tel:${job.phone}`} className={s.phone} aria-label={`${job.name} 고객에게 전화 ${job.phone}`}>
              <AdminIcon name="phone" size={15} /><span>{job.phone}</span>
            </a>
          )}
        </div>
        {memo && (
          <p className={s.memo}>
            <b>현장 메모</b>
            {memo}
          </p>
        )}
        {job.is_measurement && (!installVisit || job.install_completed) && (
          <p className={s.detailNote}>
            시공{" "}
            {job.install_completed
              ? `완료${job.install_completed_on ? ` · ${formatDate(job.install_completed_on)}` : ""}`
              : job.install_date
                ? `${formatDate(job.install_date)} ${formatTime(job.install_time || "")}`
                : "일정 미정"}
          </p>
        )}
        {finished && !job.is_aftercare && job.as_until && (
          <p className={s.detailNote}>
            A/S {daysLeft !== null && daysLeft < 0 ? "만료" : "기한"} · {job.as_until}
            {daysLeft !== null && daysLeft >= 0 && daysLeft <= 30 && ` (${daysLeft}일 남음)`}
          </p>
        )}
      </div>
      <div className={photoStyle.cardActions}>
        <button
          type="button"
          className={photoStyle.secondary}
          onClick={() => {
            if (photoCount) setViewPhotos(true);
            else setPhotoAction("manage");
          }}
        >
          {photoCount ? `현장 사진 ${photoCount}장` : "현장 사진 추가"}
        </button>
        {canCompleteThisVisit && (
          <button
            type="button"
            className={photoStyle.primary}
            disabled={changingStatus}
            onClick={() => {
              if (job.is_measurement && !measured) void changeStatus("완료");
              else setPhotoAction(measured ? "install" : job.is_aftercare ? "aftercare" : "complete");
            }}
          >
            {changingStatus
              ? "저장 중…"
              : measured
                ? "시공 완료 처리"
                : job.is_measurement
                  ? "실측 완료 처리"
                  : job.is_aftercare ? "A/S 완료 처리" : "작업 완료 처리"}
          </button>
        )}
        {isAdmin && measured && (
          <button type="button" className={job.install_date ? photoStyle.secondary : photoStyle.primary}
            onClick={() => onFollowUp(job, "install")}>{job.install_date ? "시공 일정 변경" : "시공일 정하기"}</button>
        )}
        {isAdmin && finished && <button type="button" className={photoStyle.secondary}
          onClick={() => onFollowUp(job, "aftercare")}>A/S 접수</button>}
      </div>
      {notice && (
        <p className={photoStyle.notice} role="status">
          {notice}
        </p>
      )}
      <button
        className={s.detailsToggle}
        type="button"
        aria-expanded={expanded}
        aria-controls={detailId}
        aria-label={`${job.name || "고객"} 작업 상세 ${expanded ? "닫기" : "열기"}`}
        onClick={() => setExpanded(!expanded)}
      >
        작업 상세
        <span aria-hidden="true">{expanded ? "접기 ⌃" : "열기 ⌄"}</span>
      </button>
      {expanded && (
        <div id={detailId} className={s.jobDetails}>
          <div className={s.twoCols}>
            <label className={s.field}>
              <span>진행 상태</span>
              <select
                aria-label="진행 상태"
                value={job.status}
                disabled={changingStatus}
                onChange={(event) => void changeStatus(event.target.value as Status)}
              >
                {STATUSES.filter((status) => status !== "완료" || job.status === "완료").map(
                  (status) => (
                    <option key={status}>{status}</option>
                  ),
                )}
              </select>
            </label>
            <label className={s.field}>
              <span>주담당 기사</span>
              <select
                aria-label="주담당 기사"
                value={job.tech}
                onChange={(event) => {
                  const tech = event.target.value as Tech;
                  onUpdate(job.id, {
                    tech,
                    memo: setExtraTechsInMemo(
                      job.memo,
                      extra.filter((item) => item !== tech),
                    ),
                  });
                }}
              >
                <option value="">미배정</option>
                {TECHS.map((tech) => (
                  <option key={tech}>{tech}</option>
                ))}
              </select>
            </label>
          </div>
          {isAdmin && (
            <div className={s.extraCrew}>
              <label className={s.field}>
                <span>동행 기사</span>
                <select
                  aria-label="동행 기사"
                  value=""
                  onChange={(event) => {
                    if (event.target.value) setExtra([...extra, event.target.value as Tech]);
                  }}
                  disabled={!TECHS.some((tech) => tech !== job.tech && !extra.includes(tech))}
                >
                  <option value="">동행 기사 추가</option>
                  {TECHS.filter((tech) => tech !== job.tech && !extra.includes(tech)).map((tech) => (
                    <option key={tech}>{tech}</option>
                  ))}
                </select>
              </label>
              {extra.length > 0 && (
                <div className={s.crewChips}>
                  {extra.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      aria-label={`${tech} 동행에서 제외`}
                      onClick={() => setExtra(extra.filter((item) => item !== tech))}
                    >
                      <i style={{ background: TECH_COLOR[tech] }} />
                      {tech} ×
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <MaterialSection
            jobId={job.id}
            customerName={job.name}
            visitDate={job.visit_date}
            isAdmin={isAdmin}
          />
          {isAdmin && (
            <div className={s.manageActions}>
              <button type="button" className={s.neutral} onClick={() => onEdit(job)}>
                접수 수정
              </button>
              {job.aftercare_source_id && <button type="button" className={s.neutral}
                onClick={() => onShowSource(job.aftercare_source_id!)}>원작업 보기</button>}
              {!finished && job.status !== "취소" && <button type="button" className={s.neutral}
                onClick={() => onFollowUp(job, "aftercare")}>A/S 접수</button>}
              {installVisit ? (
                <button type="button" className={s.deleteButton} onClick={() => onRemoveInstall(job)}>시공 일정 삭제</button>
              ) : (
                <button type="button" className={s.deleteButton} onClick={() => onDeleteJob(job)}>접수 전체 삭제</button>
              )}
            </div>
          )}
        </div>
      )}
      {viewPhotos && customerPhotos > 0 && <CustomerPhotoViewer jobId={job.id} extra={allPhotos}
        onClose={() => setViewPhotos(false)} onManage={() => { setViewPhotos(false); setPhotoAction("manage"); }} />}
      {viewPhotos && !customerPhotos && allPhotos.length > 0 && (
        <JobPhotoViewer
          photos={allPhotos}
          onClose={() => setViewPhotos(false)}
          onManage={() => {
            setViewPhotos(false);
            setPhotoAction("manage");
          }}
        />
      )}
      {photoAction && (
        <PhotoCapture
          jobId={job.id}
          photos={photos}
          mode={photoAction}
          customer={job.name || "미입력"}
          price={job.is_aftercare ? 0 : job.price || 0}
          onCancel={() => setPhotoAction(null)}
          onDone={async (draft, original, finish) => {
            const urls = mergePhotoChanges(original, draft, photos);
            const patch: Partial<Job> = { completion_photo: urls.length ? JSON.stringify(urls) : "" };
            const expected: Partial<Job> = { completion_photo: job.completion_photo };
            if (finish) {
              if (
                job.status === "취소" ||
                (photoAction === "install" ? !measured || !job.install_date : job.is_measurement || (photoAction === "complete" && !urls.length))
              )
                return false;
              Object.assign(expected, stateGuard);
              if (!finished) {
                patch.status = "완료";
                if (!job.is_aftercare) patch.as_until = addOneYear(today());
                if (photoAction === "install") {
                  expected.install_date = job.install_date;
                  patch.install_completed = true;
                }
              }
            }
            const saved = await onUpdate(job.id, patch, expected);
            if (saved) {
              setPhotoAction(null);
              setNotice(
                finish
                  ? photoAction === "install"
                    ? "시공 완료로 저장했어요."
                    : job.is_aftercare ? "A/S 방문을 완료했어요." : "작업을 완료했어요."
                  : "현장 사진을 저장했어요.",
              );
            }
            return saved;
          }}
        />
      )}
    </article>
  );
}
