// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type Seller = {
//   id: number;
//   name: string;
//   email: string;
//   phone_no?: string;
//   avatar?: string;
// };

// export default function AdminApproveSellersPage() {
//   const router = useRouter();
//   const [sellers, setSellers] = useState<Seller[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<number | null>(null);
//   const [error, setError] = useState("");

//   async function load() {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/apis/admin/sellers/pending", {
//         method: "GET",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setError(data?.message || "Failed to load");
//         return;
//       }
//       setSellers(data.sellers || []);
//     } catch (e) {
//       console.error("load pending sellers", e);
//       setError("Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function approve(id: number) {
//     try {
//       setActionLoading(id);
//       const res = await fetch(`/api/apis/admin/sellers/${id}/approve`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         alert(data?.message || "Approve failed");
//         return;
//       }
//       setSellers((s) => s.filter((x) => x.id !== id));
//     } catch (e) {
//       console.error("approve error", e);
//       alert("Network error");
//     } finally {
//       setActionLoading(null);
//     }
//   }

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white p-5 rounded-2xl shadow mb-4 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-500">Approve Sellers</h1>
//             <p className="text-sm text-gray-500">Review and approve seller accounts.</p>
//           </div>
//           <button onClick={() => router.push("/admin")} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm">Back</button>
//         </div>

//         {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

//         {loading ? (
//           <div className="text-center py-8 text-gray-600">Loading…</div>
//         ) : sellers.length === 0 ? (
//           <div className="bg-white rounded-2xl p-6 text-center shadow text-gray-400">No pending sellers</div>
//         ) : (
//           <div className="space-y-4">
//             {sellers.map((s) => (
//               <div key={s.id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
//                 <img src={s.avatar || "/placeholder.png"} alt={s.name} className="w-12 h-12 rounded-lg object-cover border" />
//                 <div className="flex-1">
//                   <div className="font-semibold">{s.name}</div>
//                   <div className="text-sm text-gray-500">{s.email} {s.phone_no ? `• ${s.phone_no}` : ""}</div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button onClick={() => approve(s.id)} disabled={actionLoading === s.id} className="px-3 py-2 bg-green-600 text-white rounded">
//                     {actionLoading === s.id ? "Approving…" : "Approve"}
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


// "use client";

// import { useEffect, useMemo, useState } from "react";

// export default function AdminSellerApplicationsPage() {
//   const [apps, setApps] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<number | null>(null);

//   // UI state
//   const [q, setQ] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
//   const [sort, setSort] = useState<"NEW" | "OLD">("NEW");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 6;

//   // Modal
//   const [detailApp, setDetailApp] = useState<any | null>(null);
//   const [confirmAction, setConfirmAction] = useState<{ id: number; type: "APPROVE" | "REJECT" } | null>(null);
//   const [rejectNote, setRejectNote] = useState("");

//   async function load() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/sellerapplication/admin/sellers-applications", { credentials: "include" });
//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch { data = null; }
//       if (!res.ok) {
//         alert(data?.message || "Failed to load applications");
//         return;
//       }
//       // normalize ids into numbers/strings
//       const normalized = (data.applications || []).map((a: any) => {
//         const out = { ...(a || {}) };
//         out.id = out.id ?? out._id ?? out._id?.toString();
//         return out;
//       });
//       setApps(normalized);
//     } catch (e) {
//       console.error("load apps error", e);
//       alert("Network error while loading applications");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   // Derived / filtered list
//   const filtered = useMemo(() => {
//     const qNormalized = q.trim().toLowerCase();
//     let list = apps.slice();

//     if (statusFilter !== "ALL") {
//       list = list.filter((a) => (a.status || a.application?.status || "").toUpperCase() === statusFilter);
//     }

//     if (qNormalized) {
//       list = list.filter((a) => {
//         const name = (a.user?.name || a.user_name || "").toLowerCase();
//         const email = (a.user?.email || a.user_email || "").toLowerCase();
//         const store = (a.store_name || "").toLowerCase();
//         return name.includes(qNormalized) || email.includes(qNormalized) || store.includes(qNormalized);
//       });
//     }

//     list.sort((a: any, b: any) => {
//       const ta = new Date(a.createdAt || a.created_at || 0).getTime();
//       const tb = new Date(b.createdAt || b.created_at || 0).getTime();
//       return sort === "NEW" ? tb - ta : ta - tb;
//     });

//     return list;
//   }, [apps, q, statusFilter, sort]);

//   const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   useEffect(() => { if (page > pages) setPage(1); }, [pages]); // reset page when filtering changes

