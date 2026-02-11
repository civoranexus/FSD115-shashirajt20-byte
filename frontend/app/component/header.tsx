// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Header() {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [user, setUser] = useState(null);

//   const navItems = [
//     { label: "Marketplace", href: "/products" },
//     { label: "Sell", href: "/seller/listings" },
//     { label: "Orders", href: "/orders" },
//     { label: "Profile", href: "/profile" },
//   ];

//   async function fetchCartCount() {
//     try {
//       const res = await fetch("/api/cartapi/cart", { credentials: "include" });
//       // if (!res.ok) return;
//       if (res.status === 401) {
//         setCartCount(0);
//         return;
//       }
//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch { data = null; }
//       if (data?.cart?.cartItems) setCartCount(data.cart.cartItems.length || 0);
//     } catch (e) {
//       // ignore
//     }
//   }

//   async function fetchAuth() {
//     try {
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       if (res.status === 401) {
//         setUser(null);
//         return;
//       }
//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch { data = null; }
//       setUser(data?.user || null);
//     } catch (e) {
//       setUser(null);
//     }
//   }

//   useEffect(() => {
//     fetchAuth();
//     fetchCartCount();

//     function onFocus() {
//       fetchCartCount();
//       fetchAuth();
//     }
//     window.addEventListener("focus", onFocus);
//     return () => window.removeEventListener("focus", onFocus);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open]);

//   useEffect(() => {
//     function onKey(e) {
//       if (e.key === "Escape") setOpen(false);
//     }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   async function handleLogout() {
//     try {
//       const res = await fetch("/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//       if (!res.ok) {
//         console.error("Logout failed", res.status);
//         alert("Logout failed. Try again.");
//         return;
//       }
//       setUser(null);
//       setOpen(false);
//       router.push("/");
//     } catch (err) {
//       console.error("logout error", err);
//       alert("Network error");
//     }
//   }

//   return (
//     <>
//       <header className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-3">
//               <Link href="/" className="flex items-center gap-3">
//                 <img src="/logos/logo.svg" alt="logo" className="w-10 h-10" />
//                 <div className="hidden sm:block">
//                   <div className="text-lg font-semibold text-slate-800">Civora</div>
//                   <div className="text-xs text-slate-500">Livestock Exchange</div>
//                 </div>
//               </Link>
//             </div>

//             {/* Desktop nav — same items as mobile drawer */}
//             <div className="hidden md:flex items-center gap-2">
//               {navItems.map((n) => (
//                 <Link
//                   key={n.href}
//                   href={n.href}
//                   className={
//                     n.label === "Sell"
//                       ? "px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
//                       : "px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
//                   }
//                 >
//                   {n.label}
//                 </Link>
//               ))}
//             </div>

//             {/* Right actions */}
//             <div className="flex items-center gap-2">
//               {/* cart */}
//               <Link
//                 href="/cart"
//                 className="relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
//                 aria-label="View cart"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h13l-2-7M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
//                 </svg>

//                 <span className="hidden sm:inline">Cart</span>

//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>

//               {/* Desktop sign-in / profile quick link: hide Sign in if user is signed in */}
//               {user ? (
//                 <Link href="/profile" className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
//                   {/* small avatar circle with initial */}
//                   <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
//                     {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//                   </div>
//                   <span className="hidden lg:inline">{user?.name?.split(" ")[0] || "Profile"}</span>
//                 </Link>
//               ) : (
//                 <div className="hidden md:block">
//                   <Link href="/signin" className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
//                     Sign in
//                   </Link>
//                 </div>
//               )}

//               {/* mobile menu button */}
//               <div className="md:hidden">
//                 <button
//                   onClick={() => setOpen(true)}
//                   className="p-2 rounded-md border bg-white"
//                   aria-label="Open menu"
//                   aria-expanded={open}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
//                     <path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h14v2H3z" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile overlay + drawer */}
//       <div
//         className={`fixed inset-0 z-40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//         aria-hidden={!open}
//       >
//         {/* overlay */}
//         <div
//           onClick={() => setOpen(false)}
//           className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
//         />

//         {/* drawer */}
//         <aside
//           className={`absolute right-0 top-0 h-full w-72 max-w-[90%] bg-white shadow-2xl p-4 transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <img src="/logos/logo.svg" alt="logo" className="w-9 h-9" />
//               <div>
//                 <div className="text-sm font-semibold text-slate-800">Civora</div>
//                 <div className="text-xs text-slate-500">Livestock Exchange</div>
//               </div>
//             </div>
//             <button onClick={() => setOpen(false)} className="p-2 rounded-md border" aria-label="Close menu">
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 001.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586 6.707 5.293z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <nav className="space-y-2">
//             {navItems.map((n) => (
//               <Link
//                 key={n.href}
//                 href={n.href}
//                 onClick={() => setOpen(false)}
//                 className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
//               >
//                 {n.label}
//               </Link>
//             ))}

//             <Link
//               href="/cart"
//               onClick={() => setOpen(false)}
//               className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
//             >
//               <span>Cart</span>
//               {cartCount > 0 && (
//                 <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* Mobile Sign in / Profile — conditional */}
//             {user ? (
//               <Link
//                 href="/profile"
//                 onClick={() => setOpen(false)}
//                 className="block mt-2 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
//               >
//                 Profile
//               </Link>
//             ) : (
//               <Link
//                 href="/signin"
//                 onClick={() => setOpen(false)}
//                 className="block mt-2 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
//               >
//                 Sign in / Profile
//               </Link>
//             )}

//             <div className="mt-4 border-t pt-3 text-sm text-slate-500">
//               Need help? <button onClick={() => { setOpen(false); router.push("/help"); }} className="text-indigo-600 ml-1">Support</button>
//             </div>

//             {/* BOTTOM: Sign in / Logout button (shows at the bottom of the menu) */}
//             <div className="mt-6 pt-3 border-t">
//               {user ? (
//                 <button
//                   onClick={() => { handleLogout(); }}
//                   className="w-full mt-2 px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <Link
//                   href="/signin"
//                   onClick={() => setOpen(false)}
//                   className="w-full inline-block text-center mt-2 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
//                 >
//                   Sign in
//                 </Link>
//               )}
//             </div>
//           </nav>

//           <div className="mt-6 text-xs text-slate-400">
//             © {new Date().getFullYear()} Civora
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const navItems = [
    { label: "Marketplace", href: "/products" },
    { label: "Sell", href: "/seller/listings" },
    { label: "Orders", href: "/orders" },
    { label: "Profile", href: "/profile" },
  ];

  const dashboardItem =
    user?.role === "ADMIN"
      ? { label: "Admin Dashboard", href: "/admin" }
      : user?.role === "SELLER"
        ? { label: "Seller Dashboard", href: "/seller" }
        : null;

  async function fetchCartCount() {
    try {
      const res = await fetch("/api/cartapi/cart", { credentials: "include" });
      if (res.status === 401) {
        setCartCount(0);
        return;
      }
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {}
      if (data?.cart?.cartItems) setCartCount(data.cart.cartItems.length || 0);
    } catch {}
  }

  async function fetchAuth() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {}
      setUser(data?.user || null);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchAuth();
    fetchCartCount();

    const onFocus = () => {
      fetchAuth();
      fetchCartCount();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return alert("Logout failed");
      setUser(null);
      setOpen(false);
      router.push("/");
    } catch {
      alert("Network error");
    }
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logos/logo.svg" alt="logo" className="w-10 h-10" />
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    Civora
                  </div>
                  <div className="text-xs text-slate-500">
                    Livestock Exchange
                  </div>
                </div>
              </Link>
            </div>

            {/* ================= Desktop nav ================= */}
            <div className="hidden md:flex items-center gap-2">
              {dashboardItem && (
                <Link
                  href={dashboardItem.href}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {dashboardItem.label}
                </Link>
              )}

              {/* existing buttons untouched */}
              {navItems.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={
                    n.label === "Sell"
                      ? "px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                      : "px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  }
                >
                  {n.label}
                </Link>
              ))}
            </div>

            {/* ================= Right actions ================= */}
            <div className="flex items-center gap-2">
              {/* cart */}
              <Link
                href="/cart"
                className="relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs text-white bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* profile/signin unchanged */}
              {user ? (
                <Link
                  href="/profile"
                  className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              ) : (
                <div className="hidden md:block">
                  <Link
                    href="/signin"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sign in
                  </Link>
                </div>
              )}

              {/* mobile menu */}
              {/* <div className="md:hidden">
                <button onClick={() => setOpen(true)} className="p-2 rounded-md border bg-white">☰</button>
              </div> */}
              <div className="md:hidden">
                <button
                  onClick={() => setOpen(true)}
                  className="p-2 rounded-md border bg-white"
                  aria-label="Open menu"
                  aria-expanded={open}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-slate-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h14v2H3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />

        {/* drawer */}
        <aside
          className={`absolute right-0 top-0 h-full w-72 max-w-[90%] bg-white shadow-2xl p-4 transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="/logos/logo.svg" alt="logo" className="w-9 h-9" />
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Civora
                </div>
                <div className="text-xs text-slate-500">Livestock Exchange</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-md border"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 001.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586 6.707 5.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                {n.label}
              </Link>
            ))}

            {/* Admin / Seller Dashboard button */}
            {(user?.role === "ADMIN" || user?.role === "SELLER") && (
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/seller"}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                {user.role === "ADMIN" ? "Admin Dashboard" : "Seller Dashboard"}
              </Link>
            )}

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Sign in / Profile — conditional */}
            {user ? (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block mt-2 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="block mt-2 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign in / Profile
              </Link>
            )}

            <div className="mt-4 border-t pt-3 text-sm text-slate-500">
              Need help?{" "}
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/help");
                }}
                className="text-indigo-600 ml-1"
              >
                Support
              </button>
            </div>

            {/* BOTTOM: Sign in / Logout button (shows at the bottom of the menu) */}
            <div className="mt-6 pt-3 border-t">
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="w-full mt-2 px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="w-full inline-block text-center mt-2 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>

          <div className="mt-6 text-xs text-slate-400">
            © {new Date().getFullYear()} Civora
          </div>
        </aside>
      </div>
    </>
  );
}
