// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SellerListingsPage() {
//   const router = useRouter();

//   const [loadingUser, setLoadingUser] = useState(true);
//   const [loading, setLoading] = useState(true);

//   const [listings, setListings] = useState([]);
//   const [error, setError] = useState("");

//   async function checkSeller() {
//     try {
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       if (res.status === 401) {
//         router.replace("/signin");
//         return;
//       }

//       const data = await res.json();
//       if (!res.ok || !data?.user) {
//         router.replace("/signin");
//         return;
//       }

//       if (data.user.role !== "SELLER") {
//         router.replace("/");
//         return;
//       }
//     } catch (e) {
//       console.error("checkSeller error", e);
//       router.replace("/signin");
//     } finally {
//       setLoadingUser(false);
//     }
//   }

//   async function fetchListings() {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch("/api/apis/seller/my-listings", {
//         method: "GET",
//         credentials: "include",
//       });

//       const text = await res.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         data = null;
//       }

//       if (!res.ok) {
//         setError(data?.message || "Failed to load listings");
//         return;
//       }

//       setListings(data.listings || []);
//     } catch (e) {
//       console.error("fetchListings error", e);
//       setError("Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     (async () => {
//       await checkSeller();
//       await fetchListings();
//     })();
   
//   }, []);

//   if (loadingUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         Checking seller access...
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 p-4">
//       <div className="max-w-6xl mx-auto">
        
//         <div className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               These are your active product listings.
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-2">
//             <button
//               onClick={() => router.push("/seller/createListing")}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//             >
//               + New Listing
//             </button>

//             <button
//               onClick={() => fetchListings()}
//                  className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"

//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
//             {error}
//           </div>
//         )}

//         <div className="mt-6">
//           {loading ? (
//             <div className="text-center text-gray-600 py-10">
//               Loading your listings...
//             </div>
//           ) : listings.length === 0 ? (
//             <div className="bg-white p-6 rounded-2xl shadow text-center">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 No listings found
//               </h2>
//               <p className="text-sm text-gray-500 mt-2">
//                 Create your first listing using the button above.
//               </p>

//               <button
//                 onClick={() => router.push("/seller/create-listing")}
//                 className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
//               >
//                 Create Listing
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {listings.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white rounded-2xl shadow p-4 border"
//                 >
//                   <div className="flex gap-4">
//                     <img
//                       src={item?.image || item?.product?.image || "/placeholder.png"}
//                       alt={item?.product?.title || "product"}
//                       className="w-20 h-20 rounded-xl object-cover border"
//                       onError={(e) => (e.target.src = "/placeholder.png")}
//                     />

//                     <div className="flex-1">
//                       <h3 className="text-base font-semibold text-gray-800">
//                         {item?.product?.title}
//                       </h3>

//                       <p className="text-xs text-gray-500 mt-1">
//                         {item?.product?.category?.category_name
//                           ? `🏷 ${item.product.category.category_name}`
//                           : ""}
//                         {item?.product?.breed?.breed_name
//                           ? `  •  🐮 ${item.product.breed.breed_name}`
//                           : ""}
//                         {item?.product?.milkcapacity?.capacity
//                           ? `  •  🧴 ${item.product.milkcapacity.capacity}L`
//                           : ""}
//                       </p>

//                       <div className="mt-3 grid grid-cols-2 gap-2">
//                         <div className="bg-slate-50 p-2 rounded-lg">
//                           <p className="text-xs text-gray-500">Your Price</p>
//                           <p className="text-sm font-semibold text-gray-800">
//                             ₹{item.price}
//                           </p>
//                         </div>

//                         <div className="bg-slate-50 p-2 rounded-lg">
//                           <p className="text-xs text-gray-500">Stock</p>
//                           <p className="text-sm font-semibold text-gray-800">
//                             {item.quantity_instock}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="mt-4 flex flex-col sm:flex-row gap-2">
//                         <button
//                           onClick={() =>
//                             router.push(`/seller/editListing/${item.productId}`)
//                           }
//                             className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium shadow-sm"

//                         >
//                           Edit
//                         </button>

//                         <button
//                           onClick={() =>
//                             router.push(`/product/${item.productId}`)
//                           }
//                           className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
//                         >
//                           View Product
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerListingsPage() {
  const router = useRouter();

  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(true);

  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  // ✅ NEW
  const [filter, setFilter] = useState("ALL"); // ALL | ACTIVE | PENDING | REJECTED

  async function checkSeller() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.status === 401) {
        router.replace("/signin");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data?.user) {
        router.replace("/signin");
        return;
      }

      if (data.user.role !== "SELLER") {
        router.replace("/");
        return;
      }
    } catch (e) {
      console.error("checkSeller error", e);
      router.replace("/signin");
    } finally {
      setLoadingUser(false);
    }
  }

  async function fetchListings() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/apis/seller/my-listings", {
        method: "GET",
        credentials: "include",
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        setError(data?.message || "Failed to load listings");
        return;
      }

      setListings(data.listings || []);
    } catch (e) {
      console.error("fetchListings error", e);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await checkSeller();
      await fetchListings();
    })();
  }, []);

  // ✅ NEW: filter listings
  const filteredListings = useMemo(() => {
    if (filter === "ALL") return listings;
    return listings.filter((x) => x?.status === filter);
  }, [listings, filter]);

  // ✅ NEW: counts for top filter buttons
  const counts = useMemo(() => {
    const total = listings.length;
    const active = listings.filter((x) => x?.status === "ACTIVE").length;
    const pending = listings.filter((x) => x?.status === "PENDING").length;
    const rejected = listings.filter((x) => x?.status === "REJECTED").length;

    return { total, active, pending, rejected };
  }, [listings]);

  function StatusBadge({ status }) {
    if (status === "ACTIVE") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
          Approved
        </span>
      );
    }

    if (status === "PENDING") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700">
          Pending
        </span>
      );
    }

    if (status === "REJECTED") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
          Rejected
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
        Unknown
      </span>
    );
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        Checking seller access...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
            <p className="text-sm text-gray-500 mt-1">
              View all your listings and their approval status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => router.push("/seller/createListing")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              + New Listing
            </button>

            <button
              onClick={() => fetchListings()}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ✅ Filter UI */}
        <div className="mt-4 bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-gray-700">Filter:</div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                filter === "ALL"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              All ({counts.total})
            </button>

            <button
              onClick={() => setFilter("ACTIVE")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                filter === "ACTIVE"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Active ({counts.active})
            </button>

            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                filter === "PENDING"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Pending ({counts.pending})
            </button>

            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                filter === "REJECTED"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Rejected ({counts.rejected})
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="text-center text-gray-600 py-10">
              Loading your listings...
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                No listings found
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {filter === "ALL"
                  ? "Create your first listing using the button above."
                  : `No ${filter.toLowerCase()} listings available.`}
              </p>

              <button
                onClick={() => router.push("/seller/createListing")}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow p-4 border"
                >
                  <div className="flex gap-4">
                    <img
                      src={item?.image || item?.product?.image || "/placeholder.png"}
                      alt={item?.product?.title || "product"}
                      className="w-20 h-20 rounded-xl object-cover border"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-gray-800">
                          {item?.product?.title}
                        </h3>

                        {/* ✅ Status badge */}
                        <StatusBadge status={item?.status} />
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {item?.product?.category?.category_name
                          ? `🏷 ${item.product.category.category_name}`
                          : ""}
                        {item?.product?.breed?.breed_name
                          ? `  •  🐮 ${item.product.breed.breed_name}`
                          : ""}
                        {item?.product?.milkcapacity?.capacity
                          ? `  •  🧴 ${item.product.milkcapacity.capacity}L`
                          : ""}
                      </p>

                      {/* ✅ reject reason */}
                      {item?.status === "REJECTED" && item?.reject_reason && (
                        <div className="mt-2 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg p-2">
                          Reason: {item.reject_reason}
                        </div>
                      )}

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Your Price</p>
                          <p className="text-sm font-semibold text-gray-800">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.quantity_instock}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {/* Edit always enabled */}
                        <button
                          onClick={() => router.push(`/seller/editListing/${item.productId}`)}
                          className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium shadow-sm"
                        >
                          Edit
                        </button>

                        {/* View product only if ACTIVE */}
                        <button
                          disabled={item?.status !== "ACTIVE"}
                          onClick={() => router.push(`/product/${item.productId}`)}
                          className={`px-3 py-2 rounded-lg transition text-sm font-medium shadow-sm ${
                            item?.status === "ACTIVE"
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
