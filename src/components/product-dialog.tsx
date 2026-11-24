"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice, getUnitPrice, type MenuItem, type Milk, type Size } from "@/lib/menu";
import { addCartLine, makeCartKey, MAX_QUANTITY } from "@/lib/orders";
import { updateDemoStore } from "@/lib/use-demo-store";
import { Modal } from "./modal";

export function ProductDialog({ item, onClose, onAdded }: { item: MenuItem; onClose: () => void; onAdded: (name: string) => void }) {
  const [size, setSize] = useState<Size>("Regular");
  const [milk, setMilk] = useState<Milk>(item.id === "vanilla-latte" ? "Oat" : "Regular");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const price = getUnitPrice(item, size, milk);

  async function addToBag() {
    if (adding) return;
    setAdding(true);
    try {
      await updateDemoStore((store) => ({ ...store, cart: addCartLine(store.cart, { key: makeCartKey(item.id, size, milk), itemId: item.id, size, milk, quantity }) }));
      onAdded(item.name);
      onClose();
    } finally { setAdding(false); }
  }

  return <Modal open onOpenChange={(open) => { if (!open) onClose(); }} title={item.name} description={item.sourceUrl ? "Reference-inspired choice · estimated demo price" : "Made your way. Enjoyed at your pace."}>
    <div className="product-modal-image"><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 600px) 100vw, 500px" /></div>
    {item.imageIsRepresentative && <p className="product-photo-note">Illustrative photo · not the restaurant’s dish</p>}
    <p className="product-description">{item.description}</p>
    {item.sourceUrl && <div className="product-source-note"><p>Dish name adapted from the reference menu. Recipe, price, portion, and availability are not verified.</p><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">View the official menu category <ArrowUpRight size={12} /></a></div>}
    {item.customizable && <>
      <fieldset className="option-fieldset"><legend>Pick your size</legend><div className="option-row">{(["Regular", "Large"] as Size[]).map((option) => <button key={option} type="button" aria-pressed={size === option} className={`option-button ${size === option ? "selected" : ""}`} onClick={() => setSize(option)}><span>{option}</span><small>{option === "Large" ? "+ ₹40" : "Just right"}</small>{size === option && <Check size={15} />}</button>)}</div></fieldset>
      <fieldset className="option-fieldset"><legend>Choose your milk</legend><div className="option-row">{(["Regular", "Oat", "Almond"] as Milk[]).map((option) => <button key={option} type="button" aria-pressed={milk === option} className={`option-button ${milk === option ? "selected" : ""}`} onClick={() => setMilk(option)}><span>{option}</span><small>{option === "Regular" || (item.id === "vanilla-latte" && option === "Oat") ? "Included" : "+ ₹40"}</small>{milk === option && <Check size={15} />}</button>)}</div></fieldset>
    </>}
    <p className="allergen-note">{item.dietary}. {item.customizable && "Almond milk contains nuts; regular milk contains dairy. "}Ingredients and allergens are illustrative for this demo; check with staff in a real cafe.</p>
    <div className="product-actions"><div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}><Minus size={16} /></button><span aria-live="polite">{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= MAX_QUANTITY} onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button></div><button className="button button-primary" disabled={adding} onClick={addToBag}><ShoppingBag size={17} />{adding ? "Adding…" : "Add to bag"}<span>{formatPrice(price * quantity)}</span></button></div>
  </Modal>;
}