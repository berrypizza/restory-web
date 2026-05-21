export default function YoutubeSection() {
  const videos = [
    {
      id: "mvMybNNafKk",
      title: "식당 의자 천갈이 현장",
    },
    {
      id: "fp2clUUef24",
      title: "싱크대 수리 현장",
    },
  ];

  return (
    <section className="bg-white px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-3"
            style={{ color: "#1f66ff", letterSpacing: "0.15em" }}>
            작업 영상
          </p>
          <h2
            className="text-2xl font-black md:text-3xl"
            style={{ color: "#111827" }}>
            직접 보시면 압니다
          </h2>
          <p className="mt-3 text-base" style={{ color: "#64748b" }}>
            실제 현장 수리 과정을 영상으로 확인하세요
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((v) => (
            <div
              key={v.id}
              className="overflow-hidden rounded-2xl"
              style={{
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              </div>
              <div className="px-4 py-3" style={{ backgroundColor: "#fafbfc" }}>
                <p className="text-sm font-bold" style={{ color: "#111827" }}>
                  {v.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.youtube.com/@surirang-911"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition hover:opacity-90"
            style={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            영상 더 보기
          </a>
        </div>
      </div>
    </section>
  );
}
