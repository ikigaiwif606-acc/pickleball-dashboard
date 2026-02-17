"use client";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md";
}

export default function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onChange,
  size = "md",
}: StarRatingProps) {
  const sizeClass = size === "sm" ? "text-sm" : "text-xl";

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            aria-label={`${starValue} of ${maxStars} stars`}
            aria-pressed={interactive ? filled : undefined}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition-transform ${
              filled ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
