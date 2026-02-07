"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: number;
  orderId: number;
  productItem: { product: { title: string } };
  user: { id: number; name: string; email?: string };
  order: { id: number; order_status?: { status: string }; user?: any };
  quantity: number;
  price: number;
};

export default function SellerOrderRequestsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/sellerOrders/pending", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to load requests");
        return;
      }
      setItems(data.items || []);
    } catch (e) {
      console.error("load seller orders error", e);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function approveOrder(id) {
  const res = await fetch(`/api/orderapi/seller/approve/${id}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Failed");
    return;
  }

  alert("Order approved ✅");
  load(); // reload orders
}


  useEffect(() => { load(); }, []);

  async function approve(id: number) {
    if (!confirm("Approve this buyer request?")) return;
    try {
      setActionLoading(id);
      const res = await fetch(`/api/sellerOrders/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Approve failed");
        return;
      }
      alert("Order confirmed for buyer ✅");
      // remove item from list or refresh
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("approve error", e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  async function reject(id: number) {
    const reason = prompt("Optional: add reject reason (buyer will see it in admin logs)");
    try {
      setActionLoading(id);
      const res = await fetch(`/api/sellerOrders/${id}/reject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Reject failed");
        return;
      }
      alert("Order rejected");
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("reject error", e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Order Requests</h1>
            <p className="text-sm text-gray-500">Approve or reject buyer orders for your listings.</p>
          </div>
          <div>
            <button onClick={load} className="px-4 py-2 bg-indigo-600 text-white rounded">Refresh</button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">No pending order requests</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.productItem?.product?.title || "Product"}</div>
                  <div className="text-sm text-gray-500">Buyer: {it.order?.user?.name || it.user?.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.quantity} • ₹{it.price}</div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => approve(it.id)} disabled={actionLoading === it.id} className="px-3 py-2 bg-green-600 text-white rounded">
                    {actionLoading === it.id ? "Processing…" : "Approve"}
                  </button>
                  <button onClick={() => reject(it.id)} disabled={actionLoading === it.id} className="px-3 py-2 bg-red-600 text-white rounded">
                    {actionLoading === it.id ? "Processing…" : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
