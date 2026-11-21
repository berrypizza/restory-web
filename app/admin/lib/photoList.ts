export function photoList(value?: string): string[] {
  if (!value) return [];
  try {
    const data: unknown = JSON.parse(value);
    if (Array.isArray(data))
      return data.filter((url): url is string => typeof url === "string" && !!url);
    return typeof data === "string" && data ? [data] : [];
  } catch {
    return [value];
  }
}

// Apply only this editor's changes to the latest saved list. Keep photos added by other staff.
export function mergePhotoChanges(original: string[], draft: string[], current: string[]): string[] {
  const result = [...current];
  const untouched = [...draft];
  for (const url of original) {
    const kept = untouched.indexOf(url);
    if (kept >= 0) {
      untouched.splice(kept, 1);
    } else {
      const removed = result.indexOf(url);
      if (removed >= 0) result.splice(removed, 1);
    }
  }
  for (const url of untouched) {
    if (!result.includes(url)) result.push(url);
  }
  return result;
}
