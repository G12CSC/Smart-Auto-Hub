"use client";

import { useEffect, useState } from "react";
import styles from "./feedback.module.css";
import { X } from "lucide-react";

export default function FeedbackPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const feedbackShown = sessionStorage.getItem("contactFeedbackShown");

    if (!feedbackShown) {
      setTimeout(() => {
        setShowPopup(true);
      }, 15000);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("contactFeedbackShown", "true");
    setShowPopup(false);
  };


  if (!showPopup) return null;

  return (
    <div className={` ${styles.container}`}>
      <div className={styles.card}>
        <h2 className="text-2xl font-bold mb-2">
          Contact Sameera Auto Traders Today !
        </h2>

        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
          Looking for your dream car or need more information about our vehicles?
        </h3>
        <p className="mb-4">
          Our team is ready to help you with car inquiries, vehicle availability, pricing, and consultation services.
        </p>

        <ul className="list-disc list-inside mb-4">
          <li>📞 Friendly customer support</li>
          <li>🚗 Expert advice on buying vehicles</li>
          <li>🤝 Trusted car dealers</li>
          <li>💬 Quick responses to your questions</li>
        </ul>
        <p className="p-2">
          Reach out to us anytime and let us help you drive away with confidence.
        </p>
        <button className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer" onClick={() => {
          window.location.href = "/contact";
        }}>
          📩 Contact Sameera Auto Traders today
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
