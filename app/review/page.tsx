"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState("");

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
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
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
        {error || "Invalid or expired coupon"}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Transaction Details</h3>

        <p>
          <strong>Transaction ID:</strong> {transaction.transactionId}
        </p>
        <p>
          <strong>Car ID:</strong> {transaction.carId}
        </p>
        <p>
          <strong>Brand:</strong> {transaction.brand}
        </p>
        <p>
          <strong>Model:</strong> {transaction.model}
        </p>
      </div>


      <div>
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full border p-3 rounded-lg mb-4"
        />


        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
