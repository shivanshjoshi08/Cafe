"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowDown, Plus, Search, Sparkles, X } from "lucide-react";
import { categories, formatPrice, menu, type MenuItem } from "@/lib/menu";
import { getMenuResults, MENU_PAGE_SIZE, type MenuCategory, type MenuSort } from "@/lib/menu-filter";
import { AnimatedSelect } from "./animated-select";

const sortOptions = [
  { value: "recommended", label: "Our picks" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A–Z" },
] as const;

const categoryIcons = {
  All: "🍽️",
  Coffee: "☕",
  Shakes: "🥤",
  Coolers: "🧊",
  "Fries & bites": "🍟",
  Pizza: "🍕",
  Pasta: "🍝",
  Burgers: "🍔",
  "Sandwiches & wraps": "🌯",
  Momos: "🥟",
  Desserts: "🍨",
  "Not coffee": "🍵",
  "Fresh bakes": "🥐",
  "All-day bites": "🥪",
} satisfies Record<MenuCategory, string>;

export function MenuCatalog({ onSelect }: { onSelect: (item: MenuItem) => void }) {
  const sortId = useId();
  const [category, setCategory] = useState<MenuCategory>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<MenuSort>("recommended");
  const [visibleCount, setVisibleCount] = useState(MENU_PAGE_SIZE);
  const [scrollRequest, setScrollRequest] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const results = getMenuResults({ category, query, sort });
  const visible = results.slice(0, visibleCount);

  useEffect(() => {
    if (!scrollRequest) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [scrollRequest]);

  function selectCategory(next: MenuCategory) {
    setCategory(next);
    setVisibleCount(MENU_PAGE_SIZE);
    // Scroll after the filtered items render, including repeated taps on the same category.
    setScrollRequest((request) => request + 1);
  }

  function resetFilters() {
    setCategory("All");
    setQuery("");
    setSort("recommended");
    setVisibleCount(MENU_PAGE_SIZE);
  }

  return <section id="menu" className="menu-section container" aria-labelledby="menu-heading">
    <h2 id="menu-heading" className="sr-only">Our menu</h2>

    <div className="menu-toolbar catalog-toolbar"><div className="category-tabs catalog-tabs" role="group" aria-label="Filter menu by category">
      {categories.map((entry) => <button key={entry} aria-label={entry} aria-pressed={category === entry} aria-controls="menu-items" className={category === entry ? "active" : ""} onClick={() => selectCategory(entry)}><span className="category-icon" aria-hidden="true">{categoryIcons[entry]}</span><span className="category-label">{entry}</span></button>)}
    </div></div>

    <div className="catalog-tools">
      <div className="menu-search"><Search size={17} /><input type="search" aria-label="Search menu" placeholder="Find your craving — pizza, fries, shakes…" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(MENU_PAGE_SIZE); }} />{query && <button aria-label="Clear menu search" onClick={() => { setQuery(""); setVisibleCount(MENU_PAGE_SIZE); }}><X size={15} /></button>}</div>
      <div className="menu-sort-label"><label htmlFor={sortId}>Sort by</label><AnimatedSelect<MenuSort> id={sortId} ariaLabel="Sort menu" value={sort} options={sortOptions} onValueChange={(next) => { setSort(next); setVisibleCount(MENU_PAGE_SIZE); }} /></div>
    </div>

    <div className="catalog-results-bar" ref={resultsRef}><p role="status" aria-live="polite">{results.length ? <>Showing <strong>{visible.length}</strong> of <strong>{results.length}</strong> {category === "All" ? "menu items" : `${category.toLowerCase()} options`}{query.trim() ? ` for “${query.trim()}”` : ""}</> : "No matching menu items"}</p><span>INR · Estimated demo prices</span></div>

    <div id="menu-items" className="menu-grid">
      {visible.map((item, index) => <article className="menu-card" key={item.id} style={{ animationDelay: `${Math.min(index, 5) * 35}ms` }}>
        <div className="menu-card-media">
          <button className="menu-image-button" onClick={() => onSelect(item)} aria-label={`View ${item.name}`}>
            <Image src={item.image} alt={item.imageAlt} fill priority={index < 3} sizes="(max-width: 370px) 100vw, (max-width: 850px) 50vw, 33vw" />
            {item.tag && <span className={`item-tag ${item.id === "maple-cold-brew" ? "tag-signature" : ""}`}>{item.id === "maple-cold-brew" && <Sparkles size={12} />}{item.tag}</span>}
            <span className="menu-category-tag"><span role="img" aria-label={item.dietary} title={item.dietary} className={`dietary-marker dietary-${item.dietaryType}`} /><span className="menu-category-name">{item.category}</span></span>
          </button>
          <button className="add-button" aria-label={`Add ${item.name} to your bag`} onClick={() => onSelect(item)}>Add <Plus size={16} aria-hidden="true" /></button>
        </div>
        <div className="menu-card-body">
          <div className="menu-card-heading"><h3>{item.name}</h3></div>
          <p>{item.description}</p>
          <span className="menu-card-price">{formatPrice(item.price)}</span>
        </div>
      </article>)}
    </div>

    {!results.length && <div className="catalog-empty"><Search size={28} strokeWidth={1.2} /><h3>Not quite on this menu.</h3><p>Try a different craving or explore all the good things.</p><button className="button button-primary" onClick={resetFilters}>Explore the whole menu</button></div>}
    {results.length > visible.length && <div className="menu-load-more"><button className="button button-outline" onClick={() => setVisibleCount((count) => count + MENU_PAGE_SIZE)}>Discover {Math.min(MENU_PAGE_SIZE, results.length - visible.length)} more good things <ArrowDown size={16} /></button><span>{results.length - visible.length} more to explore</span></div>}
    <p className="menu-disclaimer">Menu names are for concept inspiration, not a live restaurant catalogue. Some photos are illustrative, not the restaurant’s actual dishes. Prices, descriptions, dietary labels, and availability are unverified demo proposals. Confirm recipes and allergens with the owner before launch.</p>
  </section>;
}