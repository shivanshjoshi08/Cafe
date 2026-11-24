"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Coffee, IndianRupee, LayoutDashboard, PackageCheck, Plus, RotateCcw, Search, ShieldCheck, ShoppingBag, Table2 } from "lucide-react";
import { formatPrice } from "@/lib/menu";
import { advanceOrder, sampleOrders, type DemoOrder } from "@/lib/orders";
import { resetDemoStore, updateDemoStore, useDemoStore } from "@/lib/use-demo-store";
import { Brand } from "@/components/brand";
import { Modal } from "@/components/modal";
import { DatabaseBackup } from "@/components/database-backup";

type Filter = "Active" | "Payment pending" | "Ready" | "Completed" | "All";
const filters: Filter[] = ["Active", "Payment pending", "Ready", "Completed", "All"];

function matchesFilter(order: DemoOrder, filter: Filter) {
  if (filter === "Active") return order.status !== "completed";
  if (filter === "Payment pending") return order.paymentStatus !== "confirmed";
  if (filter === "Ready") return order.status === "ready";
  if (filter === "Completed") return order.status === "completed";
  return true;
}

export default function StaffPreview() {
  return <><StaffDashboard /><DatabaseBackup /></>;
}

function StaffDashboard() {
  const store = useDemoStore();
  const [filter, setFilter] = useState<Filter>("Active");
  const [search, setSearch] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const confirmationOrder = store.orders.find((order) => order.id === confirmPaymentId);
  const active = store.orders.filter((order) => order.status !== "completed");
  const pending = store.orders.filter((order) => order.paymentStatus !== "confirmed");
  const ready = store.orders.filter((order) => order.status === "ready");
  const total = store.orders.filter((order) => order.paymentStatus === "confirmed").reduce((sum, order) => sum + order.total, 0);
  const filtered = store.orders.filter((order) => matchesFilter(order, filter) && `${order.id} ${order.customerName} table ${order.table}`.toLowerCase().includes(search.trim().toLowerCase()));

  function addSamples() {
    updateDemoStore((current) => ({ ...current, orders: [...sampleOrders().filter((sample) => !current.orders.some((order) => order.id === sample.id)), ...current.orders] }));
    setMessage("Sample orders are ready. Try confirming a payment or moving an order to Ready.");
  }

  function confirmPayment() {
    updateDemoStore((current) => ({ ...current, orders: current.orders.map((order) => order.id === confirmPaymentId && order.paymentStatus === "awaiting-verification" ? { ...order, paymentStatus: "confirmed" } : order) }));
    setConfirmPaymentId(null);
    setMessage("Demo payment confirmed. No bank transaction was checked or processed.");
  }

  const nextLabels = { new: "Start preparing", preparing: "Mark as ready", ready: "Complete order", completed: "Completed" };

  return <div className="staff-shell"><a href="#staff-main" className="skip-link">Skip to dashboard</a><header className="staff-header"><div className="container header-inner"><Brand /><div className="staff-header-right"><span className="staff-preview-label"><LayoutDashboard size={15} /> Staff preview</span><Link href="/" className="button button-outline"><ArrowLeft size={15} /> Back to the cafe</Link></div></div></header><main id="staff-main" className="container staff-main"><div className="staff-demo-notice"><span><CircleAlert size={16} /><strong>DEMO WORKSPACE · Not a secure staff portal.</strong> All data lives in this browser.</span><span>No real payments, shared database, or authentication.</span></div><div className="staff-title-row"><div><span className="eyebrow">BEHIND THE COUNTER</span><h1>A good day, <em>in the making.</em></h1><p>A little less juggling. A little more time for your guests.</p></div><div className="staff-controls"><button className="button button-primary" onClick={addSamples}><Plus size={15} /> Load sample orders</button><button className="button button-outline" onClick={() => setResetOpen(true)}><RotateCcw size={14} /> Reset demo</button></div></div><div className="staff-message" role="status" aria-live="polite">{message}</div><div className="stat-grid"><div className="stat-card"><ShoppingBag size={20} /><span>Active orders</span><strong>{active.length}</strong><small>Good things in progress</small></div><div className="stat-card"><ShieldCheck size={20} /><span>Payment pending</span><strong>{pending.length}</strong><small>Manual demo verification</small></div><div className="stat-card"><Coffee size={20} /><span>Ready to serve</span><strong>{ready.length}</strong><small>A little happiness, ready</small></div><div className="stat-card"><IndianRupee size={20} /><span>Confirmed demo value</span><strong>{formatPrice(total)}</strong><small>Illustrative, not real revenue</small></div></div><div className="staff-board-toolbar"><div className="category-tabs" role="group" aria-label="Filter demo orders">{filters.map((entry) => <button key={entry} aria-pressed={filter === entry} className={filter === entry ? "active" : ""} onClick={() => setFilter(entry)}>{entry}<b>{store.orders.filter((order) => matchesFilter(order, entry)).length}</b></button>)}</div><div className="staff-search"><Search size={15} /><input aria-label="Search orders by name, table, or order number" placeholder="Find a name, table, or order…" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div><div className="order-board">{filtered.length ? filtered.map((order) => <article className="order-card" key={order.id}><div className="order-card-top"><span className="order-table"><span><Table2 size={16} /></span>Table {order.table}</span><span className={`order-badge badge-${order.status}`}>{order.status === "new" ? "New order" : order.status}</span></div><h3>{order.customerName}</h3><div className="order-meta"><span>{order.id}</span><span>·</span><span>{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>{order.isSample && <span className="sample-label">SAMPLE</span>}</div><ul className="staff-order-items">{order.items.map((line) => <li key={line.key}><div><span className="item-quantity">{line.quantity}×</span><span>{line.name}{line.customizable && <small>{line.size} · {line.milk} milk</small>}</span></div><span>{formatPrice(line.unitPrice * line.quantity)}</span></li>)}</ul>{order.notes && <p className="staff-order-note"><strong>A little note:</strong> {order.notes}</p>}<div className="staff-order-total"><span>Order total</span><strong>{formatPrice(order.total)}</strong></div><div className={`staff-payment-status payment-${order.paymentStatus}`}>{order.paymentStatus === "confirmed" ? <><ShieldCheck size={14} /> Demo payment confirmed</> : order.paymentStatus === "unpaid" ? <><Clock3 size={14} /> Customer has not simulated payment</> : <><CircleAlert size={14} /> Awaiting manual demo verification</>}</div>{order.status === "completed" ? <div className="completed-label"><Check size={14} className="inline" /> A happy coffee break, complete.</div> : order.paymentStatus === "unpaid" ? <button className="button button-outline full-width" disabled>Waiting for customer payment simulation</button> : order.paymentStatus === "awaiting-verification" ? <button className="button button-primary full-width" onClick={() => setConfirmPaymentId(order.id)}><ShieldCheck size={15} /> Confirm demo payment</button> : <button className="button button-primary full-width" onClick={() => updateDemoStore((current) => ({ ...current, orders: current.orders.map((entry) => entry.id === order.id ? advanceOrder(entry) : entry) }))}>{order.status === "ready" ? <PackageCheck size={15} /> : <Coffee size={15} />}{nextLabels[order.status]}<ArrowRight size={14} /></button>}</article>) : <div className="empty-state staff-empty"><span className="empty-icon"><Coffee size={34} strokeWidth={1.2} /></span><h3>{store.orders.length ? "A clear counter. A fresh start." : "Let’s make the first coffee break."}</h3><p>{store.orders.length ? "No orders match this view. Try another filter or clear your search." : "Load sample orders for a quick tour, or place your own order from the cafe menu."}</p>{!store.orders.length && <button className="button button-primary" onClick={addSamples}>Bring the demo to life <Plus size={16} /></button>}</div>}</div><p className="staff-footer-note">Customer and staff views sync across tabs on the same browser and origin.<br />Other devices cannot see these orders. Never use this demo to accept real payments or customer data.</p></main><Modal open={resetOpen} onOpenChange={setResetOpen} title="Start with a clean counter?" description="This removes all demo orders and cart items from this browser."><p className="confirm-modal-copy">You can load sample orders again afterwards. This action cannot be undone and affects any other open demo tabs.</p><div className="confirm-modal-actions"><button className="button button-outline" onClick={() => setResetOpen(false)}>Keep the demo</button><button className="button button-danger" onClick={() => { resetDemoStore(); setResetOpen(false); setMessage("Demo reset. Your counter is ready for a fresh start."); }}>Reset everything</button></div></Modal><Modal open={!!confirmationOrder} onOpenChange={(open) => { if (!open) setConfirmPaymentId(null); }} title="Confirm a demo payment." description="A staff-only action in the real cafe; an open simulation here."><p className="confirm-modal-copy">Confirm the illustrative payment of <strong>{formatPrice(confirmationOrder?.total ?? 0)}</strong> for <strong>{confirmationOrder?.customerName}</strong>, Table {confirmationOrder?.table}?<br /><br />In production, staff must first check receipt in the merchant’s bank or payment app. A screenshot or “I’ve paid” click is not proof. <strong>No real transaction is verified by this demo.</strong></p><div className="confirm-modal-actions"><button className="button button-outline" onClick={() => setConfirmPaymentId(null)}>Not yet</button><button className="button button-primary" onClick={confirmPayment}><Check size={16} /> Confirm simulation</button></div></Modal></div>;
}