"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

      // 🚫 role protection
      if (data.user.role !== "SELLER") {
        router.replace("/");
        return;
      }

      setUser(data.user);
    } catch (e) {
      console.error("seller auth error", e);
      router.replace("/signin");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSeller();
  }, []);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("logout error", e);
    } finally {
      router.replace("/signin");
    }
  }

  if (loading) {
    return <div className="p-6">Checking seller access…</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Seller Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome, {user?.name}
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <button
            onClick={() => router.push("/seller/listings")}
            className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            My Listings
          </button>

          <button
            onClick={() => router.push("/seller/orders")}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            My Orders
          </button>

          <button
            onClick={() => router.push("/seller/createListing")}
            className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Add New Listing
          </button>

          <button
            onClick={logout}
            className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
