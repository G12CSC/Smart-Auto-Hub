"use client";

import { Star } from "lucide-react";
import React from "react";

/**
 * StarRating Component
 *
 * Displays star ratings with interactive selection or read-only display
 * Used for both showing existing ratings and allowing users to rate
 */

const StarRating = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = 24,
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
          disabled={readOnly}
          className={`transition-colors ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } `}
        >
          <Star
            size={size}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            } transition-all`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
