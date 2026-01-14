'use client'
import { useEffect } from "react"
import checkAuther from "../utils/checkUser"
import { useRouter } from "next/navigation";

export default function PaymentPage(){
    const router = useRouter();
    useEffect(()=>{
        async function verify(){
            const user = await checkAuther();
            if(!user){
                router.push("/signin");
            }
        }
        verify();
    },[]);
    return (
        <div>
            <h1>Payment Page !</h1>
        </div>
    )
}