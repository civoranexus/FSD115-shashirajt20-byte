"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const res = await fetch("/api/orderapi/seller", {
        credentials: "include",
      });

      const text = await res.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        alert(data?.message || "Failed to load seller orders");
        return;
      }

      setOrders(data.orders || []);
    } catch (e) {
      console.error("seller orders load error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-4">Loading seller orders…</div>;

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Seller Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            No orders for your products yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">
                      Status: {order.order_status?.status || "—"}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/seller/orders/${order.id}`)}
                    className="px-3 py-2 bg-indigo-600 text-white rounded"
                  >
                    View
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {order.orderProducts.map((op: any) => (
                    <div
                      key={op.id}
                      className="flex justify-between text-sm text-gray-700 border rounded p-2 bg-slate-50"
                    >
                      <span>
                        {op.productItem?.product?.title} × {op.quantity}
                      </span>
                      <span>₹{op.price * op.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
