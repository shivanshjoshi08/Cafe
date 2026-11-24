import { menu, type Category, type MenuItem } from "./menu";

export const MENU_PAGE_SIZE = 12;
export type MenuSort = "recommended" | "price-asc" | "price-desc" | "name";
export type MenuCategory = Category | "All";

const highlights = ["maple-cold-brew", "cappuccino", "croissant", "peri-peri-cheese-fries", "paneer-delight-pizza", "alfredo-penne", "nutella-shake", "vegetable-momos", "super-veggie-burger", "peach-iced-tea", "nutella-waffles", "pesto-sandwich"];

export function getMenuResults({ category = "All", query = "", sort = "recommended" }: { category?: MenuCategory; query?: string; sort?: MenuSort } = {}): MenuItem[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const items = menu.filter((item) => {
    const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
    return (category === "All" || item.category === category) && words.every((word) => text.includes(word));
  });
  return items.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name, "en");
    const rank = (item: MenuItem) => { const index = highlights.indexOf(item.id); return index < 0 ? highlights.length : index; };
    return rank(a) - rank(b);
  });
}