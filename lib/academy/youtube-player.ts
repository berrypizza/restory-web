type PlayerEvent = { target: YouTubePlayer; data: number };
export type YouTubePlayer = { getPlayerState(): number; destroy(): void };
type YouTubeAPI = { Player: new (element: HTMLElement, options: { events: { onReady(event: PlayerEvent): void; onStateChange(event: PlayerEvent): void } }) => YouTubePlayer };
type YouTubeWindow = Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
let pending: Promise<YouTubeAPI> | undefined;

/** Load only after a visitor asks to play; both academy players share one SDK. */
export function loadYouTubeAPI(): Promise<YouTubeAPI> {
  const host = window as YouTubeWindow;
  if (host.YT?.Player) return Promise.resolve(host.YT);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const previous = host.onYouTubeIframeAPIReady;
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    const cleanup = () => {
      clearTimeout(timeout);
      if (host.onYouTubeIframeAPIReady === ready) host.onYouTubeIframeAPIReady = previous;
      script.onerror = null;
    };
    const fail = () => { cleanup(); script.remove(); pending = undefined; reject(new Error("YouTube API unavailable")); };
    const ready = () => {
      cleanup();
      try { previous?.(); } finally {
        if (host.YT?.Player) resolve(host.YT); else fail();
      }
    };
    const timeout = setTimeout(fail, 15000);
    host.onYouTubeIframeAPIReady = ready;
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return pending;
}

/** Count real playback, never poster clicks/ready/paused/buffering; once per mounted player. */
export function createPlaybackObserver(emit: (stage: "started" | "completed") => void) {
  let started = false, completed = false;
  return (state: number) => {
    if (state === 1 && !started) { started = true; emit("started"); }
    // ENDED means reaching the end, not proof that every second was watched (seeking is possible).
    if (state === 0 && started && !completed) { completed = true; emit("completed"); }
  };
}
