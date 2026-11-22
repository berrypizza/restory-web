"use client";

import { useEffect, useState } from "react";
import { TECHS, type Tech } from "../lib/constants";
import { getSupabase } from "../lib/utils";

type StaffSession =
  | { status: "loading" | "guest" | "unlisted" | "error" }
  | { status: "staff"; name: Tech; role: "admin" | "tech"; id: string };

export function useIntakeStaff() {
  const [state, setState] = useState<StaffSession>({ status: "loading" });
  useEffect(() => {
    let version = 0;
    let lastUser: string | undefined;
    let timer: number | undefined;
    let unsubscribe: (() => void) | undefined;
    try {
      const db = getSupabase();
      const { data } = db.auth.onAuthStateChange((_event, session) => {
        const id = session?.user.id;
        const token = ++version;
        window.clearTimeout(timer);
        if (!id) {
          lastUser = undefined;
          setState({ status: "guest" });
          return;
        }
        if (id !== lastUser) setState({ status: "loading" });
        lastUser = id;
        // Query after the auth callback releases its session lock.
        timer = window.setTimeout(async () => {
          try {
            const { data: member, error } = await db.from("intake_staff").select("staff_name,role").eq("user_id", id).maybeSingle();
            if (token !== version) return;
            if (error) throw error;
            if (member && TECHS.includes(member.staff_name) && ["admin", "tech"].includes(member.role)) {
              setState({ status: "staff", id, name: member.staff_name, role: member.role });
            } else setState({ status: "unlisted" });
          } catch {
            if (token === version) setState({ status: "error" });
          }
        }, 0);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch {
      timer = window.setTimeout(() => setState({ status: "error" }), 0);
    }
    return () => { version++; window.clearTimeout(timer); unsubscribe?.(); };
  }, []);
  return state;
}
