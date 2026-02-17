"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Court } from "@/lib/types";
import { isCurrentlyOpen } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { getReviews, addReview, deleteReview, getAverageRating } from "@/lib/reviews";
import type { Review } from "@/lib/types";

const FAVORITES_KEY = "pickleball-favorites";

const CourtMap = dynamic(() => import("@/components/CourtMap"), { ssr: false });

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function CourtDetailClient({ court }: { court: Court }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const open = isCurrentlyOpen(court.hours);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${court.coordinates.lat},${court.coordinates.lng}`;
  const avgRating = getAverageRating(reviews);

  useEffect(() => {
    setFavorites(loadFavorites());
    setReviews(getReviews(court.id));
  }, [court.id]);

  function toggleFavorite(courtId: string) {
    setFavorites((prev) => {
      const next = prev.includes(courtId)
        ? prev.filter((id) => id !== courtId)
        : [...prev, courtId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }

  function handleAddReview(author: string, rating: number, comment: string) {
    addReview(court.id, author, rating, comment);
    setReviews(getReviews(court.id));
  }

  function handleDeleteReview(reviewId: string) {
    deleteReview(court.id, reviewId);
    setReviews(getReviews(court.id));
  }

  return (
    <div>
      <Link href="/" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 mb-4">
        ← Back to all courts
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{court.name}</h2>
            <p className="text-gray-500 mt-1">{court.address}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {open !== null && (
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                    open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {open ? "Open Now" : "Closed"}
                </span>
              )}
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${court.indoor ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                {court.indoor ? "Indoor" : "Outdoor"}
              </span>
              {avgRating !== null && (
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                  {"★"} {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              )}
            </div>
          </div>
          <FavoriteButton
            courtId={court.id}
            isFavorite={favorites.includes(court.id)}
            onToggle={toggleFavorite}
          />
        </div>

        <p className="text-gray-600 mb-6">{court.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Hours</p>
            <p className="text-sm font-medium text-gray-800 mt-1">{court.hours}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Courts</p>
            <p className="text-sm font-medium text-gray-800 mt-1">{court.numberOfCourts}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Surface</p>
            <p className="text-sm font-medium text-gray-800 mt-1">{court.surfaceType}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Contact</p>
            <p className="text-sm font-medium text-gray-800 mt-1">{court.contact || "N/A"}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            Get Directions →
          </a>
        </div>

        <div className="h-[300px] rounded-lg overflow-hidden">
          <CourtMap
            courts={[court]}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Reviews</h3>
        <p className="text-xs text-gray-400 mb-4">Reviews saved on this device.</p>

        <ReviewForm onSubmit={handleAddReview} />
        <ReviewList reviews={reviews} onDelete={handleDeleteReview} />
      </div>
    </div>
  );
}
