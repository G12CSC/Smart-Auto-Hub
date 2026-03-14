"use client";

import { useEffect, useState } from "react";
import styles from "./feedback.module.css";
import { X } from "lucide-react";

export default function FeedbackPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const feedbackShown = sessionStorage.getItem("consultingFeedbackShown");

    if (!feedbackShown) {
      setTimeout(() => {
        setShowPopup(true);
      }, 30000);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("consultingFeedbackShown", "true");
    setShowPopup(false);
  };


  if (!showPopup) return null;

  return (
    <div className={` ${styles.container}`}>
      <div className={styles.card}>
        <h2 className="text-2xl font-bold mb-2">
          Need Help Choosing the Right Car?
        </h2>

        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
          At Sameera Auto Traders, we understand that buying a car is a big decision. 
          That's why we offer a personalized consulting service to help you find the perfect vehicle.
        </h3>
        <p className="mb-4">
          Our experts will guide you through:
        </p>

        <ul className="list-disc list-inside mb-4">
          <li>✔ Choosing the best car for your budget</li>
          <li>✔ Comparing different models and features</li>
          <li>✔ Understanding leasing and financing options</li>
          <li>✔ Selecting reliable vehicles for Sri Lankan roads</li>
        </ul>
        <p className="p-2">
          📅 Book your consultation today and make a confident car purchase.
        </p>
        <button className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer" onClick={() => {
          window.location.href = "/consultation";
        }}>
          👉 Schedule Your Consultation Now
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
