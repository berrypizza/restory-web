import Image from "next/image";
import { TECH_PHOTO } from "../lib/constants";
import s from "../workspace.module.css";

export default function TechnicianAvatar({ name, small = false }: { name: string; small?: boolean }) {
  const src = TECH_PHOTO[name];
  const size = small ? 22 : 38;
  return (
    <span className={s.avatar} data-small={small || undefined} aria-hidden="true">
      {src ? <Image alt="" src={src} width={size} height={size} /> : name.slice(-2)}
    </span>
  );
}
