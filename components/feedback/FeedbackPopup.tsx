"use client";

import { useEffect, useState } from "react";
import styles from "./feedback.module.css";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function FeedbackPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    const feedbackShown = sessionStorage.getItem("feedbackShown");

    if (!feedbackShown) {
      setTimeout(() => {
        setShowPopup(true);
      }, 5000);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("feedbackShown", "true");
    setShowPopup(false);
  };

  const submitFeedback = (e: any) => {
    sessionStorage.setItem("feedbackShown", "true");
    setShowPopup(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        name,
        feedback,
        rating,
        coupon,
      }),
    });

    const data = await res.json();

    if (data.success) {
      submitFeedback(e);
        toast.success("Thank you for your feedback!");
    } else {
      alert(data.message);
    }
  };

  if (!showPopup) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>Customer Feedback</h2>

          <input
            placeholder="Your Name"
            value={name}
            className={styles.input}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            placeholder="Your City"
            value={city}
            className={styles.input}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <textarea
            placeholder="Your feedback"
            value={feedback}
            className={styles.textarea}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />

          <div className={styles.rating}>
            <p>Rating:</p>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={styles.star}
                onClick={() => setRating(star)}
              >
                {star <= rating ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 mt-4">
            <input
              placeholder="Coupon Code"
              value={coupon}
              className={styles.couponCode}
              onChange={(e) => setCoupon(e.target.value)}
              required
            />

            <button type="submit" className={styles.submit}>
              Submit Feedback
            </button>
          </div>
        </form>
        <button
          type="button"
          className={styles.closePopup}
          onClick={closePopup}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
