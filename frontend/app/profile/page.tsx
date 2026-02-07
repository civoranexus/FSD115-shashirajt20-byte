"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/signin");
          return;
        }

        const data = await res.json();
        const role = data?.user?.role;

        if (role === "ADMIN") router.push("/admin/profile");
        else if (role === "SELLER") router.push("/seller/profile");
        else router.push("/buyer/profile");
      } catch {
        router.push("/signin");
      }
    }

    load();
  }, [router]);

  return <div className="p-6">Loading profile…</div>;
}
