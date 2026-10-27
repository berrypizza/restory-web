"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function communityClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key)
      throw new Error("커뮤니티 연결 설정을 확인하고 있습니다.");
    client = createClient(url, key, {
      auth: {
        flowType: "pkce",
        storageKey: "restory-community-auth",
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

export function communityError(
  error: { code?: string; message?: string } | null,
) {
  if (error?.code === "23505")
    return "이미 사용 중인 닉네임이거나 등록된 내용입니다.";
  if (error?.message?.includes("community_rate_limit"))
    return "잠시 쉬었다 다시 작성해주세요. 반복 등록을 제한하고 있습니다.";
  if (error?.code === "42501") return "로그인 상태와 작성 권한을 확인해주세요.";
  return "저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해주세요.";
}
