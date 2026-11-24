"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, CircleAlert, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { formatPrice, menu } from "@/lib/menu";
import { createOrder, getCartTotal, getOrderLines, MAX_QUANTITY } from "@/lib/orders";
import { updateDemoStore, useDemoStore } from "@/lib/use-demo-store";
import { Modal } from "./modal";
import { OrderProgress } from "./order-progress";

export function CheckoutDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const store = useDemoStore();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [table, setTable] = useState("4");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const order = store.orders.find((entry) => entry.id === orderId);
  const lines = getOrderLines(store.cart);
  const total = getCartTotal(store.cart);

  function changeQuantity(key: string, delta: number) {
    updateDemoStore((current) => ({ ...current, cart: current.cart.map((line) => line.key === key ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + delta) } : line).filter((line) => line.quantity > 0) }));
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (placing) return;
    setPlacing(true);
    try {
      let nextId = "";
      await updateDemoStore((current) => {
        const next = createOrder(current.cart, customerName, Number(table), notes);
        nextId = next.id;
        return { ...current, cart: [], orders: [next, ...current.orders] };
      });
      setOrderId(nextId);
      setError("");
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setPlacing(false); }
  }

  function simulatePayment() {
    updateDemoStore((current) => ({ ...current, orders: current.orders.map((entry) => entry.id === orderId && entry.paymentStatus === "unpaid" ? { ...entry, paymentStatus: "awaiting-verification" } : entry) }));
  }

  function close() { onClose(); setOrderId(null); }

  return <Modal open={open} onOpenChange={(value) => { if (!value) close(); }} drawer title={order ? "A little closer to coffee." : "Your bag of good things."} description={order ? "Demo checkout · no money changes hands" : "A coffee break is always a good idea."}>{order ? <div className="payment-view">{order.paymentStatus === "unpaid" ? <><div className="demo-pill"><CircleAlert size={14} /> DEMO PAYMENT — DO NOT SEND MONEY</div><div className="payment-total"><span>Your demo total</span><strong>{formatPrice(order.total)}</strong><small>{order.id} · Table {order.table}</small></div><div className="qr-wrap"><QRCodeSVG value={`EMBER_AND_OAK_DEMO|ORDER=${order.id}|AMOUNT_INR=${order.total}|NO_REAL_PAYMENT`} size={190} level="M" marginSize={3} title="Demo-only QR code. This is not a payment address." /></div><p className="qr-explanation">In the real cafe, a merchant QR would appear here. This QR contains <strong>only demo text</strong> and cannot initiate a payment.</p><button className="button button-primary full-width" onClick={simulatePayment}><Check size={17} /> I’ve paid — simulate payment</button><p className="small-muted text-center">This button does not verify a bank transaction.</p></> : <><div className="notice"><Check size={18} /><span>Demo payment submitted. Staff must still confirm it.</span></div><OrderProgress order={order} /></>}<Link className="button button-outline full-width" href="/staff" onClick={close}>Open staff preview <ArrowRight size={17} /></Link><button className="text-button full-width" onClick={close}>Back to the good things</button></div> : !lines.length ? <div className="empty-state"><span className="empty-icon"><ShoppingBag size={34} strokeWidth={1.3} /></span><h3>A little room for something good.</h3><p>Your bag is empty. Find your favourite brew or a freshly baked treat.</p><button className="button button-primary" onClick={close}>Explore the menu <ArrowRight size={16} /></button></div> : <form onSubmit={placeOrder} className="checkout-form"><div className="cart-lines">{lines.map((line) => { const item = menu.find((entry) => entry.id === line.itemId)!; return <div className="cart-line" key={line.key}><div className="cart-image"><Image src={item.image} alt={item.imageAlt} fill sizes="76px" /></div><div className="cart-line-detail"><strong>{line.name}</strong><small>{line.customizable ? `${line.size} · ${line.milk} milk` : item.category}</small><div className="cart-line-bottom"><div className="quantity-control quantity-small"><button type="button" aria-label={`Decrease ${line.name} quantity`} onClick={() => changeQuantity(line.key, -1)}><Minus size={13} /></button><span>{line.quantity}</span><button type="button" aria-label={`Increase ${line.name} quantity`} disabled={line.quantity >= MAX_QUANTITY} onClick={() => changeQuantity(line.key, 1)}><Plus size={13} /></button></div><span>{formatPrice(line.unitPrice * line.quantity)}</span></div></div><button className="remove-item" type="button" aria-label={`Remove ${line.name}`} onClick={() => updateDemoStore((current) => ({ ...current, cart: current.cart.filter((entry) => entry.key !== line.key) }))}><Trash2 size={15} /></button></div>; })}</div><div className="checkout-total"><div><span>Subtotal</span><span>{formatPrice(total)}</span></div><p>Illustrative menu prices. No extra charges in this demo.</p><div className="total-line"><strong>Total</strong><strong>{formatPrice(total)}</strong></div></div><div className="form-grid"><label>Your first name<input required maxLength={60} autoComplete="given-name" placeholder="e.g. Ananya" value={customerName} onChange={(event) => setCustomerName(event.target.value)} /></label><label>Table number<select value={table} onChange={(event) => setTable(event.target.value)}>{Array.from({ length: 20 }, (_, index) => <option key={index + 1} value={index + 1}>Table {index + 1}</option>)}</select></label></div><label className="form-label">A little note <span>(optional)</span><textarea maxLength={300} rows={2} placeholder="Less ice? Extra napkins? Let us know." value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="notice notice-subtle"><CircleAlert size={17} /><span>Owner demo only. Use a sample name; do not enter sensitive information. Orders are stored in this browser.</span></div>{error && <p role="alert" className="form-error">{error}</p>}<button type="submit" className="button button-primary full-width">Continue to demo payment <ArrowRight size={17} /></button></form>}</Modal>;
}