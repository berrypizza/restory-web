import Image from "next/image";
import Link from "next/link";
import { businessLines } from "@/lib/site-config";
import { fieldInfo } from "@/lib/public-navigation";
import s from "./customer.module.css";

export default function BusinessLineCards() {
  return (
    <section id="services" data-service-section="services" className={s.section}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><h2>어디를 수리할까요?</h2></div>
        <div className={s.fieldGrid}>{businessLines.map(line => {
          const field = fieldInfo[line.id];
          return (
            <Link href={line.href} key={line.id} className={s.fieldCard}>
              <div className={s.fieldPhoto}><Image src={field.image} alt="" fill sizes="(max-width: 760px) 45vw, 265px" style={{ objectPosition: field.position }} /></div>
              <div className={s.fieldCopy}><h3>{field.label}</h3><p>{field.detail}</p></div>
            </Link>
          );
        })}</div>
      </div>
    </section>
  );
}
