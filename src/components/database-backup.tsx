"use client";

import { useState, type ChangeEvent } from "react";
import { CircleAlert, Database, Download, RefreshCw } from "lucide-react";
import { Modal } from "./modal";
import { parseStore, type DemoStore } from "@/lib/orders";
import { updateDemoStore, useDemoStore } from "@/lib/use-demo-store";

export function DatabaseBackup() {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<DemoStore | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  function handleExport() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ember-oak-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage("Backup downloaded successfully.");
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    setStatusMessage("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseStore(text);
        if (parsed.orders.length === 0 && parsed.cart.length === 0 && !text.includes('"version":1')) {
          setError("Invalid backup file format. Expected Ember & Oak demo store data.");
          setSnapshot(null);
          return;
        }
        setSnapshot(parsed);
      } catch {
        setError("Failed to read the file. Please select a valid JSON backup.");
        setSnapshot(null);
      }
    };
    reader.readAsText(file);
  }

  async function handleRestore() {
    if (!snapshot || !confirmed) return;
    await updateDemoStore(() => snapshot);
    setStatusMessage("Demo data restored successfully.");
    setSnapshot(null);
    setConfirmed(false);
    setOpen(false);
  }

  return (
    <section className="database-backup-section">
      <div className="container">
        <div className="database-backup-panel">
          <div>
            <span className="eyebrow">DATA MANAGEMENT &amp; RECOVERY</span>
            <h2>Local store backup</h2>
            <p>
              Download a snapshot of current demo orders, cart lines, and settings, or restore from a previously exported JSON backup file.
            </p>
          </div>
          <button type="button" className="button button-outline" onClick={() => setOpen(true)}>
            <Database size={15} /> Backup &amp; restore
          </button>
        </div>
      </div>

      <Modal open={open} onOpenChange={setOpen} title="Backup & Restore Demo Store" description="Save your orders or restore from a previous backup snapshot.">
        <div className="database-backup-form">
          <div className="notice notice-subtle">
            <CircleAlert size={16} />
            <span>All data is stored purely inside your browser&apos;s localStorage. Backing up allows you to transfer state to other browsers or restore if storage is cleared.</span>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 600 }}>1. Export current data</h4>
            <p className="small-muted" style={{ marginBottom: "10px" }}>
              Current snapshot contains {store.orders.length} order(s) and {store.cart.length} cart item(s).
            </p>
            <button type="button" className="button button-primary" onClick={handleExport}>
              <Download size={15} /> Download backup (.json)
            </button>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "4px 0" }} />

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 600 }}>2. Restore from backup</h4>
            <input type="file" accept=".json,application/json" onChange={handleFileChange} style={{ fontSize: "12px", marginBottom: "8px" }} />
            {error && <p className="form-error" role="alert" style={{ color: "var(--rust)", fontSize: "11px" }}>{error}</p>}
            {snapshot && (
              <div className="database-snapshot-summary">
                <strong>Snapshot verified:</strong>
                <p>
                  Found {snapshot.orders.length} order(s) and {snapshot.cart.length} item(s) in cart (schema version {snapshot.version}).
                </p>
                <label className="database-restore-confirm" style={{ marginTop: "12px" }}>
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                  <span>I understand that restoring will overwrite current local demo orders and cart.</span>
                </label>
                <button type="button" className="button button-danger" disabled={!confirmed} onClick={handleRestore} style={{ marginTop: "12px" }}>
                  <RefreshCw size={14} /> Restore snapshot now
                </button>
              </div>
            )}
          </div>

          {statusMessage && (
            <p className="small-muted" style={{ color: "var(--green)", fontWeight: 500 }}>
              {statusMessage}
            </p>
          )}
        </div>
      </Modal>
    </section>
  );
}
