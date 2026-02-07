// app/seller/apply/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SellerApplyPage() {
//   const router = useRouter();
//   const [storeName, setStoreName] = useState("");
//   const [gst, setGst] = useState("");
//   const [docs, setDocs] = useState(""); // simple comma-separated URLs for now
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [existing, setExisting] = useState(null);

//   useEffect(() => {
//     // load existing application if any
//     (async () => {
//       try {
//         const res = await fetch("/api/sellerapplication/sellers/my-application", { credentials: "include" });
//         if (!res.ok) return;
//         const data = await res.json();
//         if (data?.application) setExisting(data.application);
//       } catch (e) {}
//     })();
//   }, []);

//   async function submit(e) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/sellerapplication/sellers/apply", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ store_name: storeName, gst_number: gst, documents: docs, reason })
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         alert(data?.message || "Apply failed");
//         return;
//       }
//       alert("Application submitted");
//       router.push("/profile");
//     } catch (err) {
//       console.error("apply error", err);
//       alert("Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (existing) {
//     return (
//       <main className="min-h-screen p-4 bg-slate-50">
//         <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//           <h1 className="text-xl font-semibold mb-2">Your seller application</h1>
//           <div className="text-sm text-gray-600">Status: <strong>{existing.status}</strong></div>
//           {existing.status === "REJECTED" && <div className="mt-2 text-sm text-red-600">Reason: {existing.reject_note}</div>}
//           <div className="mt-4">
//             <div><strong>Store name</strong>: {existing.store_name}</div>
//             <div><strong>GST</strong>: {existing.gst_number || "—"}</div>
//             <div className="mt-2"><strong>Submitted</strong>: {new Date(existing.createdAt).toLocaleString()}</div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//         <h1 className="text-2xl font-bold mb-4">Apply to become a Seller</h1>
//         <form onSubmit={submit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-600">Store / Business name</label>
//             <input value={storeName} onChange={e => setStoreName(e.target.value)} required className="w-full border rounded px-3 py-2" />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">GST Number (optional)</label>
//             <input value={gst} onChange={e => setGst(e.target.value)} className="w-full border rounded px-3 py-2" />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">Documents (paste URLs, comma separated)</label>
//             <input value={docs} onChange={e => setDocs(e.target.value)} className="w-full border rounded px-3 py-2" />
//             <p className="text-xs text-gray-400 mt-1">You can paste link(s) to store photo / certificate for now.</p>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">Why should you be a seller?</label>
//             <textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} />
//           </div>

//           <div className="flex gap-2">
//             <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? "Submitting…" : "Submit application"}</button>
//             <button type="button" onClick={() => router.push("/products")} className="px-4 py-2 border rounded">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SellerApplyPage() {
//   const router = useRouter();
//   const [storeName, setStoreName] = useState("");
//   const [gst, setGst] = useState("");
//   const [docs, setDocs] = useState("");
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [existing, setExisting] = useState<any>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("/api/sellerapplication/sellers/my-application", { credentials: "include" });
//         if (!res.ok) return;
//         const data = await res.json();
//         if (data?.application) setExisting(data.application);
//       } catch {}
//     })();
//   }, []);

//   async function submit(e: any) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/sellerapplication/sellers/apply", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ store_name: storeName, gst_number: gst, documents: docs, reason })
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         alert(data?.message || "Apply failed");
//         return;
//       }

//       alert("Application submitted");
//       router.push("/profile");
//     } catch (err) {
//       console.error("apply error", err);
//       alert("Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ---------- EXISTING APPLICATION VIEW ---------- */
//   if (existing) {
//     return (
//       <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
//         <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Seller Application</h1>

//           <div className="text-sm text-gray-700">
//             Status:
//             <span className="ml-2 px-2 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold">
//               {existing.status}
//             </span>
//           </div>

//           {existing.status === "REJECTED" && (
//             <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
//               Reason: {existing.reject_note}
//             </div>
//           )}

//           <div className="mt-6 space-y-2 text-gray-800">
//             <div><strong>Store name:</strong> {existing.store_name}</div>
//             <div><strong>GST:</strong> {existing.gst_number || "—"}</div>
//             <div className="text-sm text-gray-600">
//               <strong>Submitted:</strong> {new Date(existing.createdAt).toLocaleString()}
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* ---------- APPLY FORM ---------- */
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply to Become a Seller</h1>
//         <p className="text-gray-600 mb-6">
//           Fill in your business details. Our team will review and approve your seller account.
//         </p>

//         <form onSubmit={submit} className="space-y-5">

//           {/* Store name */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-1">
//               Store / Business Name
//             </label>
//             <input
//               value={storeName}
//               onChange={e => setStoreName(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-lg px-3 py-2
//                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             />
//           </div>

//           {/* GST */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-1">
//               GST Number <span className="text-gray-400">(optional)</span>
//             </label>
//             <input
//               value={gst}
//               onChange={e => setGst(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2
//                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             />
//           </div>

