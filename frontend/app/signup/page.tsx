'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await res.json();
    if(data.success){
        router.push("/login");
    }else{
        setError(data.message);
    }
    console.log(data);
    console.log(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
      <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
      <p>{error}</p>
      <button>Signup</button>
    </form>
  );
}
