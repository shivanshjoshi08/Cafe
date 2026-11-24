import { Coffee } from "lucide-react";
import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" aria-label="Ember and Oak home" className={`brand ${light ? "brand-light" : ""}`}><span className="brand-icon"><Coffee size={22} strokeWidth={1.5} /></span><span>ember <i>&</i> oak<span className="brand-caption">COFFEE & A LITTLE COMFORT</span></span></Link>;
}