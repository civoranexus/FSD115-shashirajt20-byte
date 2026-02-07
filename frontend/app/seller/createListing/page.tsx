"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerCreateListingPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // form state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchMe() {
      try {
        setLoadingUser(true);
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.status === 401) {
          router.replace("/signin");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          router.replace("/signin");
          return;
        }
        if (data?.user) {
          if (data.user.role !== "SELLER") {
            // not a seller
            router.replace("/");
            return;
          }
          if (mounted) setUser(data.user);
        } else {
          router.replace("/signin");
        }
      } catch (e) {
        console.error("fetch /api/auth/me error", e);
        router.replace("/signin");
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    fetchMe();
    return () => { mounted = false; };
  }, [router]);

  useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/apis/products");
        if (!res.ok) {
          console.warn("could not load products");
          return;
        }
        const data = await res.json();
        if (mounted) setProducts(data);
      } catch (e) {
        console.error("load products error", e);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    }
    fetchProducts();
    return () => (mounted = false);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProductId) return setError("Choose a product frame first");
    if (!price) return setError("Set a price");
    if (isNaN(Number(price)) || Number(price) < 0) return setError("Enter a valid non-negative price");

    setSubmitting(true);
    const payload = {
      productId: Number(selectedProductId),
      price: Number(price).toFixed(2),
      quantity_instock: quantity ? Number(quantity) : 0,
      image: image || null,
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
      try { data = JSON.parse(text); } catch { data = null; }

      if (!res.ok) {
        setError(data?.message || "Server error while creating listing");
      } else {
        setSuccess((data?.action === "updated" ? "Listing updated." : "Listing created."));
       
        setPrice("");
        setQuantity("");
        setImage("");
    
        setTimeout(() => router.push("/seller/listings"), 800);
      }
    } catch (err) {
      console.error("create listing error", err);
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingUser) return <div className="min-h-screen flex items-center justify-center p-4">Checking seller access…</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow">
          <h1 className="text-xl font-bold mb-2 text-black">Create Seller Listing</h1>
          <p className="text-sm text-gray-500 mb-4">Choose a product frame and set your price & stock.</p>

          {loadingProducts ? (
            <p>Loading product frames…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">Product Frame</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-black"
                >
                  <option value="">Select product frame</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.category?.category_name ? `— ${p.category.category_name}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">Price (₹)</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400" placeholder="e.g. 15000.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">Quantity in stock</label>
                <input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400" placeholder="e.g. 2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">Image URL (optional)</label>
                <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400" placeholder="https://example.com/img.jpg" />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => router.push("/seller")} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-sm">Cancel</button>
                <button type="submit" disabled={submitting} className={`px-4 py-2 rounded text-white ${submitting ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                  {submitting ? "Submitting..." : "Create Listing"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
