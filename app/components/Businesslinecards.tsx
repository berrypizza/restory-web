import Image from "next/image";
import Link from "next/link";
import { businessLines, type BusinessLineId } from "@/lib/site-config";

const iconMap: Record<BusinessLineId, string> = {
  repair: "/images/icon_sink_repair.png",
  kitchen: "/images/icon_sink_reform.png",
  leather: "/images/icon_leather.png",
};

export default function BusinessLineCards() {
  return (
    <section className="bg-gradient-to-b from-[#f7f9fd] to-[#eef2f8] px-5 py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-7 text-[22px] font-black tracking-[-0.04em] text-neutral-950 md:text-[26px]">
          한 번의 클릭, 필요한 작업만
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {businessLines.map((line) => (
            <Link
              key={line.id}
              href={line.href}
              className="overflow-hidden rounded-[20px] bg-gradient-to-b from-white to-[#fbfcff] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
              <div className="relative min-h-[160px] p-6">
                <h3 className="text-[20px] font-black tracking-[-0.04em] text-neutral-950">
                  {line.title}
                </h3>

                <p className="mt-3 max-w-[210px] whitespace-pre-line text-[14px] font-medium leading-[1.7] text-neutral-700">
                  {line.description}
                </p>

                <Image
                  src={iconMap[line.id]}
                  alt={line.title}
                  width={96}
                  height={96}
                  className="absolute bottom-5 right-6 h-[86px] w-[86px] object-contain"
                />
              </div>

              <div className="border-t border-[#e5eaf2] bg-gradient-to-b from-white to-[#f9fbff] px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-black text-[#005cff]">
                    자세히 보기
                  </span>
                  <span className="text-[22px] font-black text-[#005cff]">
                    ›
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
