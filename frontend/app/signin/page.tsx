'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  async function handleSubmit(e){
    e.preventDefault();
    const res = await fetch("http://localhost:8000/auth/signin",{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({

            email, 
            password
        })
    });
    const data = await res.json();
    if(data.success){
        router.refresh();
    }else{
        setError(data.message);
    }
    console.log(data);
    console.log(email, password);
  };
  return(
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
      <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
      <button>Login</button>
      <p>{error}</p>
    </form>
  )
}