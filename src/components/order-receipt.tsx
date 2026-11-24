import { formatPrice } from "@/lib/menu";
import { paymentMethodLabels, type DemoOrder } from "@/lib/orders";

function formatTime(value: string) {
  return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function OrderReceipt({ order, compact = false, showItems = false }: { order: DemoOrder; compact?: boolean; showItems?: boolean }) {
  return <div className="order-receipt" aria-label="Order details">
    <span className="receipt-label">Order ID</span>
    <strong className="order-id" data-testid="order-id">{order.id}</strong>
    <dl className="receipt-details">
      {!compact && <>
        <div><dt>Customer</dt><dd>{order.customerName}</dd></div>
        <div><dt>Table</dt><dd>{order.table}</dd></div>
        <div><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
      </>}
      <div><dt>Payment method</dt><dd>{paymentMethodLabels[order.paymentMethod]}</dd></div>
      {order.paymentMethod !== "cash" && <div><dt>Payment reference</dt><dd>{order.paymentReference || "Not provided"}</dd></div>}
      <div><dt>Order placed</dt><dd>{formatTime(order.createdAt)}</dd></div>
      {order.paymentSubmittedAt && <div><dt>Payment submitted</dt><dd>{formatTime(order.paymentSubmittedAt)}</dd></div>}
      {order.paymentConfirmedAt && <div><dt>Owner confirmed</dt><dd>{formatTime(order.paymentConfirmedAt)}</dd></div>}
    </dl>
    {!compact && order.notes && <p className="receipt-notes"><strong>Note:</strong> {order.notes}</p>}
    {showItems && <ul className="receipt-items" aria-label="Order items">
      {order.items.map((item) => <li key={item.key}>
        <div><strong>{item.quantity}× {item.name}</strong>{item.customizable && <small>{item.size} · {item.milk} milk</small>}</div>
        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
      </li>)}
    </ul>}
  </div>;
}