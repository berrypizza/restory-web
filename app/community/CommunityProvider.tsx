"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { communityClient } from "@/lib/community/client";
import type { CommunityProfile } from "@/lib/community/types";

type CommunityAuth = {
  user: User | null;
  profile: CommunityProfile | null;
  moderator: boolean;
  loading: boolean;
  error: string;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};
const Context = createContext<CommunityAuth | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [moderator, setModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProfile = useCallback(async () => {
    try {
      const db = communityClient();
      const {
        data: { user: current },
      } = await db.auth.getUser();
      setUser(current);
      if (!current) {
        setProfile(null);
        setModerator(false);
        return;
      }
      const [p, m] = await Promise.all([
        db
          .from("community_profiles")
          .select("id,nickname")
          .eq("id", current.id)
          .maybeSingle(),
        db
          .from("community_moderators")
          .select("user_id")
          .eq("user_id", current.id)
          .maybeSingle(),
      ]);
      setProfile(p.data);
      setModerator(Boolean(m.data));
    } catch {
      setError(
        "로그인 상태를 확인하지 못했습니다. 새로고침 후 다시 시도해주세요.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const db = communityClient();
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (active) void refreshProfile();
      }, 0);
    });
    return () => {
      active = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [refreshProfile]);

  async function signOut() {
    const { error: signOutError } = await communityClient().auth.signOut({
      scope: "local",
    });
    if (signOutError) {
      setError("로그아웃하지 못했습니다. 다시 시도해주세요.");
      return;
    }
    setUser(null);
    setProfile(null);
    setModerator(false);
  }

  return (
    <Context
      value={{
        user,
        profile,
        moderator,
        loading,
        error,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </Context>
  );
}

export function useCommunity() {
  const context = useContext(Context);
  if (!context) throw new Error("CommunityProvider is required");
  return context;
}
