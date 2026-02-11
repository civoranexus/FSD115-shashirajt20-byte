"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // 🔒 role check
  async function checkRole() {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    if (res.status === 401) {
      router.replace("/signin");
      return false;
    }

    const data = await res.json();

    if (data?.user?.role !== "BUYER") {
      router.replace("/");
      return false;
    }

    return true;
  }

  async function load() {
    const ok = await checkRole();
    if (!ok) return;

    try {
      const res = await fetch("/api/cartapi/cart", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) return;
      setCart(data.cart);
    } catch (e) {
      console.error("load cart error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function total() {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce(
      (s: number, it: any) =>
        s + Number(it.productItem?.price || 0) * it.quantity,
      0
    );
  }

  // async function placeOrder() {
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
  //     router.push("/orders");
  //   } catch (e) {
  //     console.error("checkout error", e);
  //     alert("Network error");
  //   } finally {
  //     setPlacing(false);
  //   }
  // }

  async function placeOrder() {
  try {
    setPlacing(true);

    const res = await fetch("/api/orderapi/checkout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.message || "Checkout failed");
      return;
    }

    alert("Order placed successfully (Cash on Delivery) 🚚");

    router.push("/orders");

  } catch (e) {
    console.error("checkout error", e);
    alert("Network error");
  } finally {
    setPlacing(false);
  }
}



  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <div role="status" className="text-gray-900 font-medium">
            Loading…
          </div>
        </div>
      </div>
    );

  if (!cart || cart.cartItems.length === 0)
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <div className="text-gray-900 font-medium">Cart empty</div>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Checkout</h1>

        <div className="space-y-3">
          {cart.cartItems.map((ci: any) => (
            <div
              key={ci.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <div className="font-semibold text-gray-900">
                  {ci.productItem?.product?.title}
                </div>
                <div className="text-sm text-gray-700">Qty: {ci.quantity}</div>
              </div>
              <div className="font-semibold text-gray-900">
                ₹{(Number(ci.productItem?.price || 0) * ci.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>₹{total().toFixed(2)}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={placing}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-disabled={placing}
        >
          {placing ? "Placing Order…" : "Place Order"}
        </button>
      </div>
    </main>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const [cart, setCart] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);

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
//     try {
//       const res = await fetch("/api/cartapi/cart", { credentials: "include" });
//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch { data = null; }

//       if (res.ok) setCart(data.cart);
//       else setCart(null);
//     } catch (e) {
//       console.error("load cart error", e);
//       setCart(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     checkRole();
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

//   // load external script (Razorpay)
//   function loadScript(src: string) {
//     return new Promise<boolean>((resolve) => {
//       // If already loaded
//       if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   }

//   async function placeOrder() {
//     try {
//       setPlacing(true);

//       const res = await fetch("/api/orderapi/checkout", {
//         method: "POST",
//         credentials: "include",
//       });

//       if (res.status === 401) {
//         router.replace("/signin");
//         return;
//       }

//       const text = await res.text();
//       let data = null;
//       try { data = JSON.parse(text); } catch { data = null; }

//       if (!res.ok) {
//         alert(data?.message || "Checkout failed");
//         return;
//       }

//       const createdOrder = data.order;
//       if (!createdOrder?.id) {
//         alert("Order creation failed");
//         return;
//       }

//       const createPayRes = await fetch("/api/paymentapi/create-order", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId: createdOrder.id }),
//       });

//       if (createPayRes.status === 401) {
//         router.replace("/signin");
//         return;
//       }

//       const createPayText = await createPayRes.text();
//       let createPayData = null;
//       try { createPayData = JSON.parse(createPayText); } catch { createPayData = null; }

//       if (!createPayRes.ok) {
//         alert(createPayData?.message || "Payment initialization failed");
//         return;
//       }

//       const { razorpayOrder, key } = createPayData;
//       if (!razorpayOrder || !key) {
//         alert("Invalid payment response");
//         return;
//       }

//       // 3) Load Razorpay script
//       const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
//       if (!ok) {
//         alert("Failed to load payment gateway. Please try again.");
//         return;
//       }

//       // 4) Open Razorpay checkout
//       const options: any = {
//         key: key, // razorpay key id returned by server
//         amount: razorpayOrder.amount, // in paise
//         currency: razorpayOrder.currency || "INR",
//         name: "Civora",
//         description: `Order #${createdOrder.id}`,
//         order_id: razorpayOrder.id,
//         handler: async function (resp: any) {
//           // resp contains razorpay_payment_id, razorpay_order_id, razorpay_signature
//           try {
//             // Verify server-side
//             const verifyRes = await fetch("/api/paymentapi/verify", {
//               method: "POST",
//               credentials: "include",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_order_id: resp.razorpay_order_id,
//                 razorpay_payment_id: resp.razorpay_payment_id,
//                 razorpay_signature: resp.razorpay_signature,
//                 orderId: createdOrder.id,
//               }),
//             });

//             const verifyText = await verifyRes.text();
//             let verifyData = null;
//             try { verifyData = JSON.parse(verifyText); } catch { verifyData = null; }

//             if (!verifyRes.ok) {
//               alert(verifyData?.message || "Payment verification failed");
//               return;
//             }

//             // Payment verified & order updated on server
//             alert("Payment successful 🎉");

//             // Optionally call your server-side success handler endpoint if needed:
//             // await fetch(`/api/paymentapi/success/${createdOrder.id}`, { method: "POST", credentials: "include" });

//             router.push(`/orders/${createdOrder.id}`);
//           } catch (err) {
//             console.error("verify error", err);
//             alert("Payment verification network error");
//           }
//         },
//         // prefill (optional)
//         prefill: {
//           name: undefined,
//           email: undefined,
//           contact: undefined,
//         },
//         notes: {
//           orderId: String(createdOrder.id),
//         },
//         theme: {
//           color: "#4f46e5",
//         },
//       };

//       // open razorpay
//       // @ts-ignore
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (e) {
//       console.error("checkout error", e);
//       alert("Network error");
//     } finally {
//       setPlacing(false);
//     }
//   }

//   /* ---------- Loading UI ---------- */
//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-100 p-4">
//         <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//           <div className="text-gray-900 font-medium">Loading…</div>
//         </div>
//       </div>
//     );

//   /* ---------- Empty Cart UI ---------- */
//   if (!cart || cart.cartItems.length === 0)
//     return (
//       <div className="min-h-screen bg-gray-100 p-4">
//         <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//           <div className="text-gray-900 font-medium">Cart empty</div>
//         </div>
//       </div>
//     );

//   /* ---------- Main Checkout UI ---------- */
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
//                 <div className="text-sm text-gray-700">
//                   Qty: {ci.quantity}
//                 </div>
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
//           className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg
//                      hover:bg-indigo-700 focus:outline-none focus:ring-4
//                      focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
//         >
//           {placing ? "Placing Order…" : "Place Order"}
//         </button>
//       </div>
//     </main>
//   );
// }