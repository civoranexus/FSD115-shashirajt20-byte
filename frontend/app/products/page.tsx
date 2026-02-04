// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ProductsPage() {
//   const router = useRouter();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [q, setQ] = useState("");

//   async function load() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/apis/product-items/active");
//       const data = await res.json();
//       if (!res.ok) {
//         console.error("load products error", data);
//         setItems([]);
//         return;
//       }
//       setItems(data.items || []);
//     } catch (e) {
//       console.error("load products network error", e);
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   const filtered = items.filter(i => {
//     if (!q) return true;
//     const title = String(i.product?.title || "").toLowerCase();
//     return title.includes(q.toLowerCase());
//   });

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold">Marketplace</h1>
//           <input
//             value={q}
//             onChange={e => setQ(e.target.value)}
//             placeholder="Search product..."
//             className="border rounded px-3 py-2 w-64"
//           />
//         </div>

//         {loading ? (
//           <div>Loading…</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {filtered.map(item => (
//               <div key={item.id} className="bg-white p-4 rounded shadow">
//                 <img src={item.image || item.product?.image || "/placeholder.png"} className="w-full h-40 object-cover rounded" />
//                 <h3 className="mt-2 font-semibold">{item.product?.title}</h3>
//                 <p className="text-sm text-gray-500">{item.product?.category?.category_name}</p>
//                 <p className="mt-2 font-semibold">₹{item.price}</p>

//                 <div className="mt-3 flex gap-2">
//                   <button onClick={() => router.push(`/product/${item.productId}`)} className="px-3 py-2 bg-indigo-600 text-white rounded">View</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }







// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ProductsPage() {
//   const router = useRouter();

//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [q, setQ] = useState("");

//   async function load() {
//     setLoading(true);

//     try {
//       const res = await fetch("/api/apis/products/items/active", {
//         method: "GET",
//         credentials: "include",
//       });

//       const text = await res.text();
//       let data: any = null;

//       try {
//         data = JSON.parse(text);
//       } catch {
//         data = null;
//       }

//       if (!res.ok) {
//         console.error("load products error", data);
//         setItems([]);
//         return;
//       }

//       setItems(data?.items || []);
//     } catch (e) {
//       console.error("load products network error", e);
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   const filtered = items.filter((i) => {
//     if (!q) return true;
//     const title = String(i?.product?.title || "").toLowerCase();
//     return title.includes(q.toLowerCase());
//   });

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4 bg-white p-4 rounded-xl shadow">
//           <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>

//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search product..."
//             className="w-full sm:w-72 border border-gray-300 rounded-lg px-3 py-2 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
//           />
//         </div>

//         {loading ? (
//           <div className="text-center py-8 text-gray-600">Loading…</div>
//         ) : filtered.length === 0 ? (
//           <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
//             No products found
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {filtered.map((item) => (
//               <div key={item.id} className="bg-white p-4 rounded-2xl shadow border">
//                 <img
//                   src={item?.image || item?.product?.image || "/placeholder.png"}
//                   className="w-full h-40 object-cover rounded-xl border"
//                   alt="product"
//                   onError={(e: any) => (e.target.src = "/placeholder.png")}
//                 />

//                 <h3 className="mt-3 font-semibold text-gray-800">
//                   {item?.product?.title}
//                 </h3>

//                 <p className="text-sm text-gray-500">
//                   {item?.product?.category?.category_name || ""}
//                 </p>

//                 <p className="mt-2 font-bold text-gray-800">₹{item?.price}</p>

//                 <div className="mt-3 flex gap-2">
//                   <button
//                     onClick={() => router.push(`/product/${item.productId}`)}
//                     className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
//                   >
//                     View
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

















"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/apis/products/items/active", {
        method: "GET",
        credentials: "include",
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!res.ok) {
        console.error("load products error", data);
        setItems([]);
        return;
      }

      setItems(data?.items || []);
    } catch (e) {
      console.error("load products network error", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((i) => {
    if (!q) return true;
    const title = String(i?.product?.title || "").toLowerCase();
    return title.includes(q.toLowerCase());
  });

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Logo (replace /resources/logo.svg with your logo file if you have it) */}
          <img
            src="/logos/logo.svg"
            alt="logo"
            onError={(e) => (e.target.style.display = "none")}
            className="w-10 h-10"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Marketplace</h1>
        </div>

        {/* Search & filters row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center w-full sm:w-72 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
            {/* search icon */}
            <svg className="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search product..."
              className="flex-1 text-gray-700 text-sm outline-none bg-transparent"
            />

            {q && (
              <button onClick={() => setQ("")} className="ml-2 text-gray-500 text-sm px-2">
                Clear
              </button>
            )}
          </div>

          {/* simple category / quick filters (replace or enhance as you want) */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={load} className="px-3 py-1 text-gray-700 bg-white border border-gray-200 rounded-md text-sm shadow-sm hover:bg-gray-50">All</button>
            <button className="px-3 py-1 text-gray-700 bg-white border border-gray-200 rounded-md text-sm shadow-sm hover:bg-gray-50">Cattle</button>
            <button className="px-3 py-1 text-gray-700 bg-white border border-gray-200 rounded-md text-sm shadow-sm hover:bg-gray-50">Buffalo</button>
            <button className="px-3 py-1 text-gray-700 bg-white border border-gray-200 rounded-md text-sm shadow-sm hover:bg-gray-50">Accessories</button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow border flex flex-col">
                <div className="w-full aspect-[4/3] overflow-hidden rounded-xl border">
                  <img
                    src={item?.image || item?.product?.image || "/placeholder.png"}
                    className="w-full h-full object-cover"
                    alt={item?.product?.title || "product"}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>

                <div className="mt-3 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{item?.product?.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item?.product?.category?.category_name || ""}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-800">₹{item?.price}</div>
                      <div className="text-xs text-gray-500">Stock: {item?.quantity_instock}</div>
                    </div>

                    <button
                      onClick={() => router.push(`/product/${item.productId}`)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


