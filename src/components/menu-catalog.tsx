"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, BookOpen, Plus, Search, Sparkles, X } from "lucide-react";
import { categories, formatPrice, menu, MENU_REFERENCE, type MenuItem } from "@/lib/menu";
import { getMenuResults, MENU_PAGE_SIZE, type MenuCategory, type MenuSort } from "@/lib/menu-filter";

export function MenuCatalog({ onSelect }: { onSelect: (item: MenuItem) => void }) {
  const [category, setCategory] = useState<MenuCategory>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<MenuSort>("recommended");
  const [visibleCount, setVisibleCount] = useState(MENU_PAGE_SIZE);
  const results = getMenuResults({ category, query, sort });
  const visible = results.slice(0, visibleCount);

  function resetFilters() {
    setCategory("All");
    setQuery("");
    setSort("recommended");
    setVisibleCount(MENU_PAGE_SIZE);
  }

  return <section id="menu" className="menu-section container">
    <div className="section-heading">
      <div><span className="eyebrow">THE GOOD STUFF · {menu.length} LITTLE TEMPTATIONS</span><h2>A little something<br />for <em>every mood.</em></h2></div>
      <p>From your first coffee to the last shared fry.<br />More choices. More reasons to stay.</p>
    </div>

    <div className="menu-reference-note">
      <span className="reference-note-icon"><BookOpen size={19} strokeWidth={1.4} /></span>
      <div><strong>A bigger menu, inspired by your cafe reference.</strong><p>Selected dish names from <a href={MENU_REFERENCE.menuUrl} target="_blank" rel="noopener noreferrer">{MENU_REFERENCE.name} <ArrowUpRight size={11} /></a>, alongside our original cafe concepts. All prices are demo estimates; photos are illustrative. No affiliation.</p></div>
    </div>

    <div className="catalog-tools">
      <div className="menu-search"><Search size={17} /><input type="search" aria-label="Search menu" placeholder="Find your craving — pizza, fries, shakes…" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(MENU_PAGE_SIZE); }} />{query && <button aria-label="Clear menu search" onClick={() => { setQuery(""); setVisibleCount(MENU_PAGE_SIZE); }}><X size={15} /></button>}</div>
      <label className="menu-sort-label"><span>Sort by</span><select aria-label="Sort menu" value={sort} onChange={(event) => { setSort(event.target.value as MenuSort); setVisibleCount(MENU_PAGE_SIZE); }}><option value="recommended">Our picks</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A–Z</option></select></label>
    </div>

    <div className="menu-toolbar catalog-toolbar"><div className="category-tabs catalog-tabs" role="group" aria-label="Filter menu by category">
      {categories.map((entry) => <button key={entry} aria-label={entry} aria-pressed={category === entry} className={category === entry ? "active" : ""} onClick={() => { setCategory(entry); setVisibleCount(MENU_PAGE_SIZE); }}>{entry === "All" && <Sparkles size={14} />}{entry}<span aria-hidden="true">{entry === "All" ? menu.length : menu.filter((item) => item.category === entry).length}</span></button>)}
    </div></div>

    <div className="catalog-results-bar"><p role="status" aria-live="polite">{results.length ? <>Showing <strong>{visible.length}</strong> of <strong>{results.length}</strong> {category === "All" ? "menu items" : `${category.toLowerCase()} options`}{query.trim() ? ` for “${query.trim()}”` : ""}</> : "No matching menu items"}</p><span>INR · Estimated demo prices</span></div>

    <div className="menu-grid">
      {visible.map((item, index) => <article className="menu-card" key={item.id} style={{ animationDelay: `${Math.min(index, 5) * 35}ms` }}>
        <button className="menu-image-button" onClick={() => onSelect(item)} aria-label={`View ${item.name}`}>
          <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 370px) 100vw, (max-width: 850px) 50vw, 33vw" />
          {item.tag && <span className={`item-tag ${item.id === "maple-cold-brew" ? "tag-signature" : ""}`}>{item.id === "maple-cold-brew" && <Sparkles size={12} />}{item.tag}</span>}
          {item.imageIsRepresentative && <span className="representative-photo">Illustrative photo</span>}
          <span className="image-hover-label">Take a closer look <ArrowUpRight size={15} /></span>
        </button>
        <div className="menu-card-body">
          <div className="menu-card-heading"><h3>{item.name}</h3><span>{formatPrice(item.price)}</span></div>
          <p>{item.description}</p>
          <div className="menu-card-footer"><span><span role="img" aria-label={item.dietary} title={item.dietary} className={`dietary-marker dietary-${item.dietaryType}`} />{item.category}</span><button className="add-button" aria-label={`Add ${item.name} to your bag`} onClick={() => onSelect(item)}>Add <Plus size={16} /></button></div>
        </div>
      </article>)}
    </div>

    {!results.length && <div className="catalog-empty"><Search size={28} strokeWidth={1.2} /><h3>Not quite on this menu.</h3><p>Try a different craving or explore all the good things.</p><button className="button button-primary" onClick={resetFilters}>Explore the whole menu</button></div>}
    {results.length > visible.length && <div className="menu-load-more"><button className="button button-outline" onClick={() => setVisibleCount((count) => count + MENU_PAGE_SIZE)}>Discover {Math.min(MENU_PAGE_SIZE, results.length - visible.length)} more good things <ArrowDown size={16} /></button><span>{results.length - visible.length} more to explore</span></div>}
    <p className="menu-disclaimer">Menu names are for concept inspiration, not a live restaurant catalogue. Prices, descriptions, dietary labels, and availability are unverified demo proposals. Confirm recipes and allergens with the owner before launch.</p>
  </section>;
}