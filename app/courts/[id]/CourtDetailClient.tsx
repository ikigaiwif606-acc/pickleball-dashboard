"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Court } from "@/lib/types";
import { isCurrentlyOpen } from "@/lib/utils";
import { useFavorites } from "@/lib/useFavorites";
import Badge from "@/components/Badge";
import FavoriteButton from "@/components/FavoriteButton";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import { getReviews, addReview, deleteReview, getAverageRating } from "@/lib/reviews";
import type { Review } from "@/lib/types";

const CourtMap = dynamic(() => import("@/components/CourtMap"), { ssr: false });

export default function CourtDetailClient({ court }: { court: Court }) {
  const { favorites, toggleFavorite } = useFavorites();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [shareMessage, setShareMessage] = useState("");
  const open = isCurrentlyOpen(court.hours);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${court.coordinates.lat},${court.coordinates.lng}`;
  const avgRating = getAverageRating(reviews);

  useEffect(() => {
    setReviews(getReviews(court.id));
  }, [court.id]);

  function handleAddReview(author: string, rating: number, comment: string) {
    addReview(court.id, author, rating, comment);
    setReviews(getReviews(court.id));
  }

  function handleDeleteReview(reviewId: string) {
    deleteReview(court.id, reviewId);
    setReviews(getReviews(court.id));
  }

  async function handleShare() {
    const shareData = {
      title: court.name,
      text: `Check out ${court.name} - a pickleball court in Penang!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${court.name} - ${window.location.href}`);
        setShareMessage("Link copied!");
        setTimeout(() => setShareMessage(""), 2000);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setShareMessage("Failed to share");
      setTimeout(() => setShareMessage(""), 2000);
    }
  }

  return (
    <GoogleMapsProvider>
    <div>
      <Link href="/" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 mb-4">
        ← Back to all courts
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="relative h-56 sm:h-72 w-full">
          <Image
            src={court.image}
            alt={court.name}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{court.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{court.address}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {open !== null && (
                  <Badge variant={open ? "success" : "danger"}>
                    {open ? "Open Now" : "Closed"}
                  </Badge>
                )}
                <Badge variant={court.indoor ? "info" : "success"}>
                  {court.indoor ? "Indoor" : "Outdoor"}
                </Badge>
                {avgRating !== null && (
                  <Badge variant="warning">
                    {"★"} {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </Badge>
                )}
              </div>
            </div>
            <FavoriteButton
              courtId={court.id}
              isFavorite={favorites.includes(court.id)}
              onToggle={toggleFavorite}
            />
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{court.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hours</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{court.hours}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Courts</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{court.numberOfCourts}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Surface</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{court.surfaceType}</p>
            </div>
            {court.contact && (
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{court.contact}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Get Directions →
            </a>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
            {shareMessage && (
              <span className={`self-center text-sm ${shareMessage === "Link copied!" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{shareMessage}</span>
            )}
          </div>

          <div className="h-[300px] rounded-lg overflow-hidden">
            <CourtMap
              courts={[court]}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Reviews</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Reviews saved on this device.</p>

        <ReviewForm onSubmit={handleAddReview} />
        <ReviewList reviews={reviews} onDelete={handleDeleteReview} />
      </div>
    </div>
    </GoogleMapsProvider>
  );
}
