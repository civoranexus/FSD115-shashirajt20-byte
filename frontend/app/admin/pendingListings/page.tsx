"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Listing = {
  id: number;
  status: "PENDING" | "ACTIVE" | "REJECTED";
  reject_reason?: string | null;
  price: string;
  quantity_instock: number;
  image?: string | null;

  user: {
    id: number;
    name: string;
    email: string;
    phone_no?: string;
    avatar?: string;
  };

  product: {
    id: number;
    title: string;
    description: string;
    image?: string | null;

    category?: { category_name: string };
    breed?: { breed_name: string };
    milkcapacity?: { capacity: number };
  };
};

export default function AdminPendingListingsPage() {
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/apis/admin/listings/pending", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to load pending listings");
        return;
      }

      setListings(data?.listings || []);
    } catch (e) {
      console.error("load pending listings error", e);
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

      const res = await fetch(`/api/apis/admin/listings/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Approve failed");
        return;
      }

      setListings((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("approve listing error", e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  async function reject() {
    if (!rejectId) return;

    try {
      setActionLoading(rejectId);

      const res = await fetch(`/api/apis/admin/listings/${rejectId}/reject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Reject failed");
        return;
      }

      setListings((prev) => prev.filter((x) => x.id !== rejectId));
      setRejectId(null);
      setRejectReason("");
    } catch (e) {
      console.error("reject listing error", e);
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pending Listings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Approve or reject seller listings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"
            >
              Back
            </button>

            <button
              onClick={load}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {/* content */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-10 text-gray-600">
              Loading pending listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                No pending listings
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                All listings are already processed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow p-4 border"
                >
                  <div className="flex gap-4">
                    <img
                      src={item?.image || item?.product?.image || "/placeholder.png"}
                      alt="listing"
                      className="w-20 h-20 rounded-xl object-cover border"
                      onError={(e: any) =>
                        (e.target.src = "/placeholder.png")
                      }
                    />

                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800">
                        {item?.product?.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Seller:{" "}
                        <span className="font-medium">
                          {item?.user?.name}
                        </span>{" "}
                        ({item?.user?.email})
                      </p>

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

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Price</p>
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
                        <button
                          onClick={() => approve(item.id)}
                          disabled={actionLoading === item.id}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-sm disabled:opacity-50"
                        >
                          {actionLoading === item.id
                            ? "Approving..."
                            : "Approve"}
                        </button>

                        <button
                          onClick={() => {
                            setRejectId(item.id);
                            setRejectReason("");
                          }}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm"
                        >
                          Reject
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

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-800">
              Reject Listing
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add reject reason (optional)
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-4 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
              rows={4}
              placeholder="Reason..."
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRejectId(null)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"
              >
                Cancel
              </button>

              <button
                onClick={reject}
                disabled={actionLoading === rejectId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm disabled:opacity-50"
              >
                {actionLoading === rejectId ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
