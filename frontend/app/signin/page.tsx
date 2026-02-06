// 'use client'

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const router = useRouter();

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const res = await fetch("/api/auth/signin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//       credentials: "include",
//     });

//     const data = await res.json();

//     if (data.success) {
//       router.push("/");
//     } else {
//       setError(data.message);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

//         {/* Header */}
//         <h1 className="text-3xl font-bold text-center text-gray-800">
//           Welcome Back
//         </h1>
//         <p className="text-center text-gray-500 mt-2">
//           Sign in to continue
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">

//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email address"
//             required
//             className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
//           />

//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//             className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
//           />

//           {/* Error */}
//           {error && (
//             <p className="text-red-600 text-sm text-center bg-red-100 py-2 rounded-lg">
//               {error}
//             </p>
//           )}

//           {/* Button */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
//           >
//             Login
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-sm text-gray-500 mt-6">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => router.push("/signup")}
//             className="text-indigo-600 font-semibold cursor-pointer hover:underline"
//           >
//             Sign up
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // async function handleSubmit(e: any) {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const res = await fetch("/api/auth/signin", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //       credentials: "include",
  //     });

  //     const data = await res.json();

  //     if (!res.ok || !data.success) {
  //       setError(data?.message || "Login failed");
  //       return;
  //     }

  //     // after login → redirect to home
  //     router.push("/");
  //   } catch (err) {
  //     console.error("login error", err);
  //     setError("Network error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.message || "Login failed");
      return;
    }

    // 🔥 fetch user role
    const meRes = await fetch("/api/auth/me", {
      credentials: "include",
    });

    const me = await meRes.json();

    const role = me?.user?.role;

    // 🔥 AUTO REDIRECT
    if (role === "ADMIN") router.replace("/admin");
    else if (role === "SELLER") router.replace("/seller");
    else router.replace("/products"); // BUYER
  } catch (err) {
    console.error("login error", err);
    alert("Network error");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logos/logo.svg"
            alt="Civora Nexus"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Civora Livestock
          </h1>
          <p className="text-sm text-gray-500">
            Digital Cattle Marketplace
          </p>
        </div>

        {/* Title */}
        {/* <h2 className="text-xl font-semibold text-center text-gray-700">
          Welcome Back 👋
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Sign in to continue
        </p> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}
