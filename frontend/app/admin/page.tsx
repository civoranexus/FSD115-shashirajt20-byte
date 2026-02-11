"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "USER" | "SELLER" | "ADMIN";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export default function AdminPage(){
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMe() {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          if (mounted) router.replace("/signin");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          if (mounted) {
            setError(data?.message || "Failed to fetch user");
            router.replace("/");
          }
          return;
        }

        if (data?.user) {
          const u: User = data.user as User;

          if (u.role !== "ADMIN") {
            router.replace("/");
            return;
          }

          if (mounted) {
            setUser(u);
            setError(null);
          }
        } else {
          router.replace("/signin");
        }
      } catch (err) {
        console.error("fetch /api/auth/me error", err);
        if (mounted) {
          setError("Network error while verifying authentication");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMe();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("logout error", e);
    } finally {
      router.replace("/signin");
    }
  }

  function goTo(path: string) {
    router.push(path);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse h-8 w-8 bg-gray-300 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-sm text-gray-700">{error}</p>
          <div className="mt-4 flex gap-2">
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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {/* Header */}
<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
  <div>
    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
    <p className="text-sm text-gray-500">
      Welcome, <span className="font-medium">{user?.name || user?.email}</span>
    </p>
  </div>

  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
    <button
      onClick={() => goTo("/admin/createProduct")}
      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
    >
      Create Catalog Product
    </button>

    <button
      onClick={() => goTo("/admin/approveSellers")}
      className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
    >
      Approve Sellers
    </button>

    {/* ✅ NEW */}
    <button
      onClick={() => goTo("/admin/pendingListings")}
      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
    >
      Pending Listings
    </button>

    <button
      onClick={() => goTo("/admin/users")}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
    >
      Users
    </button>

    <button
      onClick={() => goTo("/admin/orders")}
      className="px-4 py-2 bg-slate-600 text-white rounded-lg shadow hover:bg-slate-700 transition"
    >
      Orders
    </button>

    <button
      onClick={handleSignOut}
      className="px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
    >
      Sign out
    </button>
  </div>
</header>

        {/* <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome, <span className="font-medium">{user?.name || user?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => goTo("/admin/createProduct")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Create Catalog Product
            </button>

            <button
              onClick={() => goTo("/admin/approveSellers")}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
            >
              Approve Sellers
            </button>

            <button
              onClick={() => goTo("/admin/users")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Users
            </button>

            <button
              onClick={() => goTo("/admin/orders")}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg shadow hover:bg-slate-700 transition"
            >
              Orders
            </button>

            <button
              onClick={handleSignOut}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Sign out
            </button>
          </div>
        </header> */}

        {/* Quick stats / actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Total Users</h3>
            <p className="text-2xl font-semibold text-gray-800">—</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Pending Seller Requests</h3>
            <p className="text-2xl font-semibold text-gray-800">—</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Total Orders</h3>
            <p className="text-2xl font-semibold text-gray-800">—</p>
          </div>
        </section>

        {/* Admin notes / instructions */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold">Admin tips</h2>
          <ul className="mt-3 list-disc list-inside text-sm text-gray-700 space-y-2">
            <li>Use <strong>Create Catalog Product</strong> to add items visible to all sellers/buyers.</li>
            <li>Approve sellers from the <strong>Approve Sellers</strong> page after reviewing their applications.</li>
            <li>View & manage users and orders from their respective pages.</li>
            <li>If a page shows dashes (—) for counts, implement lightweight APIs to fetch counts and replace them.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
