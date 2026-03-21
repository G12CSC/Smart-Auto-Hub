"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (!code) return;

    fetch(`/api/coupons/verify?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setValid(true);
          setTransaction(data.data);
        } else {
          setError(data.message);
        }
      })
      .finally(() => setLoading(false));
  }, [code]);

  const handleSubmit = async () => {
    console.log(transaction);
    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        transaction,
        review,
        rating,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Review submitted!");
    }
  };

  if (loading) return <p className="text-center mt-10">Verifying...</p>;

  if (!valid) {
    return (
      <div className="text-center mt-10 text-red-500">
        <div className="text-6xl mb-4">❌</div>
        <div className="mt-5">
          {error === "Coupon expired" ? (
            <p>
              Your coupon has expired. Please contact support for assistance.
            </p>
          ) : (
            <p>
              {error}. Please check your link or contact support.
            </p>
          )}
        </div>
        <div className="mt-5">
          If you believe this is an error, please contact our support team at{" "}
          <a
            href="mailto:support@smartautohub.com"
            className="text-blue-500 hover:underline"
          >
            support@smartautohub.live
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🔹 LEFT SIDE */}
        <div className="space-y-4">
          {/* Image Section */}
          <div className="h-56 flex items-center justify-center border rounded-xl bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">
              <img
                src={transaction.image}
                alt={`${transaction.brand} ${transaction.model}`}
              />
            </span>
          </div>

          {/* About Vehicle */}
          <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
              About Vehicle
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {transaction.brand} {transaction.model}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
              Transaction Details
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>ID:</strong> {transaction.transactionId}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Car ID:</strong> {transaction.carId}
            </p>
          </div>
        </div>

        {/* 🔹 RIGHT SIDE */}
        <div className="space-y-4">
          {/* ⭐ Star Rating */}
          <div className="border rounded-xl p-4 flex justify-center gap-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating
                    ? "text-yellow-400 scale-110"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="">
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="input p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 w-full mb-4" />
          </div>

          {/* ✍️ Message Box */}
          <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full h-40 resize-none border rounded-lg p-3 
          bg-white dark:bg-gray-900 
          text-gray-800 dark:text-gray-200
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 🚀 Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 
        text-white font-semibold transition"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
