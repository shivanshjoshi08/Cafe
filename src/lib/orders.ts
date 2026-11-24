import { getUnitPrice, menu, type Milk, type Size } from "./menu";

export interface CartLine {
  key: string;
  itemId: string;
  size: Size;
  milk: Milk;
  quantity: number;
}

export type PaymentStatus = "unpaid" | "awaiting-verification" | "confirmed";
export type OrderStatus = "new" | "preparing" | "ready" | "completed";

export interface OrderLine extends CartLine {
  name: string;
  unitPrice: number;
  customizable: boolean;
}

export interface DemoOrder {
  id: string;
  customerName: string;
  table: number;
  notes: string;
  items: OrderLine[];
  total: number;
  createdAt: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  isSample?: boolean;
}

export interface DemoStore {
  version: 1;
  cart: CartLine[];
  orders: DemoOrder[];
}

export const STORE_KEY = "ember-oak-demo-v1";
export const EMPTY_STORE: DemoStore = { version: 1, cart: [], orders: [] };
export const MAX_QUANTITY = 20;

export function makeCartKey(itemId: string, size: Size, milk: Milk) {
  return `${itemId}:${size}:${milk}`;
}

export function addCartLine(cart: CartLine[], line: CartLine): CartLine[] {
  const existing = cart.find((item) => item.key === line.key);
  if (existing) return cart.map((item) => item.key === line.key ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + line.quantity) } : item);
  return [...cart, { ...line, quantity: Math.max(1, Math.min(MAX_QUANTITY, line.quantity)) }];
}

export function getOrderLines(cart: CartLine[]): OrderLine[] {
  return cart.flatMap((line) => {
    const item = menu.find((entry) => entry.id === line.itemId);
    return item ? [{ ...line, name: item.name, unitPrice: getUnitPrice(item, line.size, line.milk), customizable: !!item.customizable }] : [];
  });
}

export function getCartTotal(cart: CartLine[]) {
  return getOrderLines(cart).reduce((total, line) => total + line.unitPrice * line.quantity, 0);
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

function isCartLine(value: unknown): value is CartLine {
  if (!isRecord(value)) return false;
  return typeof value.itemId === "string" && menu.some((item) => item.id === value.itemId)
    && ["Regular", "Large"].includes(String(value.size))
    && ["Regular", "Oat", "Almond"].includes(String(value.milk))
    && value.key === makeCartKey(value.itemId, value.size as Size, value.milk as Milk)
    && Number.isInteger(value.quantity) && Number(value.quantity) >= 1 && Number(value.quantity) <= MAX_QUANTITY;
}

function isOrder(value: unknown): value is DemoOrder {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && typeof value.customerName === "string"
    && Number.isInteger(value.table) && Number(value.table) >= 1 && Number(value.table) <= 20
    && typeof value.notes === "string" && typeof value.createdAt === "string" && !Number.isNaN(Date.parse(value.createdAt))
    && typeof value.total === "number" && Number.isFinite(value.total) && value.total > 0
    && ["unpaid", "awaiting-verification", "confirmed"].includes(String(value.paymentStatus))
    && ["new", "preparing", "ready", "completed"].includes(String(value.status))
    && (value.isSample === undefined || typeof value.isSample === "boolean")
    && Array.isArray(value.items) && value.items.length > 0
    && value.items.every((item: unknown) => isCartLine(item) && isRecord(item) && typeof item.name === "string" && typeof item.customizable === "boolean" && typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice) && item.unitPrice > 0);
}

export function parseStore(raw: string | null): DemoStore {
  if (!raw) return EMPTY_STORE;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || data.version !== 1 || !Array.isArray(data.cart) || !Array.isArray(data.orders)) return EMPTY_STORE;
    return { version: 1, cart: data.cart.filter(isCartLine), orders: data.orders.filter(isOrder) };
  } catch { return EMPTY_STORE; }
}

export function createOrder(cart: CartLine[], customerName: string, table: number, notes: string): DemoOrder {
  const items = getOrderLines(cart);
  if (!items.length) throw new Error("Add something delicious to your bag first.");
  if (!customerName.trim() || customerName.trim().length > 60) throw new Error("Enter a name between 1 and 60 characters.");
  if (!Number.isInteger(table) || table < 1 || table > 20) throw new Error("Choose a table between 1 and 20.");
  if (notes.length > 300) throw new Error("Please keep your note under 300 characters.");
  return { id: `EO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, customerName: customerName.trim(), table, notes: notes.trim(), items, total: getCartTotal(cart), createdAt: new Date().toISOString(), paymentStatus: "unpaid", status: "new" };
}

export function advanceOrder(order: DemoOrder): DemoOrder {
  if (order.paymentStatus !== "confirmed") return order;
  const next: Record<OrderStatus, OrderStatus> = { new: "preparing", preparing: "ready", ready: "completed", completed: "completed" };
  return { ...order, status: next[order.status] };
}

export function sampleOrders(): DemoOrder[] {
  const make = (id: string, name: string, table: number, cart: CartLine[], paymentStatus: PaymentStatus, status: OrderStatus, notes = ""): DemoOrder => ({ id, customerName: name, table, notes, items: getOrderLines(cart), total: getCartTotal(cart), createdAt: new Date().toISOString(), paymentStatus, status, isSample: true });
  const line = (itemId: string, quantity = 1): CartLine => ({ key: makeCartKey(itemId, "Regular", "Regular"), itemId, size: "Regular", milk: "Regular", quantity });
  return [
    make("SAMPLE-001", "Aarav", 4, [line("cappuccino", 2), line("peri-peri-cheese-fries")], "awaiting-verification", "new"),
    make("SAMPLE-002", "Meera", 7, [line("paneer-delight-pizza"), line("peach-iced-tea")], "confirmed", "preparing", "A sample pizza-and-cooler order for the owner."),
    make("SAMPLE-003", "Riya", 2, [line("vegetable-momos"), line("nutella-waffles")], "confirmed", "ready"),
  ];
}