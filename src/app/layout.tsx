import type { Metadata, Viewport } from "next";
import { StorageNotice } from "@/components/storage-notice";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ember & Oak — Coffee, comfort & a little pause",
  description: "Meet Ember & Oak: thoughtfully brewed coffee, fresh bakes, and a place to slow down. Explore our cafe concept and try the demo ordering experience.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f7f4ed" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><StorageNotice />{children}</body></html>;
}