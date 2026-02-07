"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  async function fetchAuth() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    if (!res.ok) {
      setUser(null);   // ✅ correct behavior on 401
      return;
    }

    const data = await res.json();
    setUser(data?.user || null);
  } catch {
    setUser(null);
  }
}

  async function checkRole() {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    if (res.status === 401) {
      router.replace("/signin");
      return false;
    }

    const data = await res.json();

    if (data?.user?.role !== "ADMIN") {
      router.replace("/");
      return false;
    }

    return true;
  }

  useEffect(() => {
    checkRole();
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .finally(() => setLoading(false));
  }, []);
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Logout failed", res.status);
        alert("Logout failed. Try again.");
        return;
      }
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("logout error", err);
      alert("Network error");
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-gray-700 font-medium animate-pulse">
          Loading profile…
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-xl shadow text-gray-700">
          Failed to load profile
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Name + role */}
              <div>
                <h1 className="text-2xl font-semibold">{user.name}</h1>
                <p className="text-indigo-100 text-sm">
                  {user.role} • System Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Info rows */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <p className="font-semibold text-gray-800 break-all">
                  {user.email}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className="font-semibold text-indigo-700">{user.role}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Access Level</p>
                <p className="font-semibold text-green-600">
                  Full System Access
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium">
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Admin panel • Secure access enabled
        </p>
      </div>
    </main>
  );
}

