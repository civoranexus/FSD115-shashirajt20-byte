// 'use client'
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const router = useRouter();
//   async function handleSubmit(e){
//     e.preventDefault();
//     const res = await fetch("/api/auth/signin",{
//         method : "POST",
//         headers : {"Content-Type" : "application/json"},
//         body : JSON.stringify({

//             email, 
//             password
//         }),
//         credentials: "include"
//     });
//     const data = await res.json();
//     if(data.success){
//         router.push("/");
//     }else{
//         setError(data.message);
//     }
//     console.log(data);
//     console.log(email, password);
//   };
//   return(
//     <form onSubmit={handleSubmit}>
//       <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
//       <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
//       <button>Login</button>
//       <p>{error}</p>
//     </form>
//   )
// }


'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      router.push("/");
    } else {
      setError(data.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Sign in to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Login
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