//           {/* Docs */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-1">
//               Documents (URLs, comma separated)
//             </label>
//             <input
//               value={docs}
//               onChange={e => setDocs(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2
//                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Example: store photo, certificate, or ID proof links.
//             </p>
//           </div>

//           {/* Reason */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-1">
//               Why should you be a seller?
//             </label>
//             <textarea
//               value={reason}
//               onChange={e => setReason(e.target.value)}
//               rows={4}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2
//                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium
//                          hover:bg-indigo-700 transition disabled:opacity-60"
//             >
//               {loading ? "Submitting…" : "Submit Application"}
//             </button>

//             <button
//               type="button"
//               onClick={() => router.push("/products")}
//               className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium
//                          hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//           </div>

//         </form>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REASON_MAX = 500;

export default function SellerApplyPage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [gst, setGst] = useState("");
  const [docs, setDocs] = useState(""); // comma-separated URLs input
  const [docList, setDocList] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sellerapplication/sellers/my-application", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.application) setExisting(data.application);
      } catch {}
    })();
  }, []);

  // update doc chips from the input (call on blur or submit)
  function parseDocs(input: string) {
    const arr = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setDocList(arr);
  }

  function removeDoc(index: number) {
    const next = docList.slice();
    next.splice(index, 1);
    setDocList(next);
    setDocs(next.join(", "));
  }

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      // ensure docList is synced
      if (docList.length === 0 && docs.trim()) parseDocs(docs);

      const res = await fetch("/api/sellerapplication/sellers/apply", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_name: storeName,
          gst_number: gst,
          documents: docList.join(","),
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Apply failed");
        return;
      }

      alert("Application submitted");
      router.push("/profile");
    } catch (err) {
      console.error("apply error", err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- EXISTING APPLICATION VIEW ---------- */
  if (existing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Seller Application</h1>

          <div className="text-sm text-gray-700">
            Status:
            <span className="ml-2 inline-block px-2 py-1 rounded bg-indigo-100 text-indigo-800 font-semibold">
              {existing.status}
            </span>
          </div>

          {existing.status === "REJECTED" && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
              <strong className="block">Reason:</strong>
              <div className="mt-1">{existing.reject_note}</div>
            </div>
          )}

          <div className="mt-6 space-y-2 text-gray-800">
            <div><strong>Store name:</strong> {existing.store_name}</div>
            <div><strong>GST:</strong> {existing.gst_number || "—"}</div>
            <div className="text-sm text-gray-600">
              <strong>Submitted:</strong> {new Date(existing.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ---------- APPLY FORM ---------- */
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply to Become a Seller</h1>
        <p className="text-gray-700 mb-6">
          Tell us about your business. All fields and placeholders are high-contrast for better visibility.
        </p>

        <form onSubmit={submit} className="space-y-6">

          {/* Store name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Store / Business Name <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              placeholder="e.g. Shashi's Dairy & Co."
              required
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 placeholder-opacity-100 border border-gray-300 rounded-lg px-4 py-3
                         focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none text-base transition"
              aria-label="Store or Business name"
            />
          </div>

          {/* GST */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              GST Number <span className="text-gray-400">(optional)</span>
            </label>
            <input
              value={gst}
              onChange={e => setGst(e.target.value)}
              placeholder="12AAAAA0000A1Z5"
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 placeholder-opacity-100 border border-gray-300 rounded-lg px-4 py-3
                         focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-base transition"
              aria-label="GST number"
            />
          </div>

          {/* Docs */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Documents (URLs, comma separated)
            </label>

            <div className="relative">
              <input
                value={docs}
                onChange={e => setDocs(e.target.value)}
                onBlur={() => parseDocs(docs)}
                placeholder="https://… , https://…"
                className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 placeholder-opacity-100 border border-gray-300 rounded-lg px-4 py-3
                           focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-base transition pr-28"
                aria-describedby="docs-help"
              />
              {/* <button
                type="button"
                onClick={() => { parseDocs(docs); alert('Docs parsed — you can remove any tag below.'); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700 transition"
              >
                Parse
              </button> */}
            </div>

            <p id="docs-help" className="text-xs text-gray-500 mt-2">
              Example: link to store photo, certificate or ID proof. Click <b>Parse</b> to create link chips.
            </p>

            {docList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {docList.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm border border-indigo-100">
                    <a href={d} target="_blank" rel="noreferrer" className="underline truncate max-w-xs">{d}</a>
                    <button type="button" onClick={() => removeDoc(i)} className="ml-1 text-indigo-600 font-semibold">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Why should you be a seller?
            </label>
            <textarea
              value={reason}
              onChange={e => {
                if (e.target.value.length <= REASON_MAX) setReason(e.target.value);
              }}
              placeholder="Tell us about your business, products, experience and why you'd like to sell on Civora (max 500 chars)."
              rows={5}
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 placeholder-opacity-100 border border-gray-300 rounded-lg px-4 py-3
                         focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-base transition resize-vertical"
              aria-label="Reason to be a seller"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div>Briefly describe your business — buyers appreciate clarity.</div>
              <div>{reason.length}/{REASON_MAX}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium
                         hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/products")}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}