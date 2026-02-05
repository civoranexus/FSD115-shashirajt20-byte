"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/apis/cart", { credentials: "include" });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!res.ok) {
        setError(data?.message || "Failed to load cart");
        setCart(null);
        return;
      }

      setCart(data.cart || null);
    } catch (e) {
      console.error("load cart error", e);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateItem(itemId, qty) {
    try {
      setActionLoadingId(itemId);
      const res = await fetch(`/api/cartapi/cart/item/${itemId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }
      if (!res.ok) {
        alert(data?.message || "Update failed");
        return;
      }
      await load();
    } catch (e) {
      console.error("update item error", e);
      alert("Network error");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function removeItem(itemId) {
    try {
      if (!confirm("Remove this item?")) return;
      setActionLoadingId(itemId);
      const res = await fetch(`/api/cartapi/cart/item/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }
      if (!res.ok) {
        alert(data?.message || "Remove failed");
        return;
      }
      await load();
    } catch (e) {
      console.error("remove item error", e);
      alert("Network error");
    } finally {
      setActionLoadingId(null);
    }
  }

  function calcTotal() {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((s, it) => s + (Number(it.productItem?.price || 0) * it.quantity), 0);
  }

  if (loading) return <div className="p-4">Loading cart…</div>;
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h2 className="text-lg font-semibold text-gray-600">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-2">Add items from marketplace.</p>
        <button onClick={() => router.push("/products")} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Browse Products</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Cart</h1>

        <div className="space-y-4">
          {cart.cartItems.map(ci => (
            <div key={ci.id} className="bg-white p-4 rounded-lg flex gap-4 items-center">
              <img
                src={ci.productItem?.product?.image || ci.productItem?.image || "/placeholder.png"}
                className="w-20 h-20 object-cover rounded"
                alt={ci.productItem?.product?.title || "item"}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
              <div className="flex-1">
                <div className="font-semibold">{ci.productItem?.product?.title}</div>
                <div className="text-sm text-gray-500">Seller: {ci.productItem?.user?.name}</div>
                <div className="text-sm text-gray-700 mt-1">₹{ci.productItem?.price}</div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    disabled={actionLoadingId === ci.id}
                    onClick={() => updateItem(ci.id, Math.max(1, ci.quantity - 1))}
                    className="px-2 py-1 border rounded disabled:opacity-60"
                  >-</button>

                  <div className="px-3">{ci.quantity}</div>

                  <button
                    disabled={actionLoadingId === ci.id}
                    onClick={() => updateItem(ci.id, ci.quantity + 1)}
                    className="px-2 py-1 border rounded disabled:opacity-60"
                  >+</button>
                </div>

                <button
                  disabled={actionLoadingId === ci.id}
                  onClick={() => removeItem(ci.id)}
                  className="text-sm text-red-600 disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-semibold">₹{calcTotal().toFixed(2)}</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => router.push("/products")} className="px-4 py-2 bg-white border rounded">Continue shopping</button>
            <button onClick={() => alert("Checkout flow later")} className="px-4 py-2 bg-indigo-600 text-white rounded">Checkout</button>
          </div>
        </div>
      </div>
    </main>
  );
}

