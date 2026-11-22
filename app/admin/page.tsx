"use client";

import { useEffect, useState } from "react";
import loadComponent from "next/dynamic";
import AdminLogin from "./components/AdminLogin";
import { useIntakeStaff } from "./hooks/useIntakeStaff";
import { getSupabase } from "./lib/utils";
import { LEGACY_TECHS, type Tech } from "./lib/constants";
import s from "./workspace.module.css";

export const dynamic = "force-dynamic";

const Workspace = loadComponent(() => import("./AdminWorkspace"), {
  loading: () => <main className={s.login}><p role="status">업무 화면을 여는 중…</p></main>,
});

export default function AdminDashboard() {
  const [user, setUser] = useState<Tech | null | undefined>(undefined);
  const staff = useIntakeStaff();
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const name = localStorage.getItem("restory_logged_name");
        const expires = Number(localStorage.getItem("restory_admin_expiry"));
        setUser(Date.now() < expires ? (LEGACY_TECHS.find((u) => u.name === name)?.name ?? null) : null);
      } catch {
        setUser(null);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function login(name: Tech) {
    try {
      localStorage.setItem("restory_admin_expiry", String(Date.now() + 86_400_000));
      localStorage.setItem("restory_logged_name", name);
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    setUser(name);
  }
  async function logout() {
    setLogoutError("");
    if (staff.status !== "guest") {
      setSigningOut(true);
      try {
        const { error } = await getSupabase().auth.signOut({ scope: "local" });
        if (error) throw error;
      } catch {
        setLogoutError("로그아웃을 완료하지 못했어요. 연결 상태를 확인해 주세요.");
        return;
      } finally {
        setSigningOut(false);
      }
    }
    try {
      localStorage.removeItem("restory_admin_expiry");
      localStorage.removeItem("restory_logged_name");
    } catch {
      /* In-memory logout still applies. */
    }
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    setUser(null);
  }
  if (user === undefined || staff.status === "loading" || signingOut)
    return (
      <main className={s.login}>
        <p role="status">로그인 확인 중…</p>
      </main>
    );
  if (staff.status === "unlisted" || staff.status === "error") return <main className={s.login}>
    <div className={s.loginCard}>
      <h1>직원 계정 확인</h1>
      <p role="alert">{logoutError || (staff.status === "error" ? "직원 권한을 확인하지 못했어요." : "직원으로 등록된 계정으로 로그인해 주세요.")}</p>
      <button className={s.primary} onClick={() => window.location.reload()}>다시 확인</button>
      <button className={s.logout} onClick={logout}>로그아웃</button>
    </div>
  </main>;
  const name = staff.status === "staff" ? staff.name : user;
  if (!name) return <AdminLogin onLogin={login} />;
  return (
    <>
      {logoutError && <p role="alert">{logoutError}</p>}
      <Workspace
        key={staff.status === "staff" ? staff.id + staff.role : name}
        user={name}
        isAdmin={staff.status === "staff" && staff.role === "admin"}
        onLogout={logout}
      />
    </>
  );
}
