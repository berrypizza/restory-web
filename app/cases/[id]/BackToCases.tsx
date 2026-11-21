"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BackToCases({ id }: { id: string }) {
  const current = useSearchParams();
  const list = new URLSearchParams();
  for (const key of ["cat", "tag", "q", "page"]) {
    const value = current.get(key);
    if (value) list.set(key, value);
  }
  return <Link href={list.size ? `/cases?${list}#${id}` : "/cases"}>작업 사례 목록</Link>;
}
