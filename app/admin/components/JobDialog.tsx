"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "../operations.module.css";

export default function JobDialog({
  children,
  labelledBy,
  onClose,
  busy = false,
  wide = false,
}: {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  busy?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className={wide ? s.imageDialog : s.modal}
      onCancel={(event) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        event.stopPropagation();
        if (!busy) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
