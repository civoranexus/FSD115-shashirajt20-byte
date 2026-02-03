"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Seller = {
  id: number;
  name: string;
  email: string;
  phone_no?: string;
  avatar?: string;
};

export default function AdminApproveSellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/apis/admin/sellers/pending", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to load");
        return;
      }
      setSellers(data.sellers || []);
    } catch (e) {
      console.error("load pending sellers", e);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: number) {
    try {
      setActionLoading(id);
      const res = await fetch(`/api/apis/admin/sellers/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Approve failed");
        return;
      }
      setSellers((s) => s.filter((x) => x.id !== id));
    } catch (e) {
      console.error("approve error", e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-5 rounded-2xl shadow mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-500">Approve Sellers</h1>
            <p className="text-sm text-gray-500">Review and approve seller accounts.</p>
          </div>
          <button onClick={() => router.push("/admin")} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm">Back</button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading…</div>
        ) : sellers.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow text-gray-400">No pending sellers</div>
        ) : (
          <div className="space-y-4">
            {sellers.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src={s.avatar || "/placeholder.png"} alt={s.name} className="w-12 h-12 rounded-lg object-cover border" />
                <div className="flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.email} {s.phone_no ? `• ${s.phone_no}` : ""}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(s.id)} disabled={actionLoading === s.id} className="px-3 py-2 bg-green-600 text-white rounded">
                    {actionLoading === s.id ? "Approving…" : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
