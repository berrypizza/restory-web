import { redirect } from "next/navigation";

export default async function YoutubeShortEntryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  const incoming = await searchParams;

  for (const [key, value] of Object.entries(incoming)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    }
  }

  if (!params.has("utm_source") && !params.has("from")) {
    params.set("from", "youtube");
  }

  redirect(`/?${params.toString()}`);
}
