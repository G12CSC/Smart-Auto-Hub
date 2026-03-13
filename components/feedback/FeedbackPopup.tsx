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
    <div className={` ${styles.container}`}>
      <div className={styles.card}>
        <h2 className="text-2xl font-bold mb-2">
          Find Your Perfect Car in Sri Lanka 🇱🇰🚗
        </h2>

        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
          Looking for a reconditioned or brand-new vehicle at the best price?
          Our platform connects you with trusted car sellers across Sri Lanka.
        </h3>

        <ul className="list-disc list-inside mb-4">
          <li>✔ Toyota, Honda, Nissan, Suzuki & more</li>
          <li>✔ Brand new & reconditioned vehicles</li>
          <li>✔ Easy leasing options available</li>
          <li>✔ Trusted dealers island-wide</li>
        </ul>
        <p className="p-2">
          Start browsing today and drive your dream car home!
        </p>
        <button className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer" onClick={() => {
          window.location.href = "/vehicles";
        }}>
          👉 Explore Cars Now
        </button>
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
