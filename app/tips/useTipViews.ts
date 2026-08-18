"use client";

import { useEffect, useMemo, useState } from "react";

type ViewableTip = {
  id: string;
  views: number;
};

type ViewsResponse = {
  views?: Record<string, number>;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function toViewMap(items: ViewableTip[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = item.views;
    return acc;
  }, {});
}

export function useTipViews(items: ViewableTip[]) {
  const ids = items.map((item) => item.id).join(",");
  const staticViewsKey = items
    .map((item) => `${item.id}:${item.views}`)
    .join("|");
  const initialViews = useMemo(() => toViewMap(items), [staticViewsKey]);
  const [views, setViews] = useState<Record<string, number>>(initialViews);

  useEffect(() => {
    setViews(initialViews);
  }, [initialViews]);

  useEffect(() => {
    if (!ids) return;

    let cancelled = false;

    fetch(`/api/tips/views?ids=${encodeURIComponent(ids)}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ViewsResponse | null) => {
        if (cancelled || !data?.views) return;
        setViews((current) => ({ ...current, ...data.views }));
      })
      .catch(() => {
        // Keep static view counts when live storage is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  return views;
}

export function useTipViewCounter(
  tip: ViewableTip,
  related: ViewableTip[] = [],
) {
  const relatedKey = related.map((item) => `${item.id}:${item.views}`).join("|");
  const items = useMemo(() => [tip, ...related], [tip, relatedKey]);
  const viewCounts = useTipViews(items);
  const [currentViews, setCurrentViews] = useState(tip.views);

  useEffect(() => {
    setCurrentViews(viewCounts[tip.id] ?? tip.views);
  }, [tip.id, tip.views, viewCounts]);

  useEffect(() => {
    const storageKey = `restory_tip_viewed:${tip.id}:${todayKey()}`;

    try {
      if (window.localStorage.getItem(storageKey)) return;
    } catch {
      return;
    }

    let cancelled = false;

    fetch(`/api/tips/${encodeURIComponent(tip.id)}/view`, {
      method: "POST",
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { views?: number } | null) => {
        if (cancelled) return;

        if (typeof data?.views === "number") {
          setCurrentViews(Math.max(tip.views, data.views));
        }

        try {
          window.localStorage.setItem(storageKey, "1");
        } catch {
          // Ignore storage failures; the server count already ran.
        }
      })
      .catch(() => {
        // Keep static view count when live storage is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [tip.id, tip.views]);

  return {
    currentViews,
    viewCounts: {
      ...viewCounts,
      [tip.id]: currentViews,
    },
  };
}
