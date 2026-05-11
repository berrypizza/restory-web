export default function TrustBar() {
  const signals = [
    { icon: "★★★★★", text: "4.9 실제 고객 후기" },
    { icon: "🚫", text: "수리 불가 시 출장비 0원" },
    { icon: "📍", text: "TODO: 지역" },
  ];

  return (
    <div style={{ backgroundColor: "#161616", borderBottom: "1px solid #2a2a2a" }}>
      <div className="mx-auto max-w-5xl px-6 py-2 flex items-center justify-center gap-0 overflow-x-auto">
        {signals.map((s, i) => (
          <div key={i} className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-0.9">
              <span className="text-xs" style={{ color: "#2fae8a" }}>{s.icon}</span>
              <span className="text-xs whitespace-nowrap" style={{ color: "#7a7a7a" }}>{s.text}</span>
            </div>
            {i < signals.length - 1 && (
              <div className="h-3 w-px mx-3 flex-shrink-0" style={{ backgroundColor: "#2a2a2a" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
