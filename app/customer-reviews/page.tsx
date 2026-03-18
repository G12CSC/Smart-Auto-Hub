"use client";

import { Header } from "@/components/Header";
import { Star, Car, MessageSquare, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CustomerReviews() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [coupon, setCoupon] = useState("");
  return (
    <>
      <div className="max-w-5xl mx-auto mt-5">
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Write a Review</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Car size={16} />
              Vehicle
            </label>
            <Input type="text" placeholder="e.g. Toyota Camry" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Star size={16} />
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-2xl"
                  >
                    <span
                      className={
                        (hover || rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-secondary/90"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MessageSquare size={16} />
              Comment
            </label>
            <textarea
              className="w-full border border-border rounded px-3 py-2 dark:bg-secondary/90 dark:border-secondary/50"
              rows={4}
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Button>
              <CheckCircle size={16} className="mr-2" />
              Submit Review
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
