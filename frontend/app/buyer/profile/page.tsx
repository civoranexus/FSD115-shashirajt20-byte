// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function BuyerProfilePage() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   async function fetchAuth() {
//   try {
//     const res = await fetch("/api/auth/me", { credentials: "include" });

//     if (!res.ok) {
//       setUser(null);   // ✅ correct behavior on 401
//       return;
//     }

//     const data = await res.json();
//     setUser(data?.user || null);
//   } catch {
//     setUser(null);
//   }
// }

//   async function checkRole() {
//     const res = await fetch("/api/auth/me", { credentials: "include" });

//     if (res.status === 401) {
//       router.replace("/signin");
//       return false;
//     }

//     const data = await res.json();

//     if (data?.user?.role !== "BUYER") {
//       router.replace("/");
//       return false;
//     }

//     return true;
//   }

//   useEffect(() => {
//     checkRole();
//     fetch("/api/auth/me", { credentials: "include" })
//       .then((r) => r.json())
//       .then((d) => setUser(d.user))
//       .finally(() => setLoading(false));
//   }, []);
//   async function handleLogout() {
//     try {
//       const res = await fetch("/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//       if (!res.ok) {
//         console.error("Logout failed", res.status);
//         alert("Logout failed. Try again.");
//         return;
//       }
//       setUser(null);
//       router.push("/");
//     } catch (err) {
//       console.error("logout error", err);
//       alert("Network error");
//     }
//   }

//   /* ---------- Loading ---------- */
//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-gray-700 font-medium animate-pulse">
//           Loading profile…
//         </div>
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="bg-white p-6 rounded-xl shadow text-gray-700">
//           Failed to load profile
//         </div>
//       </div>
//     );

//   return (
//     <main className="min-h-screen bg-slate-50 p-6">
//       <div className="max-w-2xl mx-auto">

//         {/* Profile Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
//             <div className="flex items-center gap-4">

//               {/* Avatar */}
//               <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
//                 {user.name?.charAt(0).toUpperCase()}
//               </div>

//               {/* Name + role */}
//               <div>
//                 <h1 className="text-2xl font-semibold">{user.name}</h1>
//                 <p className="text-blue-100 text-sm">
//                   {user.role} • Marketplace Buyer
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="p-6 space-y-5">

//             {/* Info Grid */}
//             <div className="grid sm:grid-cols-2 gap-4">

//               <div className="bg-slate-50 p-4 rounded-lg border">
//                 <p className="text-xs text-gray-500 mb-1">Full Name</p>
//                 <p className="font-semibold text-gray-800">{user.name}</p>
//               </div>

//               <div className="bg-slate-50 p-4 rounded-lg border">
//                 <p className="text-xs text-gray-500 mb-1">Email Address</p>
//                 <p className="font-semibold text-gray-800 break-all">
//                   {user.email}
//                 </p>
//               </div>

//               <div className="bg-slate-50 p-4 rounded-lg border">
//                 <p className="text-xs text-gray-500 mb-1">Role</p>
//                 <p className="font-semibold text-indigo-700">{user.role}</p>
//               </div>

//               <div className="bg-slate-50 p-4 rounded-lg border">
//                 <p className="text-xs text-gray-500 mb-1">Account Status</p>
//                 <p className="font-semibold text-green-600">Active Buyer</p>
//               </div>
//             </div>

//             {/* Buyer Actions */}
//             <div className="flex flex-wrap gap-3 pt-2">

//               <button
//                 onClick={() => router.push("/orders")}
//                 className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium"
//               >
//                 View My Orders
//               </button>

//               <button
//                 onClick={() => router.push("/products")}
//                 className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
//               >
//                 Browse Marketplace
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-medium"
//               >
//                 Logout
//               </button>

//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-xs text-gray-400 mt-6">
//           Buyer dashboard • Secure shopping enabled
//         </p>

//       </div>
//     </main>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BuyerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [sellerStatus, setSellerStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  /* ---------- AUTH + ROLE ---------- */
  async function loadAll() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });

      if (res.status === 401) {
        router.replace("/signin");
        return;
      }

      const data = await res.json();

      if (data?.user?.role !== "BUYER") {
        router.replace("/");
        return;
      }

      setUser(data.user);

      /* ---------- ADDRESS ---------- */
      const addrRes = await fetch("/api/auth/my-address", {
        credentials: "include",
      });

      if (addrRes.ok) {
        const addrData = await addrRes.json();
        setAddress(addrData.address || null);
      }

      /* ---------- SELLER APPLICATION STATUS ---------- */
      const sellerRes = await fetch("/api/auth/seller-status", {
        credentials: "include",
      });

      if (sellerRes.ok) {
        const sellerData = await sellerRes.json();
        setSellerStatus(sellerData.status || null);
      }
    } catch (err) {
      console.error("profile load error", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        alert("Logout failed. Try again.");
        return;
      }

      router.push("/");
    } catch {
      alert("Network error");
    }
  }

  /* ---------- Loading ---------- */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-gray-700 font-medium animate-pulse">
          Loading profile…
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-xl shadow text-gray-700">
          Failed to load profile
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-semibold">{user.name}</h1>
                <p className="text-blue-100 text-sm">
                  {user.role} • Marketplace Buyer
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">

              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <p className="font-semibold text-gray-800 break-all">
                  {user.email}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className="font-semibold text-indigo-700">{user.role}</p>
              </div>

              {/* ---------- Seller Application Status ---------- */}
              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Seller Application</p>
                <p className="font-semibold">
                  {sellerStatus || "Not Applied"}
                </p>
              </div>

            </div>

            {/* ---------- Address Section ---------- */}
            <div className="bg-slate-50 p-4 rounded-lg border">
              <p className="text-xs text-gray-500 mb-2">Saved Address</p>

              {address ? (
                <div className="text-sm text-gray-800 space-y-1">
                  <p>{address.address_line1}</p>
                  <p>{address.address_line2}</p>
                  <p>
                    {address.city}, {address.region} - {address.postal_code}
                  </p>
                  <p>{address.country?.country}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address saved</p>
              )}

              <button
                onClick={() => router.push("/profile/edit")}
                className="mt-3 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Edit Address
              </button>
            </div>

            {/* Buyer Actions */}
            <div className="flex flex-wrap gap-3 pt-2">

              <button
                onClick={() => router.push("/orders")}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium"
              >
                View My Orders
              </button>

              <button
                onClick={() => router.push("/products")}
                className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
              >
                Browse Marketplace
              </button>

              {/* ---------- Become Seller Button ---------- */}
              {!sellerStatus && (
                <button
                  onClick={() => router.push("/seller/apply")}
                  className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition text-sm font-medium"
                >
                  Apply for Seller
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Buyer dashboard • Secure shopping enabled
        </p>

      </div>
    </main>
  );
}






















