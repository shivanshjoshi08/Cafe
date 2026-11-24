import { Check, Clock3, Coffee, PackageCheck, ShieldCheck } from "lucide-react";
import type { DemoOrder } from "@/lib/orders";
import { OrderReceipt } from "./order-receipt";

export function OrderProgress({ order }: { order: DemoOrder }) {
  const current = order.paymentStatus !== "confirmed" ? 0 : order.status === "new" ? 1 : order.status === "preparing" ? 2 : order.status === "ready" ? 3 : 4;
  const steps = [{ label: "Payment verification", icon: ShieldCheck }, { label: "Order confirmed", icon: Check }, { label: "Made with care", icon: Coffee }, { label: "Ready for you", icon: PackageCheck }];
  return <div className="order-progress">
    <div className="order-summary-heading"><span className="eyebrow">YOUR LITTLE COFFEE BREAK</span><h3>{order.status === "completed" ? "Thanks for stopping by." : order.status === "ready" ? "Something good is ready." : order.paymentStatus === "confirmed" ? "You're in good hands." : "Your order is on its way."}</h3></div>
    <OrderReceipt order={order} showItems />
    <ol className="progress-steps">{steps.map(({ label, icon: Icon }, index) => <li key={label} className={`${index < current ? "done" : ""} ${index === current ? "current" : ""}`}>
      <span className="progress-icon">{index < current ? <Check size={17} /> : <Icon size={17} />}</span>
      <div><strong>{label}</strong><small>{index === current ? index === 0 ? order.paymentStatus === "unpaid" ? "Payment has not been simulated yet" : "Waiting for demo staff confirmation" : index === 1 ? "Waiting for preparation to start" : index === 2 ? "A little patience, a lot of care" : "Your table is about to get happier" : index < current ? "Complete" : "Up next"}</small></div>
      {index === current && <Clock3 size={15} />}
    </li>)}</ol>
    <div className="notice notice-subtle">This is a local demo. Status changes come from the staff preview in this browser, not a real cafe. Keep your order ID for manual payment matching.</div>
  </div>;
}