// app/profile/edit/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function EditProfilePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone_no, setPhone] = useState("");
//   const [avatar, setAvatar] = useState("");

//   const [addresses, setAddresses] = useState([]);
//   const [newAddress, setNewAddress] = useState({ address_line1: "", city: "", region: "", postal_code: "" });

//   async function load() {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       if (!res.ok) { router.push("/signin"); return; }
//       const data = await res.json();
//       setName(data.user?.name || "");
//       setEmail(data.user?.email || "");
//       setPhone(data.user?.phone_no || "");
//       setAvatar(data.user?.avatar || "");

//       // load addresses (api below)
//       const aRes = await fetch("/api/apis/addresses", { credentials: "include" });
//       if (aRes.ok) {
//         const ad = await aRes.json();
//         setAddresses(ad.addresses || []);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally { setLoading(false); }
//   }

//   useEffect(() => { load(); }, []);

//   async function saveProfile(e) {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const res = await fetch("/api/auth/update", { // make sure you have update endpoint
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, phone_no, avatar })
//       });
//       const data = await res.json();
//       if (!res.ok) { alert(data?.message || "Update failed"); return; }
//       alert("Profile saved");
//       router.push("/profile");
//     } catch (e) { console.error(e); alert("Network error"); }
//     finally { setSaving(false); }
//   }

//   async function addAddress() {
//     try {
//       const res = await fetch("/api/apis/addresses", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newAddress)
//       });
//       const data = await res.json();
//       if (!res.ok) { alert(data?.message || "Add address failed"); return; }
//       setAddresses(prev => [data.address, ...prev]);
//       setNewAddress({ address_line1: "", city: "", region: "", postal_code: "" });
//     } catch (e) { console.error(e); alert("Network error"); }
//   }

//   async function removeAddress(id) {
//     if (!confirm("Delete this address?")) return;
//     try {
//       const res = await fetch(`/api/apis/addresses/${id}`, { method: "DELETE", credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) { alert(data?.message || "Delete failed"); return; }
//       setAddresses(prev => prev.filter(a => a.id !== id));
//     } catch (e) { console.error(e); alert("Network error"); }
//   }

//   if (loading) return <div className="p-4">Loading…</div>;

//   return (
//     <main className="min-h-screen p-4 bg-slate-50">
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//         <h1 className="text-2xl font-bold mb-4">Edit profile</h1>

//         <form onSubmit={saveProfile} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-600">Full name</label>
//             <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">Email (readonly)</label>
//             <input value={email} readOnly className="w-full border rounded px-3 py-2 bg-gray-50" />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">Phone</label>
//             <input value={phone_no} onChange={e => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">Avatar (image URL)</label>
//             <input value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full border rounded px-3 py-2" />
//           </div>

//           <div className="flex gap-2">
//             <button className="px-4 py-2 bg-indigo-600 text-white rounded" type="submit">Save</button>
//             <button type="button" onClick={() => router.push("/profile")} className="px-4 py-2 border rounded">Cancel</button>
//           </div>
//         </form>

//         <hr className="my-6" />

//         <h2 className="text-lg font-semibold mb-2">Addresses</h2>

