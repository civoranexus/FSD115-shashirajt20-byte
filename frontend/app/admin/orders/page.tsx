// app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/orderapi/admin/all", { credentials: "include" });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!res.ok) {
        alert(data?.message || "Failed to load");
        return;
      }
      setOrders(data.orders || []);
    } catch (e) {
      console.error("load admin orders", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(orderId, status) {
    try {
      setActionLoading(orderId);
      const res = await fetch(`/api/orderapi/admin/${orderId}/status`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Update failed");
        return;
      }
      await load();
    } catch (e) {
      console.error("update status", e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-4 rounded border flex justify-between">
              <div>
                <div className="font-semibold">Order #{o.id} — {o.user?.name}</div>
                <div className="text-sm text-gray-500">Status: {o.order_status?.status || "—"}</div>
                <div className="text-sm text-gray-500">Total: ₹{o.order_total}</div>
              </div>
              <div className="flex gap-2">
                <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "PROCESSING")} className="px-3 py-2 bg-yellow-500 text-white rounded">Processing</button>
                <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "SHIPPED")} className="px-3 py-2 bg-indigo-600 text-white rounded">Shipped</button>
                <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "DELIVERED")} className="px-3 py-2 bg-green-600 text-white rounded">Delivered</button>
                <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "CANCELLED")} className="px-3 py-2 bg-red-600 text-white rounded">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