//   const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   // Approve / reject flows with optimistic UI
//   async function doApprove(id: number | string) {
//     setActionLoading(Number(id));
//     try {
//       const res = await fetch(`/api/sellerapplication/admin/sellers-applications/${id}/approve`, {
//         method: "POST",
//         credentials: "include",
//       });
//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch {}
//       if (!res.ok) {
//         alert(data?.message || "Approve failed");
//         return;
//       }
//       // optimistic remove or update status
//       setApps(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED" } : a));
//     } catch (e) {
//       console.error("approve error", e);
//       alert("Network error approving application");
//     } finally {
//       setActionLoading(null);
//       setConfirmAction(null);
//     }
//   }

//   async function doReject(id: number | string, reason?: string) {
//     setActionLoading(Number(id));
//     try {
//       const res = await fetch(`/api/sellerapplication/admin/sellers-applications/${id}/reject`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason: reason || "" }),
//       });
//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch {}
//       if (!res.ok) {
//         alert(data?.message || "Reject failed");
//         return;
//       }
//       setApps(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED", reject_note: reason } : a));
//     } catch (e) {
//       console.error("reject error", e);
//       alert("Network error rejecting application");
//     } finally {
//       setActionLoading(null);
//       setConfirmAction(null);
//       setRejectNote("");
//     }
//   }

//   // UI small helpers
//   function openDetails(a: any) { setDetailApp(a); }
//   function closeDetails() { setDetailApp(null); }

//   if (loading) return <div className="p-6">Loading applications…</div>;

//   return (
//     <main className="min-h-screen p-6 bg-slate-50">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <h1 className="text-2xl font-bold text-gray-700">Seller Applications</h1>

//           <div className="flex gap-3 items-center">
//             <input
//               value={q}
//               onChange={(e) => { setQ(e.target.value); setPage(1); }}
//               placeholder="Search name, email or store..."
//               className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm w-[260px] focus:ring-2 focus:ring-indigo-200 outline-none"
//             />

//             <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
//               className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-200 outline-none">
//               <option value="ALL">All statuses</option>
//               <option value="PENDING">Pending</option>
//               <option value="APPROVED">Approved</option>
//               <option value="REJECTED">Rejected</option>
//             </select>

//             <select value={sort} onChange={(e) => setSort(e.target.value as any)}
//               className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-200 outline-none">
//               <option value="NEW">Newest first</option>
//               <option value="OLD">Oldest first</option>
//             </select>

//             <div className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
//           </div>
//         </header>

//         {filtered.length === 0 ? (
//           <div className="bg-white p-6 rounded shadow text-center text-gray-500">No applications found.</div>
//         ) : (
//           <>
//             <div className="space-y-4">
//               {pageData.map(a => {
//                 const status = (a.status || "").toUpperCase() || (a.application?.status || "").toUpperCase();
//                 return (
//                   <div key={String(a.id)} className="bg-white p-4 rounded shadow border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <div className="flex items-start gap-4">
//                       <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-semibold">
//                         { (a.user?.name || a.user_name || "U").charAt(0).toUpperCase() }
//                       </div>

//                       <div>
//                         <div className="font-semibold text-gray-700">{a.user?.name || a.user_name || "Unknown"}</div>
//                         <div className="text-sm text-gray-500">{a.user?.email || a.user_email || "—"}</div>
//                         <div className="text-sm text-gray-600 mt-1">{a.store_name} • <span className="text-gray-400">{new Date(a.createdAt || a.created_at).toLocaleString()}</span></div>
//                         {a.reason && <div className="mt-2 text-sm text-gray-700 max-w-xl">{a.reason}</div>}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <button onClick={() => openDetails(a)} className="px-3 py-2 border rounded text-sm hover:bg-gray-50">View</button>

//                       {status === "PENDING" && (
//                         <>
//                           <button
//                             onClick={() => setConfirmAction({ id: a.id, type: "APPROVE" })}
//                             disabled={actionLoading === a.id}
//                             className="px-3 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-60"
//                           >
//                             {actionLoading === a.id && confirmAction?.type === "APPROVE" ? "Processing…" : "Approve"}
//                           </button>

//                           <button
//                             onClick={() => setConfirmAction({ id: a.id, type: "REJECT" })}
//                             disabled={actionLoading === a.id}
//                             className="px-3 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-60"
//                           >
//                             {actionLoading === a.id && confirmAction?.type === "REJECT" ? "Processing…" : "Reject"}
//                           </button>
//                         </>
//                       )}

