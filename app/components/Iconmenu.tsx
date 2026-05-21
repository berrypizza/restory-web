import Image from "next/image";
import Link from "next/link";
import { businessLines, type BusinessLineId } from "@/lib/site-config";

const iconMap: Record<BusinessLineId, string> = {
  repair: "/images/icon_sink_repair.png",
  kitchen: "/images/icon_sink_reform.png",
  leather: "/images/icon_leather.png",
  sofa: "/images/icon_sofa.png",
};

export default function IconMenu() {
  return (
    <section className="bg-white px-5 py-7">
      <div className="mx-auto grid max-w-[520px] grid-cols-4 gap-y-5 gap-x-3">
        {businessLines.map((line) => (
          <Link
            key={line.id}
            href={line.href}
            className="flex flex-col items-center gap-2.5 group">
            {/* 아이콘 박스 - 아정당 스타일 둥근 사각형 */}
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:shadow-md md:h-20 md:w-20"
              style={{
                backgroundColor: "#f5f7fb",
                border: "1px solid #eef1f6",
              }}>
              <Image
                src={iconMap[line.id]}
                alt={line.title}
                width={48}
                height={48}
                className="h-10 w-10 object-contain md:h-12 md:w-12"
                priority
              />
            </div>

            {/* 라벨 */}
            <p className="text-center text-xs font-bold leading-tight text-neutral-700 md:text-sm">
              {line.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
