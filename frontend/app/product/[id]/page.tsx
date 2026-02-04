// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [product, setProduct] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     setLoading(true);
//     try {
//       const [pRes, iRes] = await Promise.all([
//         fetch(`/api/apis/products/${id}`),
//         fetch(`/api/apis/product-items/product/${id}`)
//       ]);
//       const pData = await pRes.json();
//       const iData = await iRes.json();
//       if (pRes.ok) setProduct(pData.product);
//       if (iRes.ok) setItems(iData.items || []);
//     } catch (e) {
//       console.error("product load error", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { if (id) load(); }, [id]);

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (!product) return <div className="p-4">Product not found</div>;

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
//         <div className="flex gap-6">
//           <img src={product.image || "/placeholder.png"} className="w-48 h-48 object-cover rounded" />
//           <div>
//             <h1 className="text-2xl font-bold">{product.title}</h1>
//             <p className="text-sm text-gray-600 mt-2">{product.description}</p>
//             <p className="mt-4 text-sm">Category: {product.category?.category_name}</p>
//             <p className="mt-1 text-sm">Breed: {product.breed?.breed_name}</p>
//           </div>
//         </div>

//         <h2 className="text-xl mt-6 font-semibold">Sellers (Active)</h2>
//         <div className="mt-3 grid grid-cols-1 gap-3">
//           {items.length === 0 ? <div className="text-gray-500">No active sellers for this product</div> : items.map(i => (
//             <div key={i.id} className="flex items-center justify-between p-3 border rounded">
//               <div>
//                 <div className="font-semibold">{i.user?.name || "Seller"}</div>
//                 <div className="text-sm text-gray-500">₹{i.price} • Stock: {i.quantity_instock}</div>
//               </div>
//               <div>
//                 <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={() => { /* add to cart flow later */ }}>
//                   Buy / Add
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// export default function ProductDetailPage() {
//   const params = useParams();
//   const router = useRouter();

//   const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

//   const [product, setProduct] = useState<any>(null);
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     setLoading(true);

//     try {
//       const [pRes, iRes] = await Promise.all([
//         fetch(`/api/apis/products/${id}`, {
//           method: "GET",
//           credentials: "include",
//         }),
//         fetch(`/api/apis/product-items/product/${id}`, {
//           method: "GET",
//           credentials: "include",
//         }),
//       ]);

//       // ✅ safe parsing (avoid Unexpected token '<')
//       const pText = await pRes.text();
//       const iText = await iRes.text();

//       let pData: any = null;
//       let iData: any = null;

//       try {
//         pData = JSON.parse(pText);
//       } catch {
//         pData = null;
//       }

//       try {
//         iData = JSON.parse(iText);
//       } catch {
//         iData = null;
//       }

//       if (pRes.ok) {
//         setProduct(pData?.product || null);
//       } else {
//         setProduct(null);
//       }

//       if (iRes.ok) {
//         setItems(iData?.items || []);
//       } else {
//         setItems([]);
//       }
//     } catch (e) {
//       console.error("product load error", e);
//       setProduct(null);
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (id) load();
//   }, [id]);

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (!product) return <div className="p-4">Product not found</div>;

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
//         <div className="flex gap-6">
//           <img
//             src={product?.image || "/placeholder.png"}
//             className="w-48 h-48 object-cover rounded border"
//             alt="product"
//             onError={(e: any) => (e.target.src = "/placeholder.png")}
//           />

//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">{product?.title}</h1>
//             <p className="text-sm text-gray-600 mt-2">{product?.description}</p>

//             <p className="mt-4 text-sm text-gray-700">
//               Category: {product?.category?.category_name || "-"}
//             </p>

//             <p className="mt-1 text-sm text-gray-700">
//               Breed: {product?.breed?.breed_name || "-"}
//             </p>

//             <p className="mt-1 text-sm text-gray-700">
//               Milk: {product?.milkcapacity?.capacity ? `${product.milkcapacity.capacity}L` : "-"}
//             </p>
//           </div>
//         </div>

//         <h2 className="text-xl mt-6 font-semibold text-gray-800">Sellers (Active)</h2>

//         <div className="mt-3 grid grid-cols-1 gap-3">
//           {items.length === 0 ? (
//             <div className="text-gray-500">No active sellers for this product</div>
//           ) : (
//             items.map((i) => (
//               <div
//                 key={i.id}
//                 className="flex items-center justify-between p-3 border rounded bg-slate-50"
//               >
//                 <div>
//                   <div className="font-semibold text-gray-800">
//                     {i?.user?.name || "Seller"}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     ₹{i?.price} • Stock: {i?.quantity_instock}
//                   </div>
//                 </div>

//                 <button
//                   className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
//                   onClick={() => {
//                     alert("Cart feature later 🙂");
//                   }}
//                 >
//                   Buy / Add
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="mt-6">
//           <button
//             onClick={() => router.push("/products")}
//             className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"
//           >
//             ← Back to Marketplace
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [product, setProduct] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [pRes, iRes] = await Promise.all([
        fetch(`/api/apis/products/${id}`, { method: "GET", credentials: "include" }),
        fetch(`/api/apis/product-items/product/${id}`, { method: "GET", credentials: "include" }),
      ]);

      const pText = await pRes.text();
      const iText = await iRes.text();

      let pData = null;
      let iData = null;
      try { pData = JSON.parse(pText); } catch { pData = null; }
      try { iData = JSON.parse(iText); } catch { iData = null; }

      setProduct(pRes.ok ? pData?.product || null : null);
      setItems(iRes.ok ? iData?.items || [] : []);
    } catch (e) {
      console.error("product load error", e);
      setProduct(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left: image */}
          <div className="w-full sm:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md aspect-[1/1] rounded-xl overflow-hidden border">
              <img
                src={product?.image || "/placeholder.png"}
                alt={product?.title || "product"}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>
          </div>

          {/* Right: details */}
          <div className="w-full sm:w-1/2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">{product?.title}</h1>
              <div className="text-sm text-gray-500">{product?.milkcapacity?.capacity ? `${product.milkcapacity.capacity}L` : "-"}</div>
            </div>

            <p className="text-sm text-gray-600 mt-2">{product?.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>Category: <span className="font-medium">{product?.category?.category_name || "-"}</span></div>
              <div>Breed: <span className="font-medium">{product?.breed?.breed_name || "-"}</span></div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Sellers (Active)</h2>
              <p className="text-sm text-gray-500 mt-1">{items.length} seller(s)</p>

              <div className="mt-3 space-y-3">
                {items.length === 0 ? (
                  <div className="text-gray-500">No active sellers for this product</div>
                ) : items.map((i) => (
                  <div key={i.id} className="flex items-center justify-between p-3 border rounded bg-slate-50">
                    <div>
                      <div className="font-semibold text-gray-800">{i?.user?.name || "Seller"}</div>
                      <div className="text-sm text-gray-500">₹{i?.price} • Stock: {i?.quantity_instock}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/product/${id}`)}
                        className="px-3 py-2 bg-white border border-gray-200 text-gray-800 rounded hover:bg-gray-50 text-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() => alert("Cart / Buy flow later")}
                        className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push("/products")}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"
              >
                ← Back to Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
