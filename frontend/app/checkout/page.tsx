// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [cart, setCart] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);

//   async function load() {
//     try {
//       const res = await fetch("/api/cartapi/cart", { credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) return;
//       setCart(data.cart);
//     } catch (e) {
//       console.error("load cart error", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   function total() {
//     if (!cart?.cartItems) return 0;
//     return cart.cartItems.reduce(
//       (s: number, it: any) =>
//         s + Number(it.productItem?.price || 0) * it.quantity,
//       0
//     );
//   }

//   // async function placeOrder() {
//   //   try {
//   //     setPlacing(true);

//   //     const res = await fetch("/api/cartapi/checkout", {
//   //       method: "POST",
//   //       credentials: "include",
//   //     });

//   //     const data = await res.json();

//   //     if (!res.ok) {
//   //       alert(data?.message || "Checkout failed");
//   //       return;
//   //     }

//   //     alert("Order placed successfully 🎉");
//   //     router.push("/orders");
//   //   } catch (e) {
//   //     console.error("checkout error", e);
//   //     alert("Network error");
//   //   } finally {
//   //     setPlacing(false);
//   //   }
//   // }

//   async function placeOrder() {
//   try {
//     setPlacing(true);

//     const res = await fetch("/api/orderapi/checkout", {
//       method: "POST",
//       credentials: "include",
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data?.message || "Checkout failed");
//       return;
//     }

//     alert("Order placed successfully 🎉");

//     // redirect to orders page
//     router.push("/orders");

//   } catch (e) {
//     console.error("checkout error", e);
//     alert("Network error");
//   } finally {
//     setPlacing(false);
//   }
// }


//   if (loading) return <div className="p-4">Loading…</div>;

//   if (!cart || cart.cartItems.length === 0)
//     return <div className="p-4">Cart empty</div>;

//   return (
//     <main className="min-h-screen bg-slate-50 p-4">
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//         <h1 className="text-2xl font-bold mb-4">Checkout</h1>

//         <div className="space-y-3">
//           {cart.cartItems.map((ci: any) => (
//             <div key={ci.id} className="flex justify-between border p-3 rounded">
//               <div>
//                 <div className="font-semibold">
//                   {ci.productItem?.product?.title}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Qty: {ci.quantity}
//                 </div>
//               </div>
//               <div className="font-semibold">
//                 ₹{Number(ci.productItem?.price) * ci.quantity}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 flex justify-between text-lg font-semibold">
//           <span>Total</span>
//           <span>₹{total().toFixed(2)}</span>
//         </div>

//         <button
//           onClick={placeOrder}
//           disabled={placing}
//           className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
//         >
//           {placing ? "Placing Order…" : "Place Order"}
//         </button>
//       </div>
//     </main>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);

//   async function load() {
//     try {
//       const res = await fetch("/api/cartapi/cart", { credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) return;
//       setCart(data.cart);
//     } catch (e) {
//       console.error("load cart error", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   function total() {
//     if (!cart?.cartItems) return 0;
//     return cart.cartItems.reduce(
//       (s, it) => s + Number(it.productItem?.price || 0) * it.quantity,
//       0
//     );
//   }

//   async function placeOrder() {
//     try {
//       setPlacing(true);

//       const res = await fetch("/api/orderapi/checkout", {
//         method: "POST",
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data?.message || "Checkout failed");
//         return;
//       }

//       alert("Order placed successfully 🎉");

//       // redirect to orders page
//       router.push("/orders");

//     } catch (e) {
//       console.error("checkout error", e);
//       alert("Network error");
//     } finally {
//       setPlacing(false);
//     }
//   }

//   if (loading) return <div className="p-4">Loading…</div>;

//   if (!cart || cart.cartItems.length === 0)
//     return <div className="p-4">Cart empty</div>;

//   return (
//     <main className="min-h-screen bg-slate-50 p-4">
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//         <h1 className="text-2xl text-gray-500 font-bold mb-4">Checkout</h1>

//         <div className="space-y-3">
//           {cart.cartItems.map((ci) => (
//             <div key={ci.id} className="flex justify-between border p-3 rounded">
//               <div>
//                 <div className="font-semibold text-gray-700">
//                   {ci.productItem?.product?.title}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Qty: {ci.quantity}
//                 </div>
//               </div>
//               <div className="font-semibold text-gray-500">
//                 ₹{Number(ci.productItem?.price) * ci.quantity}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 flex justify-between text-lg text-gray-500 font-semibold">
//           <span>Total</span>
//           <span>₹{total().toFixed(2)}</span>
//         </div>

//         <button
//           onClick={placeOrder}
//           disabled={placing}
//           className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
//         >
//           {placing ? "Placing Order…" : "Place Order"}
//         </button>
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [cart, setCart] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);

//   // 🔒 role check
//   async function checkRole() {
//     const res = await fetch("/api/auth/me", { credentials: "include" });

//     if (res.status === 401) {
//       router.replace("/signin");
//       return false;
//     }

//     const data = await res.json();

//     if (data?.user?.role !== "BUYER") {
//       router.replace("/");
//       return false;
//     }

//     return true;
//   }

//   async function load() {
//     const ok = await checkRole();
//     if (!ok) return;