//                       <div className={`px-2 py-1 rounded text-sm font-semibold ${
//                         status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
//                         status === "APPROVED" ? "bg-green-100 text-green-800" :
//                         status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
//                       }`}>
//                         {status || "—"}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* pagination */}
//             <div className="mt-6 flex items-center justify-between">
//               <div className="text-sm text-gray-600">Page {page} of {pages}</div>
//               <div className="flex items-center gap-2">
//                 <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">First</button>
//                 <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
//                 <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
//                 <button onClick={() => setPage(pages)} disabled={page === pages} className="px-3 py-1 border rounded disabled:opacity-50">Last</button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Details modal */}
//       {detailApp && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/40" onClick={closeDetails}></div>
//           <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 z-10 shadow-lg">
//             <div className="flex justify-between items-start gap-4">
//               <div>
//                 <h2 className="text-lg font-bold">{detailApp.user?.name || detailApp.user_name}</h2>
//                 <div className="text-sm text-gray-600">{detailApp.user?.email || detailApp.user_email}</div>
//                 <div className="text-sm text-gray-700 mt-2"><strong>Store:</strong> {detailApp.store_name}</div>
//                 <div className="text-sm text-gray-500 mt-1"><strong>Applied:</strong> {new Date(detailApp.createdAt || detailApp.created_at).toLocaleString()}</div>
//               </div>

//               <div>
//                 <button onClick={closeDetails} className="px-3 py-1 border rounded text-sm">Close</button>
//               </div>
//             </div>

//             {detailApp.reason && <div className="mt-4 text-sm text-gray-700">{detailApp.reason}</div>}

//             {/* docs */}
//             <div className="mt-4">
//               <h3 className="text-sm font-semibold text-gray-700 mb-2">Documents</h3>
//               <div className="flex flex-wrap gap-2">
//                 {(detailApp.documents || detailApp.documents?.split?.(",") || []).map((d: any, i: number) => {
//                   const url = (typeof d === "string" ? d : (d.url || d)).trim();
//                   if (!url) return null;
//                   return (
//                     <a key={i} href={url} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded bg-indigo-50 text-indigo-700 text-sm hover:underline">
//                       View doc {i + 1}
//                     </a>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm modal for approve/reject */}
//       {confirmAction && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmAction(null)}></div>

//           <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-10 shadow-lg">
//             <h3 className="text-lg font-semibold mb-3">{confirmAction.type === "APPROVE" ? "Approve application" : "Reject application"}</h3>

//             {confirmAction.type === "REJECT" && (
//               <div className="mb-3">
//                 <label className="block text-sm text-gray-700 mb-1">Reject note (optional)</label>
//                 <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
//               </div>
//             )}

//             <div className="flex gap-3 justify-end">
//               <button onClick={() => setConfirmAction(null)} className="px-4 py-2 border rounded">Cancel</button>
//               <button
//                 onClick={() => {
//                   if (confirmAction.type === "APPROVE") doApprove(confirmAction.id);
//                   else doReject(confirmAction.id, rejectNote);
//                 }}
//                 className={`px-4 py-2 rounded font-medium ${confirmAction.type === "APPROVE" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
//                 disabled={actionLoading === confirmAction.id}
//               >
//                 {actionLoading === confirmAction.id ? "Working…" : (confirmAction.type === "APPROVE" ? "Approve" : "Reject")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";

export default function AdminSellerApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/sellerapplication/admin/sellers-applications", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed");
        return;
      }
      setApps(data.applications || []);
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(
        `/api/sellerapplication/admin/sellers-applications/${id}/approve`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Approve failed");
        return;
      }
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  async function reject(id: string) {
    const note = prompt("Reject reason (optional)");
    if (note === null) return;

    setActionLoading(id);
    try {
      const res = await fetch(
        `/api/sellerapplication/admin/sellers-applications/${id}/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: note }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Reject failed");
        return;
      }
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading applications…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-white p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-center sm:text-left text-gray-800">
          Seller Applications
        </h1>

        {/* Empty state */}
        {apps.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500 border">
            No pending applications
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((a) => (
              <div
                key={a.id}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="font-semibold text-base sm:text-lg text-gray-900">
                      {a.user?.name}
                      <span className="text-gray-500 text-sm"> ({a.user?.email})</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Store:</span> {a.store_name}
                    </div>

                    <div className="text-xs text-gray-400">
                      Applied {new Date(a.createdAt).toLocaleString()}
                    </div>

                    {a.reason && (
                      <div className="mt-2 text-sm text-gray-700 bg-slate-50 border rounded-lg p-2">
                        {a.reason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                    <button
                      disabled={actionLoading === a.id}
                      onClick={() => approve(a.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      {actionLoading === a.id ? "Processing…" : "Approve"}
                    </button>

                    <button
                      disabled={actionLoading === a.id}
                      onClick={() => reject(a.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      {actionLoading === a.id ? "Processing…" : "Reject"}
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