//         <div className="space-y-2">
//           {addresses.map(a => (
//             <div key={a.id} className="p-3 border rounded flex justify-between bg-slate-50">
//               <div>
//                 <div className="font-medium">{a.address_line1}</div>
//                 <div className="text-sm text-gray-500">{a.city}, {a.region} - {a.postal_code}</div>
//               </div>
//               <div>
//                 <button onClick={() => removeAddress(a.id)} className="px-3 py-1 text-red-600">Remove</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-4 bg-white p-3 rounded border">
//           <h3 className="text-sm font-semibold mb-2">Add address</h3>
//           <input value={newAddress.address_line1} onChange={e => setNewAddress(s => ({...s, address_line1: e.target.value}))} placeholder="Address line 1" className="w-full border rounded px-3 py-2 mb-2" />
//           <input value={newAddress.city} onChange={e => setNewAddress(s => ({...s, city: e.target.value}))} placeholder="City" className="w-full border rounded px-3 py-2 mb-2" />
//           <input value={newAddress.region} onChange={e => setNewAddress(s => ({...s, region: e.target.value}))} placeholder="Region / State" className="w-full border rounded px-3 py-2 mb-2" />
//           <input value={newAddress.postal_code} onChange={e => setNewAddress(s => ({...s, postal_code: e.target.value}))} placeholder="Postal code" className="w-full border rounded px-3 py-2 mb-2" />
//           <div className="flex gap-2">
//             <button onClick={addAddress} className="px-4 py-2 bg-green-600 text-white rounded">Add address</button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_no, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({ address_line1: "", city: "", region: "", postal_code: "" });

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) { router.push("/signin"); return; }
      const data = await res.json();
      setName(data.user?.name || "");
      setEmail(data.user?.email || "");
      setPhone(data.user?.phone_no || "");
      setAvatar(data.user?.avatar || "");

      const aRes = await fetch("/api/ad/addresses", { credentials: "include" });
      if (aRes.ok) {
        const ad = await aRes.json();
        setAddresses(ad.addresses || []);
      }
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone_no, avatar })
      });
      const data = await res.json();
      if (!res.ok) { alert(data?.message || "Update failed"); return; }
      alert("Profile saved");
      router.push("/profile");
    } catch (e) { console.error(e); alert("Network error"); }
    finally { setSaving(false); }
  }

  async function addAddress() {
    try {
      const res = await fetch("/api/ad/addresses", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      if (!res.ok) { alert(data?.message || "Add address failed"); return; }
      setAddresses(prev => [data.address, ...prev]);
      setNewAddress({ address_line1: "", city: "", region: "", postal_code: "" });
    } catch (e) { console.error(e); alert("Network error"); }
  }

  async function removeAddress(id: string) {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/ad/addresses/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) { alert(data?.message || "Delete failed"); return; }
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (e) { console.error(e); alert("Network error"); }
  }

  if (loading) return <div className="p-4 text-gray-800 font-medium">Loading…</div>;

  return (
    <main className="min-h-screen p-4 bg-slate-50 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Edit profile</h1>

        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 bg-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Email (readonly)</label>
            <input value={email} readOnly className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Phone</label>
            <input value={phone_no} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 bg-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Avatar (image URL)</label>
            <input value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 bg-white" />
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" disabled={saving} type="submit">{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => router.push("/profile")} className="px-4 py-2 border border-gray-400 rounded text-gray-800">Cancel</button>
          </div>
        </form>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold mb-2 text-gray-900">Addresses</h2>

        <div className="space-y-2">
          {addresses.map(a => (
            <div key={a.id} className="p-3 border border-gray-300 rounded flex justify-between bg-gray-50 text-gray-900">
              <div>
                <div className="font-medium">{a.address_line1}</div>
                <div className="text-sm text-gray-700">{a.city}, {a.region} - {a.postal_code}</div>
              </div>
              <div>
                <button onClick={() => removeAddress(a.id)} className="px-3 py-1 text-red-700 font-medium">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-white p-3 rounded border border-gray-300">
          <h3 className="text-sm font-semibold mb-2 text-gray-900">Add address</h3>
          <input value={newAddress.address_line1} onChange={e => setNewAddress(s => ({...s, address_line1: e.target.value}))} placeholder="Address line 1" className="w-full border border-gray-400 rounded px-3 py-2 mb-2 text-gray-900" />
          <input value={newAddress.city} onChange={e => setNewAddress(s => ({...s, city: e.target.value}))} placeholder="City" className="w-full border border-gray-400 rounded px-3 py-2 mb-2 text-gray-900" />
          <input value={newAddress.region} onChange={e => setNewAddress(s => ({...s, region: e.target.value}))} placeholder="Region / State" className="w-full border border-gray-400 rounded px-3 py-2 mb-2 text-gray-900" />
          <input value={newAddress.postal_code} onChange={e => setNewAddress(s => ({...s, postal_code: e.target.value}))} placeholder="Postal code" className="w-full border border-gray-400 rounded px-3 py-2 mb-2 text-gray-900" />
          <div className="flex gap-2">
            <button onClick={addAddress} className="px-4 py-2 bg-green-600 text-white rounded">Add address</button>
          </div>
        </div>
      </div>
    </main>
  );
}
