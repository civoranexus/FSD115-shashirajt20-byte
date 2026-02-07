"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function confirmPayment() {
      await fetch(`/api/paymentapi/success/${id}`, {
        method: "POST",
        credentials: "include",
      });
    }

    if (id) confirmPayment();
  }, [id]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-500 mt-2">
          Your order has been confirmed.
        </p>

        <button
          onClick={() => router.push("/orders")}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to My Orders
        </button>
      </div>
    </main>
  );
}
