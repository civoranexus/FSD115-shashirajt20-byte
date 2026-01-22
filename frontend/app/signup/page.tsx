// 'use client'
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function SignupForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [phone_no, setPhone_no] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [error, setError] = useState("");

//   const router = useRouter();
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, phone_no, avatar, password }),
//       credentials: "include"
//     });
    
//     const data = await res.json();
//     if(data.success){
//         router.push("/login");
//     }else{
//         setError(data.message);
//     }
//     console.log(data);
//     console.log(name, email, password);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
//       <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
//       <input value={phone_no} onChange={(e)=>setPhone_no(e.target.value)} placeholder="Mob No."/>
//       <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
//       <input value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="Upload your profile photo"/>
//       <p>{error}</p>
//       <button>Signup</button>
//     </form>
//   );
// }


'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone_no, setPhone_no] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone_no, avatar, password }),
      credentials: "include",
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push("/login");
    } else {
      setError(data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Join us and start your journey 🚀
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={phone_no}
            onChange={(e) => setPhone_no(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Profile Image URL (optional)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-indigo-600 cursor-pointer font-semibold hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
