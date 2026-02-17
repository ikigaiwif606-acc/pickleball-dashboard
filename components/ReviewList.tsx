"use client";

import { Review } from "@/lib/types";
import StarRating from "./StarRating";

interface ReviewListProps {
  reviews: Review[];
  onDelete: (reviewId: string) => void;
}

export default function ReviewList({ reviews, onDelete }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">{review.author}</span>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => onDelete(review.id)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                title="Delete review"
              >
                ✕
              </button>
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-gray-600">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
