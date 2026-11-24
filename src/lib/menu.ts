import { referenceMenu } from "./menu-reference";

export const categories = ["All", "Coffee", "Shakes", "Coolers", "Fries & bites", "Pizza", "Pasta", "Burgers", "Sandwiches & wraps", "Momos", "Desserts", "Not coffee", "Fresh bakes", "All-day bites"] as const;
export type Category = Exclude<(typeof categories)[number], "All">;
export type Milk = "Regular" | "Oat" | "Almond";
export type Size = "Regular" | "Large";
export type DietaryType = "vegetarian" | "contains-egg" | "non-vegetarian" | "unverified";

export const MENU_REFERENCE = {
  name: "Xero Degrees, Connaught Place",
  mapsUrl: "https://maps.app.goo.gl/4qmVhcGAvGgWHD7BA?g_st=aw",
  menuUrl: "https://www.xerodegrees.com/menu/",
  checkedOn: "2026-11-23",
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  imageAlt: string;
  tag?: string;
  dietary: string;
  dietaryType: DietaryType;
  customizable?: boolean;
  sourceUrl?: string;
  imageIsRepresentative?: boolean;
}

export const menu: MenuItem[] = [
  { id: "maple-cold-brew", name: "Maple Cinnamon Cold Brew", description: "Slow-steeped coffee, a little maple, and a cinnamon finish.", price: 240, category: "Coffee", image: "/images/cold-brew.jpg", imageAlt: "An iced coffee served in a tall glass", tag: "House favourite", dietary: "Vegetarian", dietaryType: "vegetarian", customizable: true },
  { id: "cappuccino", name: "Classic Cappuccino", description: "A rich espresso hug beneath silky, cloud-like milk foam.", price: 160, category: "Coffee", image: "/images/cappuccino.jpg", imageAlt: "A freshly poured cappuccino with latte art", dietary: "Vegetarian", dietaryType: "vegetarian", customizable: true },
  { id: "croissant", name: "Butter Croissant", description: "Golden, flaky, and baked for the first bite of your day.", price: 140, category: "Fresh bakes", image: "/images/croissant.jpg", imageAlt: "Golden freshly baked butter croissants", tag: "Freshly baked", dietary: "Vegetarian · Contains gluten & dairy", dietaryType: "vegetarian" },
  { id: "vanilla-latte", name: "Vanilla Oat Latte", description: "Smooth espresso meets oat milk and real vanilla warmth.", price: 220, category: "Coffee", image: "/images/latte.jpg", imageAlt: "A warm latte in a ceramic cup", dietary: "Plant-based with oat milk", dietaryType: "vegetarian", customizable: true },
  { id: "matcha", name: "Matcha Latte", description: "Earthy matcha, creamy milk, and a soothing little reset.", price: 230, category: "Not coffee", image: "/images/matcha.jpg", imageAlt: "A vibrant green matcha latte with leaf-shaped latte art", tag: "A little different", dietary: "Vegetarian", dietaryType: "vegetarian", customizable: true },
  { id: "brownie", name: "Warm Chocolate Brownie", description: "Deep chocolate, a soft centre, and absolutely no regrets.", price: 180, category: "Fresh bakes", image: "/images/brownie.jpg", imageAlt: "Rich chocolate brownies ready to serve", dietary: "Contains gluten, eggs & dairy", dietaryType: "contains-egg" },
  { id: "avocado-toast", name: "Avocado & Egg Sourdough", description: "Fresh avocado, sourdough toast, and a soft-boiled egg.", price: 290, category: "All-day bites", image: "/images/avocado.jpg", imageAlt: "Avocado toast served alongside a soft-boiled egg", tag: "Brunch, any time", dietary: "Contains gluten & eggs", dietaryType: "contains-egg" },
  { id: "pesto-sandwich", name: "Pesto Grilled Sandwich", description: "Basil pesto, melty cheese, and a perfectly golden crunch.", price: 260, category: "All-day bites", image: "/images/sandwich.jpg", imageAlt: "A toasted sandwich served on a plate", dietary: "Vegetarian · Contains gluten, nuts & dairy", dietaryType: "vegetarian" },
  ...referenceMenu,
];

export const signatureItem = menu.find((item) => item.id === "maple-cold-brew")!;
export const formatPrice = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export function getUnitPrice(item: MenuItem, size: Size = "Regular", milk: Milk = "Regular") {
  if (!item.customizable) return item.price;
  // The vanilla oat latte already includes oat milk in its base price.
  const milkExtra = milk === "Regular" || (item.id === "vanilla-latte" && milk === "Oat") ? 0 : 40;
  return item.price + (size === "Large" ? 40 : 0) + milkExtra;
}