"use client";

import { useEffect, useState } from "react";
import styles from "./feedback.module.css";
import { X } from "lucide-react";

export default function FeedbackPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const feedbackShown = sessionStorage.getItem("findVehicleFeedbackShown");

    if (!feedbackShown) {
      setTimeout(() => {
        setShowPopup(true);
      }, 5000);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("findVehicleFeedbackShown", "true");
    setShowPopup(false);
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
