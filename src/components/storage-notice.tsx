"use client";

import { CircleAlert } from "lucide-react";
import { useTemporaryStorage } from "@/lib/use-demo-store";

export function StorageNotice() {
  const temporary = useTemporaryStorage();
  if (!temporary) return null;
  return <div className="storage-warning" role="status"><CircleAlert size={17} /><span><strong>Temporary demo mode:</strong> browser storage is unavailable. Reloading will lose your cart and orders, and other tabs cannot see these changes.</span></div>;
}