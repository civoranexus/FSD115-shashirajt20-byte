"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SellerEditListingPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params?.productId;

  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(true);

  const [listing, setListing] = useState(null);

  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  async function fetchListing() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/apis/seller/my-listings/${productId}`, {
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
        setError(data?.message || "Failed to load listing");
        return;
      }

      const item = data?.listing;
      setListing(item);

      setPrice(item?.price || "");
      setQuantity(String(item?.quantity_instock ?? ""));
      setImageUrl(item?.image || item?.product?.image || "");
    } catch (e) {
      console.error("fetchListing error", e);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!productId) return;

    (async () => {
      await checkSeller();
      await fetchListing();
    })();
  
  }, [productId]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!price) return setError("Price is required");
    if (isNaN(Number(price)) || Number(price) < 0) return setError("Enter valid price");

    setSubmitting(true);

    const payload = {
      productId: Number(productId),
      price: Number(price).toFixed(2),
      quantity_instock: quantity ? Number(quantity) : 0,
      image: imageUrl || null,
    };

    try {
      const res = await fetch("/api/apis/seller/product-item", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        setError(data?.message || "Update failed");
        return;
      }

      setSuccess("Listing updated successfully ✅");
      setTimeout(() => router.push("/seller/listings"), 700);
    } catch (err) {
      console.error("update listing error", err);
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Listing</h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your price, stock and image.
              </p>
            </div>

            <button
              onClick={() => router.push("/seller/listings")}
                 className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"
            >
              ← Back
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg border border-green-100">
              {success}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-gray-600">
              Loading listing...
            </div>
          ) : (
            <>
              {/* Product card */}
              <div className="mt-5 border rounded-xl p-4 bg-slate-50 flex gap-4">
                <img
                  src={listing?.product?.image || "/placeholder.png"}
                  alt="product"
                  className="w-24 h-24 rounded-xl object-cover border"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">
                    {listing?.product?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {listing?.product?.description}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {listing?.product?.category?.category_name
                      ? `🏷 ${listing.product.category.category_name}`
                      : ""}
                    {listing?.product?.breed?.breed_name
                      ? `  •  🐮 ${listing.product.breed.breed_name}`
                      : ""}
                    {listing?.product?.milkcapacity?.capacity
                      ? `  •  🧴 ${listing.product.milkcapacity.capacity}L`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdate} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity in stock
                  </label>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/seller/listings")}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium shadow-sm ${
                      submitting
                        ? "bg-indigo-300"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {submitting ? "Updating..." : "Update Listing"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
