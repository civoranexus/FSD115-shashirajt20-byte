// app/admin/sellerApplications/page.tsx
// "use client";

// import { useEffect, useState } from "react";

// export default function AdminSellerApplicationsPage() {
//   const [apps, setApps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);

//   async function load() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/sellerapplication/admin/sellers-applications", { credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) { alert(data?.message || "Failed"); return; }
//       setApps(data.applications || []);
//     } catch (e) { console.error(e); alert("Network error"); }
//     finally { setLoading(false); }
//   }

//   useEffect(() => { load(); }, []);

//   async function approve(id) {
//     setActionLoading(id);
//     try {
//       const res = await fetch(`/api/sellerapplication/admin/sellers-applications/${id}/approve`, { method: "POST", credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) { alert(data?.message || "Approve failed"); return; }
//       setApps(prev => prev.filter(a => a.id !== id));
//     } catch (e) { console.error(e); alert("Network error"); }
//     finally { setActionLoading(null); }
//   }

//   async function reject(id) {
//     const note = prompt("Reject reason (optional)");
//     if (note === null) return;
//     setActionLoading(id);
//     try {
//       const res = await fetch(`/api/sellerapplication/admin/sellers-applications/${id}/reject`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason: note })
//       });
//       const data = await res.json();
//       if (!res.ok) { alert(data?.message || "Reject failed"); return; }
//       setApps(prev => prev.filter(a => a.id !== id));
//     } catch (e) { console.error(e); alert("Network error"); }
//     finally { setActionLoading(null); }
//   }

//   if (loading) return <div className="p-4">Loading…</div>;

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Seller Applications</h1>

//         {apps.length === 0 ? (
//           <div className="bg-white p-6 rounded shadow text-center text-gray-500">No pending applications</div>
//         ) : (
//           <div className="space-y-4">
//             {apps.map(a => (
//               <div key={a.id} className="bg-white p-4 rounded shadow border">
//                 <div className="flex justify-between">
//                   <div>
//                     <div className="font-semibold">{a.user?.name} ({a.user?.email})</div>
//                     <div className="text-sm text-gray-500">{a.store_name} • applied {new Date(a.createdAt).toLocaleString()}</div>
//                     {a.reason && <div className="mt-2 text-sm text-gray-700">{a.reason}</div>}
//                   </div>

//                   <div className="flex flex-col gap-2">
//                     <button disabled={actionLoading===a.id} onClick={() => approve(a.id)} className="px-3 py-2 bg-green-600 text-white rounded">Approve</button>
//                     <button disabled={actionLoading===a.id} onClick={() => reject(a.id)} className="px-3 py-2 bg-red-600 text-white rounded">Reject</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
