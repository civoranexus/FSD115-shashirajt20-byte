// app/page.tsx
// "use client";

// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <header className="bg-white shadow">
//         <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
//           <div className="flex items-center gap-3">
//             <img src="/assets/logo.png" alt="logo" className="h-10 w-10 object-contain" />
//             <div>
//               <h1 className="text-lg font-bold">Your App Name</h1>
//               <p className="text-xs text-gray-500">Local livestock & supplies marketplace</p>
//             </div>
//           </div>
//           <nav className="flex gap-3 items-center">
//             <button onClick={() => router.push('/products')} className="px-3 py-2 text-sm rounded bg-indigo-600 text-white">Explore</button>
//             <button onClick={() => router.push('/signin')} className="px-3 py-2 text-sm rounded border">Sign in</button>
//           </nav>
//         </div>
//       </header>

//       <section className="max-w-6xl mx-auto p-6">
//         {/* Hero */}
//         <div className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
//           <div className="flex-1">
//             <h2 className="text-3xl font-bold mb-2">Buy & Sell livestock near you</h2>
//             <p className="text-sm opacity-90 mb-4">Search breeds, compare prices, and connect with trusted sellers.</p>

//             <div className="flex gap-2">
//               <input placeholder="Search cows, breeds, accessories..." className="flex-1 px-4 py-2 rounded-lg text-black" />
//               <button onClick={() => router.push('/products')} className="px-4 py-2 bg-white rounded-lg text-indigo-600 font-semibold">Search</button>
//             </div>
//           </div>

//           <div className="w-56">
//             <img src="/assets/hero-cow.png" alt="cow" className="w-full h-auto object-cover" />
//           </div>
//         </div>

//         {/* Categories (simple) */}
//         <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//           {['Cattle','Buffalo','Cow','Accessories'].map((c) => (
//             <div key={c} className="bg-white p-4 rounded-lg shadow flex items-center gap-3 cursor-pointer" onClick={() => router.push('/products')}>
//               <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center">🐄</div>
//               <div>
//                 <div className="font-medium">{c}</div>
//                 <div className="text-xs text-gray-400">Explore</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Featured / Quick links */}
//         <div className="mt-8 grid md:grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow">Featured listings component here</div>
//           <div className="bg-white p-4 rounded-lg shadow">How it works / guides</div>
//           <div className="bg-white p-4 rounded-lg shadow">Resources / contact</div>
//         </div>
//       </section>

//       <footer className="mt-12 bg-white border-t">
//         <div className="max-w-6xl mx-auto p-6 text-sm text-gray-500">© {new Date().getFullYear()} Your App — made for internship</div>
//       </footer>
//     </main>
//   );
// }

// app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* logo: ensure /public/logo.svg exists */}
            <img src="/logos/Long_logo.png" alt="Civora logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">Civora Livestock Exchange</h1>
              <p className="text-xs sm:text-sm text-slate-600">Local livestock & supplies marketplace</p>
            </div>
          </div>

          <nav className="flex gap-3 items-center">
            <button
              onClick={() => router.push("/products")}
              className="px-3 py-2 text-sm rounded-md font-semibold"
              style={{ background: "#1B9AAA", color: "#ffffff" }} /* sky blue */ 
              aria-label="Explore products"
            >
              Explore
            </button>
            <button
              onClick={() => router.push("/signin")}
              className="px-3 py-2 text-sm rounded-md font-medium border"
              style={{ borderColor: "#012136", color: "#012136" }} /* teal navy */
              aria-label="Sign in"
            >
              Sign in
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto p-6">
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
          style={{
            background: "linear-gradient(90deg, #012136 0%, #1B9AAA 100%)",
            color: "#ffffff",
          }}
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-2">
              Buy & Sell livestock near you
            </h2>
            <p className="text-sm sm:text-base opacity-95 mb-4">
              Search breeds, compare prices, and connect with trusted local sellers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Search cows, breeds, accessories..."
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-600 focus:outline-none focus:ring-2"
                aria-label="Search"
              />
              <button
                onClick={() => router.push("/products")}
                className="px-4 py-3 rounded-lg font-semibold"
                style={{ background: "#E0F7FA", color: "#012136" }} /* light sky bg with dark text */
                aria-label="Search products"
              >
                Search
              </button>
            </div>
          </div>

          {/* Hero image: hidden on small screens for better mobile layout */}
          <div className="w-full md:w-56 lg:w-72 hidden sm:block">
            <img
              src="/assets/11428894.png"
              alt="cow hero"
              className="w-full h-auto object-cover rounded-md shadow-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Cattle", "Buffalo", "Cow", "Accessories"].map((c) => (
            <button
              key={c}
              onClick={() => router.push("/products")}
              className="bg-white p-4 rounded-lg shadow flex items-center gap-3 cursor-pointer text-left hover:shadow-md transition"
              aria-label={`Explore ${c}`}
            >
              <div
                className="w-12 h-12 rounded flex items-center justify-center text-xl"
                style={{ background: "#E0F7FA" }} /* light sky bg tile */
              >
                🐄
              </div>
              <div>
                <div className="font-semibold text-slate-800">{c}</div>
                <div className="text-xs text-slate-500">Explore</div>
              </div>
            </button>
          ))}
        </div>

        {/* Featured / Quick links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-slate-800">Featured listings component here</div>
          <div className="bg-white p-4 rounded-lg shadow text-slate-800">How it works / guides</div>
          <div className="bg-white p-4 rounded-lg shadow text-slate-800">Resources / contact</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t">
        <div className="max-w-6xl mx-auto p-6 text-sm text-slate-600">
          © {new Date().getFullYear()} Civora Livestock Exchange — made for internship
        </div>
      </footer>
    </main>
  );
}
