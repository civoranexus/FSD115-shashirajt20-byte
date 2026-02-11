// "use client";

// import { useEffect, useState } from "react";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     try {
//       const res = await fetch("/api/apis/order/my", { credentials: "include" });
//       const data = await res.json();
//       if (res.ok) setOrders(data.orders || []);
//     } catch (e) {
//       console.error("orders load error", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   if (loading) return <div className="p-4">Loading orders…</div>;

//   if (orders.length === 0)
//     return <div className="p-4">No orders yet</div>;

//   return (
//     <main className="min-h-screen bg-slate-50 p-4">
//       <div className="max-w-4xl mx-auto space-y-4">
//         <h1 className="text-2xl font-bold">My Orders</h1>

//         {orders.map(order => (
//           <div key={order.id} className="bg-white p-4 rounded-lg shadow">
//             <div className="flex justify-between font-semibold">
//               <span>Order #{order.id}</span>
//               <span>₹{order.totalAmount}</span>
//             </div>

//             <div className="mt-3 space-y-2">
//               {order.orderItems.map((it: any) => (
//                 <div key={it.id} className="flex justify-between text-sm">
//                   <span>{it.productItem?.product?.title}</span>
//                   <span>
//                     {it.quantity} × ₹{it.price}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

// app/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
      const res = await fetch("/api/orderapi/my", { credentials: "include" });
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        setErr(data?.message || "Failed to load orders");
        setOrders([]);
        return;
      }
      setOrders(data.orders || []);
    } catch (e) {
      console.error("load orders", e);
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkRole();
    load();
  }, []);

  if (loading) return <div className="p-4">Loading orders…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (orders.length === 0) return <div className="p-4">No orders yet</div>;

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl text-gray-500 font-bold">My Orders</h1>
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white p-4 rounded-lg border flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-gray-700">Order #{o.id}</div>
              <div className="text-sm text-gray-500">
                Total: ₹{o.order_total}
              </div>
              <div className="text-sm text-gray-500">
                Status: {o.order_status?.status || "—"}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(o.order_date).toLocaleString()}
              </div>
            </div>

            <div>
              <button
                onClick={() => router.push(`/orders/${o.id}`)}
                className="px-3 py-2 bg-indigo-600 text-white rounded"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
