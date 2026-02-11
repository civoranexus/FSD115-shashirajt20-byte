// app/admin/orders/page.tsx
// "use client";

// import { useEffect, useState } from "react";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);

//   async function load() {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/orderapi/admin/all", { credentials: "include" });
//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch { data = null; }

//       if (!res.ok) {
//         alert(data?.message || "Failed to load");
//         return;
//       }
//       setOrders(data.orders || []);
//     } catch (e) {
//       console.error("load admin orders", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   async function changeStatus(orderId, status) {
//     try {
//       setActionLoading(orderId);
//       const res = await fetch(`/api/orderapi/admin/${orderId}/status`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status })
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         alert(data?.message || "Update failed");
//         return;
//       }
//       await load();
//     } catch (e) {
//       console.error("update status", e);
//       alert("Network error");
//     } finally {
//       setActionLoading(null);
//     }
//   }

//   if (loading) return <div className="p-4">Loading…</div>;

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
//         <div className="space-y-4">
//           {orders.map(o => (
//             <div key={o.id} className="bg-white p-4 rounded border flex justify-between">
//               <div>
//                 <div className="font-semibold">Order #{o.id} — {o.user?.name}</div>
//                 <div className="text-sm text-gray-500">Status: {o.order_status?.status || "—"}</div>
//                 <div className="text-sm text-gray-500">Total: ₹{o.order_total}</div>
//               </div>
//               <div className="flex gap-2">
//                 <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "PROCESSING")} className="px-3 py-2 bg-yellow-500 text-white rounded">Processing</button>
//                 <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "SHIPPED")} className="px-3 py-2 bg-indigo-600 text-white rounded">Shipped</button>
//                 <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "DELIVERED")} className="px-3 py-2 bg-green-600 text-white rounded">Delivered</button>
//                 <button disabled={actionLoading===o.id} onClick={() => changeStatus(o.id, "CANCELLED")} className="px-3 py-2 bg-red-600 text-white rounded">Cancel</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }

// app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  async function load() {
    try {
      setLoading(true);

      const res = await fetch("/api/orderapi/admin/all", {
        credentials: "include",
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

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

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(orderId: number, status: string) {
    try {
      setActionLoading(orderId);

      const res = await fetch(`/api/orderapi/admin/${orderId}/status`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600 animate-pulse">Loading orders…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
          Manage Orders
        </h1>

        {/* No orders */}
        {orders.length === 0 && (
          <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
            No orders found.
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-xl shadow-sm border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Order info */}
              <div className="space-y-1">
                <h2 className="font-semibold text-slate-800">
                  Order #{o.id}
                </h2>

                <p className="text-sm text-gray-600">
                  Buyer: <span className="font-medium">{o.user?.name || "—"}</span>
                </p>

                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-semibold text-indigo-600">
                    {o.order_status?.status || "—"}
                  </span>
                </p>

                <p className="text-sm text-gray-600">
                  Total:{" "}
                  <span className="font-semibold text-green-600">
                    ₹{o.order_total}
                  </span>
                </p>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 sm:flex gap-2">
                <button
                  disabled={actionLoading === o.id}
                  onClick={() => changeStatus(o.id, "PROCESSING")}
                  className="px-3 py-2 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600 disabled:opacity-50"
                >
                  Processing
                </button>

                <button
                  disabled={actionLoading === o.id}
                  onClick={() => changeStatus(o.id, "SHIPPED")}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  Shipped
                </button>

                <button
                  disabled={actionLoading === o.id}
                  onClick={() => changeStatus(o.id, "DELIVERED")}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  Delivered
                </button>

                <button
                  disabled={actionLoading === o.id}
                  onClick={() => changeStatus(o.id, "CANCELLED")}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
