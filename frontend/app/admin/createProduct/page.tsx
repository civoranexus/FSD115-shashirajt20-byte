
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Industry-standard Create Catalog Product page
 * - Uses /api/* routes (works with your rewrites)
 * - Mobile-first responsive layout (Tailwind)
 * - Accessible labels and error handling
 * - Fetches selects gracefully (if endpoints exist)
 * - Posts JSON with credentials (cookie auth)
 */

/* ---------------------------
   Types
   --------------------------- */
type Role = "BUYER" | "SELLER" | "ADMIN";

type User = {
  id: number;
  name?: string;
  email: string;
  role: Role;
};

type SelectItem = { id: number; label: string };

/* ---------------------------
   Component
   --------------------------- */
export default function CreateProductPage(){
  const router = useRouter();

  // auth state
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [breedId, setBreedId] = useState<number | "">("");
  const [milkCapacityId, setMilkCapacityId] = useState<number | "">("");

  // selects
  const [categories, setCategories] = useState<SelectItem[]>([]);
  const [breeds, setBreeds] = useState<SelectItem[]>([]);
  const [milkcapacities, setMilkcapacities] = useState<SelectItem[]>([]);

  // submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------------------------
     Authenticate & authorize (admin only)
     --------------------------- */
  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        setLoadingUser(true);
        setAuthError(null);

        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          if (mounted) router.replace("/signin");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          if (mounted) {
            setAuthError(data?.message || "Not authorized");
            router.replace("/");
          }
          return;
        }

        if (data?.user) {
          const u = data.user as User;
          if (u.role !== "ADMIN") {
            // protect page on client too
            router.replace("/");
            return;
          }
          if (mounted) setUser(u);
        } else {
          router.replace("/signin");
        }
      } catch (err) {
        console.error("auth fetch error", err);
        if (mounted) setAuthError("Network error while verifying authentication");
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }
    fetchMe();
    return () => {
      mounted = false;
    };
  }, [router]);

  /* ---------------------------
     Load dropdowns (graceful fallback)
     These endpoints are optional; if they don't exist we allow manual input.
     --------------------------- */
  useEffect(() => {
    let mounted = true;

    async function fetchSelects() {
      const list = [
        { path: "/api/apis/categories", setter: setCategories, labelKey: "category_name" },
        { path: "/api/apis/breeds", setter: setBreeds, labelKey: "breed_name" },
        { path: "/api/apis/milkcapacities", setter: setMilkcapacities, labelKey: "capacity" },
      ];

      for (const item of list) {
        try {
          const res = await fetch(item.path, { credentials: "include" });
          if (!res.ok) continue;
          const data = await res.json();
          if (!mounted || !Array.isArray(data)) continue;

          const mapped = data.map((d: any) => ({
            id: d.id,
            label: item.labelKey === "capacity" ? String(d.capacity) : d[item.labelKey],
          })) as SelectItem[];

          item.setter(mapped);
        } catch (err) {
          // ignore: endpoint may not exist in early stages
          console.warn("Could not fetch", item.path, err);
        }
      }
    }

    fetchSelects();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------------
     Helpers & Validation
     --------------------------- */
  function resetForm() {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setCategoryId("");
    setBreedId("");
    setMilkCapacityId("");
  }

  function validate(): string | null {
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";
    if (!price.trim()) return "Price is required.";
    const p = Number(price);
    if (Number.isNaN(p) || p < 0) return "Enter a valid non-negative price.";
    if (!imageUrl.trim()) return "Image URL is required.";
    return null;
  }

  /* ---------------------------
     Submit handler
     --------------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    const vErr = validate();
    if (vErr) {
      setSubmitError(vErr);
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price).toFixed(2),
      image: imageUrl.trim(),
      categoryId: categoryId === "" ? null : Number(categoryId),
      breedId: breedId === "" ? null : Number(breedId),
      milk_capacityId: milkCapacityId === "" ? null : Number(milkCapacityId),
    };

    try {
      const res = await fetch("/api/apis/admin/catalog-product", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data?.message || "Failed to create product.");
      } else {
        setSuccessMessage("Catalog product created.");
        resetForm();
        // short delay to show success then navigate back to admin
        setTimeout(() => router.push("/admin"), 700);
      }
    } catch (err) {
      console.error("create product error", err);
      setSubmitError("Network error while creating product.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------------------
     Simple image preview safe handler
     --------------------------- */
  const [imageBroken, setImageBroken] = useState(false);
  useEffect(() => {
    setImageBroken(false);
  }, [imageUrl]);

  /* ---------------------------
     Render
     --------------------------- */
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse h-8 w-8 bg-gray-300 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-red-600">Auth error</h2>
          <p className="mt-2 text-sm text-gray-700">{authError}</p>
          <div className="mt-4">
            <button
              onClick={() => router.replace("/signin")}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Create Catalog Product</h1>
              <p className="text-sm text-gray-500 mt-1">
                This product frame is created by admin. Sellers will list product items against it.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-800">{user?.name || user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Create catalog product form">
            {/* Title + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-gray-400 text-xs">(required)</span>
                </label>
                <input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gir Cow - High Yield Frame"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-gray-400 text-xs">(required)</span>
                </label>
                <input
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1000.00"
                  inputMode="decimal"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 text-xs">(required)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write clear instructions for sellers..."
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
              />
            </div>

            {/* selects */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>

                {categories.length > 0 ? (
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                  >
                    <option value="">Choose (optional)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="category"
                    placeholder="Category id (optional)"
                    value={categoryId === "" ? "" : String(categoryId)}
                    onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                  />
                )}
              </div>

              {/* Breed */}
              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                  Breed
                </label>

                {breeds.length > 0 ? (
                  <select
                    id="breed"
                    value={breedId}
                    onChange={(e) => setBreedId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                  >
                    <option value="">Choose (optional)</option>
                    {breeds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="breed"
                    placeholder="Breed id (optional)"
                    value={breedId === "" ? "" : String(breedId)}
                    onChange={(e) => setBreedId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                  />
                )}
              </div>

              {/* Milk capacity */}
              <div>
                <label htmlFor="milk" className="block text-sm font-medium text-gray-700 mb-1">
                  Milk capacity
                </label>

                {milkcapacities.length > 0 ? (
                  <select
                    id="milk"
                    value={milkCapacityId}
                    onChange={(e) => setMilkCapacityId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                  >
                    <option value="">Choose (optional)</option>
                    {milkcapacities.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="milk"
                    placeholder="Milk capacity id (optional)"
                    value={milkCapacityId === "" ? "" : String(milkCapacityId)}
                    onChange={(e) => setMilkCapacityId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
                  />
                )}
              </div>
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL <span className="text-gray-400 text-xs">(required)</span>
              </label>
              <input
                id="image"
                name="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black text-sm"
              />
              {imageUrl && !imageBroken ? (
                <div className="mt-3 w-full rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full object-cover h-48 sm:h-40"
                    onError={() => setImageBroken(true)}
                  />
                </div>
              ) : null}
              {imageBroken && (
                <p className="mt-2 text-sm text-red-600">Image could not be loaded — check URL or upload images via admin tools.</p>
              )}
            </div>

            {/* submit */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex-1">
                {submitError && <p className="text-sm text-red-600 mb-2">{submitError}</p>}
                {successMessage && <p className="text-sm text-green-600 mb-2">{successMessage}</p>}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-sm text-white ${submitting ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"} transition`}
                >
                  {submitting ? "Creating..." : "Create Product"}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">Fields marked required must be provided. Price stored as decimal (e.g. 1000.00)</p>
          </form>
        </div>
      </div>
    </main>
  );
}
