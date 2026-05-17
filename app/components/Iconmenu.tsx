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
    <section className="border-b border-neutral-100 bg-white px-4 py-5">
      <div className="mx-auto grid max-w-[720px] grid-cols-4 items-start text-center">
        {businessLines.map((line) => (
          <Link
            key={line.id}
            href={line.href}
            className="flex flex-col items-center justify-start gap-2 rounded-2xl px-2 py-2 transition hover:bg-neutral-50">
            <div className="flex h-[74px] w-[74px] items-center justify-center">
              <Image
                src={iconMap[line.id]}
                alt={line.title}
                width={74}
                height={74}
                className="h-[74px] w-[74px] object-contain"
                priority
              />
            </div>

            <p className="whitespace-nowrap text-[13px] font-bold leading-none text-neutral-950">
              {line.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
