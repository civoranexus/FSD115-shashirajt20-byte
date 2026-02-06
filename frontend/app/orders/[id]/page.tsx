// app/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkRole() {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    if (res.status === 401) {
      router.replace("/signin");
      return false;
    }

    const data = await res.json();

    if (data?.user?.role !== "BUYER") {
      router.replace("/");
      return false;
    }

    return true;
  }

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(`/api/orderapi/${id}`, {
        credentials: "include",
      });
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        alert(data?.message || "Failed to load");
        setOrder(null);
        return;
      }
      setOrder(data.order);
    } catch (e) {
      console.error("load order", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkRole();
    if (id) load();
  }, [id]);

  if (loading) return <div className="p-4">Loading…</div>;
  if (!order) return <div className="p-4">Order not found</div>;

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-gray-700">
          Order #{order.id}
        </h1>
        <div className="text-sm text-gray-500">
          Status: {order.order_status?.status || "—"}
        </div>
        <div className="mt-4 space-y-2">
          {order.orderProducts.map((op) => (
            <div
              key={op.id}
              className="flex justify-between border p-3 rounded bg-slate-50"
            >
              <div>
                <div className="font-semibold text-gray-500">
                  {op.productItem?.product?.title || "Product"}
                </div>
                <div className="text-sm text-gray-500">Qty: {op.quantity}</div>
              </div>
              <div className="font-semibold text-gray-500">
                ₹{op.price * op.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-600">
            Total: ₹{order.order_total}
          </div>
          <button
            onClick={() => router.push("/orders")}
            className="px-3 py-2 bg-white border rounded text-gray-500"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
