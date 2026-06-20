import { useState } from "react";
import { FaStar } from "react-icons/fa";

import "./StarRating.css";

/**
 * value: current rating (0-5, can be fractional for display mode)
 * onChange: if provided, renders as an interactive input
 * size: px size of each star
 */
const StarRating = ({ value = 0, onChange, size = 18 }) => {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === "function";

  const displayValue = interactive && hovered > 0 ? hovered : value;

  return (
    <div
      className={`star-rating ${interactive ? "star-rating--interactive" : ""}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={
        interactive ? "Select a rating" : `Rated ${value} out of 5`
      }
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const filled = starIndex <= Math.round(displayValue);

        return (
          <span
            key={starIndex}
            className={`star ${filled ? "star--filled" : ""}`}
            style={{ fontSize: size }}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onClick={() => interactive && onChange(starIndex)}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? starIndex === value : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={(e) => {
              if (interactive && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onChange(starIndex);
              }
            }}
          >
            <FaStar />
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;