"use client";

import { useEffect, useState } from "react";
import loadComponent from "next/dynamic";
import AdminLogin from "./components/AdminLogin";
import { USERS, type Tech } from "./lib/constants";
import s from "./workspace.module.css";

export const dynamic = "force-dynamic";

const Workspace = loadComponent(() => import("./AdminWorkspace"), {
  loading: () => <main className={s.login}><p role="status">업무 화면을 여는 중…</p></main>,
});

export default function AdminDashboard() {
  const [user, setUser] = useState<Tech | null | undefined>(undefined);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const name = localStorage.getItem("restory_logged_name");
        const expires = Number(localStorage.getItem("restory_admin_expiry"));
        setUser(Date.now() < expires ? (USERS.find((u) => u.name === name)?.name ?? null) : null);
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
  function logout() {
    try {
      localStorage.removeItem("restory_admin_expiry");
      localStorage.removeItem("restory_logged_name");
    } catch {
      /* In-memory logout still applies. */
    }
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    setUser(null);
  }
  if (user === undefined)
    return (
      <main className={s.login}>
        <p role="status">로그인 확인 중…</p>
      </main>
    );
  if (!user) return <AdminLogin onLogin={login} />;
  return (
    <Workspace
      key={user}
      user={user}
      isAdmin={USERS.some((u) => u.name === user && u.role === "admin")}
      onLogout={logout}
    />
  );
}
