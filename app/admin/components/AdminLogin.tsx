"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { USERS, type Tech } from "../lib/constants";
import { signInStaff } from "../lib/staffLogin";
import AdminIcon from "./AdminIcon";
import s from "../workspace.module.css";

export default function AdminLogin({ onLogin }: { onLogin: (name: Tech) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <main className={s.login}>
      <div className={s.loginFrame}>
        <div className={s.loginVisual}>
          <div className={s.loginBrand}>
            <Image src="/images/logo-cc.png" width={52} height={52} alt="" />
            <p>리스토리<br />스튜디오</p>
          </div>
          <Image className={s.teamImage} src="/images/team-work-v2.png" alt=""
            width={1123} height={794} sizes="(max-width: 700px) 42vw, 510px" loading="eager" />
        </div>
        <div className={s.loginCard}>
          <h1>관리자 로그인</h1>
          <p className={s.loginHint}>현장 업무에 사용하는 팀 계정으로 로그인해 주세요.</p>
          <form
            onChange={() => setInvalid(false)}
            method="post"
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy) return;
              const fields = new FormData(event.currentTarget);
              const id = String(fields.get("id")).trim().normalize("NFC");
              const password = String(fields.get("password"));
              const user = USERS.find(u => u.id === id && u.password === password);
              if (user) return onLogin(user.name);
              setBusy(true);
              try {
                if (!await signInStaff(id, password)) setInvalid(true);
              } catch {
                setInvalid(true);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label htmlFor="admin-id">아이디</label>
            <input
              name="id"
              id="admin-id"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              aria-describedby={invalid ? "login-error" : undefined}
              aria-invalid={invalid || undefined}
            />
            <label htmlFor="admin-password">비밀번호</label>
            <div className={s.password}>
              <input
                name="password"
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? "login-error" : undefined}
              />
              <button
                className={s.square}
                type="button"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <AdminIcon name={showPassword ? "eyeOff" : "eye"} />
              </button>
            </div>
            {invalid && (
              <p role="alert" id="login-error">
                아이디와 비밀번호를 다시 확인해 주세요.
              </p>
            )}
            <button type="submit" className={s.primary} disabled={busy}>
              {busy ? "로그인 중…" : "로그인"} <AdminIcon name="forward" size={17} />
            </button>
          </form>
          <Link className={s.consultLink} href="/admin/intake">
            <span className={s.consultIcon}><AdminIcon name="list" size={19} /></span>
            <span>직원 계정으로 로그인<small>고객 접수함과 현장 일정</small></span>
            <AdminIcon name="arrow" size={16} />
          </Link>
          <Link className={s.consultLink} href="/admin/consultations">
            <span className={s.consultIcon}><AdminIcon name="review" size={19} /></span>
            <span>기살 상담 신청 관리<small>카카오 관리자 계정으로 이용</small></span>
            <AdminIcon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
