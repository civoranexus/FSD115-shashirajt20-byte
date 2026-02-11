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
      router.push("/signin");
    } else {
      setError(data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#042A6B] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        {/* <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Join us and start your journey 🚀
        </p> */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={phone_no}
            onChange={(e) => setPhone_no(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />

          <input
            type="text"
            placeholder="Profile Image URL (optional)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
            onClick={() => router.push("/signin")}
            className="text-indigo-600 cursor-pointer font-semibold hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}


// app/signup/page.tsx (or components/SignupForm.tsx) — full updated component
// 'use client';

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function SignupForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [phone_no, setPhone_no] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [unit_no, setUnit_no] = useState("");
//   const [street, setStreet] = useState("");
//   const [city, setCity] = useState("");
//   const [region, setRegion] = useState("");
//   const [postal_code, setPostal_code] = useState("");

//   const [applySeller, setApplySeller] = useState(false);
//   const [seller_bio, setSeller_bio] = useState("");

//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!/^\d{10}$/.test(phone_no)) {
//       setError("Phone number must be 10 digits");
//       setLoading(false);
//       return;
//     }

//     if (postal_code && !/^\d{4,10}$/.test(postal_code)) {
//       setError("Postal code looks invalid");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       name,
//       email,
//       phone_no,
//       avatar,
//       password,
//       address: {
//         unit_no: unit_no || null,
//         street: street || null,
//         city: city || null,
//         region: region || null,
//         postal_code: postal_code ? Number(postal_code) : null
//       },
//       applySeller,      // boolean
//       seller_bio: seller_bio || null
//     };

//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//         credentials: "include",
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (res.ok && data.success) {
//         if (applySeller) {
//           // user applied to become seller — show friendly message
//           alert("Account created — seller application submitted. Admin will review your application.");
//         } else {
//           alert("Account created successfully. Please sign in.");
//         }
//         router.push("/signin");
//       } else {
//         setError(data.message || "Something went wrong");
//       }
//     } catch (err) {
//       console.error("signup error", err);
//       setLoading(false);
//       setError("Network error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#042A6B] px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
//         <div className="flex flex-col items-center mb-6">
//           <img src="/logos/logo.svg" alt="Civora Nexus" className="w-16 h-16 mb-2" />
//           <h1 className="text-2xl font-bold text-gray-800">Civora Livestock</h1>
//           <p className="text-sm text-gray-500">Digital Cattle Marketplace</p>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//           <input type="text" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" />

//           <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" />

//           <input type="tel" placeholder="Mobile Number" value={phone_no} onChange={(e)=>setPhone_no(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" />

//           <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" />

//           <input type="text" placeholder="Profile Image URL (optional)" value={avatar} onChange={(e)=>setAvatar(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" />

//           {/* Address block */}
//           <div className="pt-2 pb-1">
//             <div className="text-sm font-medium text-gray-700 mb-2">Address (optional)</div>
//             <input type="text" placeholder="Unit / House no." value={unit_no} onChange={(e)=>setUnit_no(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
//             <input type="text" placeholder="Street / Locality" value={street} onChange={(e)=>setStreet(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
//             <div className="grid grid-cols-2 gap-2">
//               <input type="text" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} className="px-3 py-2 border rounded-lg" />
//               <input type="text" placeholder="State / Region" value={region} onChange={(e)=>setRegion(e.target.value)} className="px-3 py-2 border rounded-lg" />
//             </div>
//             <input type="text" placeholder="Postal code" value={postal_code} onChange={(e)=>setPostal_code(e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-2" />
//           </div>

//           {/* Seller application */}
//           <div className="flex items-start gap-2">
//             <input id="applySeller" type="checkbox" checked={applySeller} onChange={(e)=>setApplySeller(e.target.checked)} className="mt-1" />
//             <label htmlFor="applySeller" className="text-sm text-gray-700">
//               Apply to become a <strong>Seller</strong> (admin approval required)
//             </label>
//           </div>

//           {/* Optional seller bio when checked */}
//           {applySeller && (
//             <textarea placeholder="Tell us about your farm / business (optional)" value={seller_bio} onChange={(e)=>setSeller_bio(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg" />
//           )}

//           {error && <p className="text-red-600 text-sm text-center bg-red-100 py-2 rounded-lg">{error}</p>}

//           <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50">
//             {loading ? "Creating Account..." : "Sign Up"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-500 mt-6">
//           Already have an account?{" "}
//           <span onClick={() => router.push("/signin")} className="text-indigo-600 cursor-pointer font-semibold hover:underline">Login</span>
//         </p>
//       </div>
//     </div>
//   );
// }