//     try {
//       const res = await fetch("/api/cartapi/cart", { credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) return;
//       setCart(data.cart);
//     } catch (e) {
//       console.error("load cart error", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   function total() {
//     if (!cart?.cartItems) return 0;
//     return cart.cartItems.reduce(
//       (s: number, it: any) =>
//         s + Number(it.productItem?.price || 0) * it.quantity,
//       0
//     );
//   }

//   // async function placeOrder() {
//   //   try {
//   //     setPlacing(true);

//   //     const res = await fetch("/api/orderapi/checkout", {
//   //       method: "POST",
//   //       credentials: "include",
//   //     });

//   //     const data = await res.json();

//   //     if (!res.ok) {
//   //       alert(data?.message || "Checkout failed");
//   //       return;
//   //     }

//   //     alert("Order placed successfully 🎉");
//   //     router.push("/orders");
//   //   } catch (e) {
//   //     console.error("checkout error", e);
//   //     alert("Network error");
//   //   } finally {
//   //     setPlacing(false);
//   //   }
//   // }

// //   async function placeOrder() {
// //   try {
// //     setPlacing(true);

// //     const res = await fetch("/api/orderapi/checkout", {
// //       method: "POST",
// //       credentials: "include",
// //     });

// //     const data = await res.json();

// //     if (!res.ok) {
// //       alert(data?.message || "Checkout failed");
// //       return;
// //     }

// //     alert("Order placed successfully (Cash on Delivery) 🚚");

// //     router.push("/orders");

// //   } catch (e) {
// //     console.error("checkout error", e);
// //     alert("Network error");
// //   } finally {
// //     setPlacing(false);
// //   }
// // }



//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-100 p-4">
//         <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//           <div role="status" className="text-gray-900 font-medium">
//             Loading…
//           </div>
//         </div>
//       </div>
//     );

//   if (!cart || cart.cartItems.length === 0)
//     return (
//       <div className="min-h-screen bg-gray-100 p-4">
//         <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//           <div className="text-gray-900 font-medium">Cart empty</div>
//         </div>
//       </div>
//     );

//   return (
//     <main className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//         <h1 className="text-2xl font-bold mb-4 text-gray-900">Checkout</h1>

//         <div className="space-y-3">
//           {cart.cartItems.map((ci: any) => (
//             <div
//               key={ci.id}
//               className="flex justify-between items-center border p-3 rounded"
//             >
//               <div>
//                 <div className="font-semibold text-gray-900">
//                   {ci.productItem?.product?.title}
//                 </div>
//                 <div className="text-sm text-gray-700">Qty: {ci.quantity}</div>
//               </div>
//               <div className="font-semibold text-gray-900">
//                 ₹{(Number(ci.productItem?.price || 0) * ci.quantity).toFixed(2)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 flex justify-between text-lg font-semibold text-gray-900">
//           <span>Total</span>
//           <span>₹{total().toFixed(2)}</span>
//         </div>

//         <button
//           onClick={placeOrder}
//           disabled={placing}
//           className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
//           aria-disabled={placing}
//         >
//           {placing ? "Placing Order…" : "Place Order"}
//         </button>
//       </div>
//     </main>
//   );
// }



// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/apis/cart", { credentials: "include" });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }
      if (res.ok) setCart(data.cart);
      else setCart(null);
    } catch (e) {
      console.error("load cart error", e);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function total() {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((s, it) => s + Number(it.productItem?.price || 0) * it.quantity, 0);
  }

  async function placeOrder() {
    try {
      setPlacing(true);

      // 1) Create the order server-side (clears cart, creates Payment record)
      const res = await fetch("/orderapi/checkout", {
        method: "POST",
        credentials: "include"
      });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!res.ok) {
        alert(data?.message || "Checkout failed");
        return;
      }

      const createdOrder = data.order;
      // 2) Here you'd normally open payment gateway (Razorpay/Stripe), pass amount, order id etc.
      // For now we'll simulate: call verify-payment with mock provider and a fake paymentId.
      const fakePaymentId = `MOCKPAY_${Date.now()}`;

      const verifyRes = await fetch("/orderapi/verify-payment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder.id,
          paymentId: fakePaymentId,
          provider: "mock" // use "mock" for testing; for real set "razorpay" etc
        })
      });

      const verifyText = await verifyRes.text();
      let verifyData = null;
      try { verifyData = JSON.parse(verifyText); } catch { verifyData = null; }

      if (!verifyRes.ok) {
        alert(verifyData?.message || "Payment verification failed");
        return;
      }

      alert("Order placed and payment confirmed 🎉");
      router.push(`/orders/${createdOrder.id}`);
    } catch (e) {
      console.error("checkout error", e);
      alert("Network error");
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <div className="p-4">Loading…</div>;

  if (!cart || cart.cartItems.length === 0)
    return <div className="p-4">Cart empty</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="space-y-3">
          {cart.cartItems.map((ci: any) => (
            <div key={ci.id} className="flex justify-between border p-3 rounded">
              <div>
                <div className="font-semibold">
                  {ci.productItem?.product?.title}
                </div>
                <div className="text-sm text-gray-500">
                  Qty: {ci.quantity}
                </div>
              </div>
              <div className="font-semibold">
                ₹{(Number(ci.productItem?.price) * ci.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{total().toFixed(2)}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={placing}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
        >
          {placing ? "Placing Order…" : "Place Order"}
        </button>
      </div>
    </main>
  );
}
