// components/Header.jsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logos/logo.svg" alt="logo" className="w-12 h-12" />
                <div className="hidden sm:block">
                  <div className="text-lg font-semibold text-slate-800">Civora</div>
                  <div className="text-xs text-slate-500">Livestock Exchange</div>
                </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => router.push("/products")} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
              Marketplace
            </button>
            <button onClick={() => router.push("/seller/listings")} className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
              Sell
            </button>
          </div>

          {/* mobile menu icon */}
          <div className="md:hidden">
            <button onClick={() => router.push("/menu")} className="p-2 rounded-md border">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
