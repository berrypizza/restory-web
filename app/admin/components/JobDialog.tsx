"use client";

import { useLayoutEffect, useRef, type KeyboardEventHandler, type ReactNode } from "react";
import s from "../operations.module.css";

export default function JobDialog({
  children,
  labelledBy,
  onClose,
  onKeyDown,
  busy = false,
  wide = false,
}: {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  busy?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
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
      onKeyDown={onKeyDown}
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
