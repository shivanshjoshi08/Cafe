"use client";

import { useMemo, useSyncExternalStore } from "react";
import { EMPTY_STORE, parseStore, STORE_KEY, type DemoStore } from "./orders";

const CHANGE_EVENT = "ember-oak-store-change";
let memorySnapshot: string | null = null;
let memoryOnly = false;

function getSnapshot(): string | null {
  if (memoryOnly) return memorySnapshot;
  try { return window.localStorage.getItem(STORE_KEY); }
  catch { memoryOnly = true; return memorySnapshot; }
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === STORE_KEY || event.key === null) callback(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(CHANGE_EVENT, callback); };
}

function writeDemoStore(update: (current: DemoStore) => DemoStore) {
  const next = JSON.stringify(update(parseStore(getSnapshot())));
  memorySnapshot = next;
  try { window.localStorage.setItem(STORE_KEY, next); memoryOnly = false; }
  catch { memoryOnly = true; }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export async function updateDemoStore(update: (current: DemoStore) => DemoStore) {
  // Serialize read–modify–write operations across same-origin tabs where supported.
  // Always reread the latest snapshot after acquiring the lock.
  if (navigator.locks) {
    await navigator.locks.request(STORE_KEY, () => writeDemoStore(update));
  } else {
    writeDemoStore(update);
  }
}

export async function resetDemoStore() {
  await updateDemoStore(() => EMPTY_STORE);
}

export function useDemoStore() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return useMemo(() => parseStore(raw), [raw]);
}

export function useTemporaryStorage() {
  return useSyncExternalStore(subscribe, () => memoryOnly, () => false);
}