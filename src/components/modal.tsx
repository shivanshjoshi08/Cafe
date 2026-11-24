"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRef } from "react";
import { StorageNotice } from "./storage-notice";

export function Modal({ open, onOpenChange, title, description, children, drawer = false }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; children: React.ReactNode; drawer?: boolean }) {
  const opener = useRef<HTMLElement | null>(null);

  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="modal-overlay" /><Dialog.Content className={drawer ? "modal-content drawer-content" : "modal-content"} onOpenAutoFocus={() => { opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }} onCloseAutoFocus={(event) => { event.preventDefault(); const target = opener.current?.isConnected ? opener.current : document.querySelector<HTMLElement>("header a, header button"); target?.focus(); }}><div className="modal-heading"><div><Dialog.Title className="modal-title">{title}</Dialog.Title><Dialog.Description className="modal-description">{description}</Dialog.Description></div><Dialog.Close className="icon-button" aria-label="Close dialog"><X size={20} /></Dialog.Close></div><StorageNotice />{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}