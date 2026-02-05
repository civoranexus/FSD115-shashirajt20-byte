"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/cartapi/cart", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) return;
      setCart(data.cart);
    } catch (e) {
      console.error("load cart error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function total() {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce(
      (s: number, it: any) =>
        s + Number(it.productItem?.price || 0) * it.quantity,
      0
    );
  }

  async function placeOrder() {
    try {
      setPlacing(true);

      const res = await fetch("/api/cartapi/checkout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Checkout failed");
        return;
      }

      alert("Order placed successfully 🎉");
      router.push("/orders");
    } catch (e) {
      console.error("checkout error", e);
      alert("Network error");
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <div className="p-4">Loading…</div>;

  if (!cart || cart.cartItems.length === 0)
    return <div className="p-4">Cart empty</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="space-y-3">
          {cart.cartItems.map((ci: any) => (
            <div key={ci.id} className="flex justify-between border p-3 rounded">
              <div>
                <div className="font-semibold">
                  {ci.productItem?.product?.title}
                </div>
                <div className="text-sm text-gray-500">
                  Qty: {ci.quantity}
                </div>
              </div>
              <div className="font-semibold">
                ₹{Number(ci.productItem?.price) * ci.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{total().toFixed(2)}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={placing}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
        >
          {placing ? "Placing Order…" : "Place Order"}
        </button>
      </div>
    </main>
  );
}