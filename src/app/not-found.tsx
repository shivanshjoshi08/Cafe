import Link from "next/link";
import { ArrowLeft, Coffee } from "lucide-react";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return <><header className="container header-inner"><Brand /></header><main className="container empty-state"><span className="empty-icon"><Coffee size={35} /></span><h1 className="font-serif text-5xl mt-6 mb-4">A little off the beaten path.</h1><p>This page isn’t on the menu, but your next coffee break is.</p><Link href="/" className="button button-primary"><ArrowLeft size={17} /> Back to the cafe</Link></main></>;
}