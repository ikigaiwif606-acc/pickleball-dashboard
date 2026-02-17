"use client";

import Link from "next/link";
import { CourtWithDistance } from "@/lib/types";
import { isCurrentlyOpen } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";

interface CourtCardProps {
  court: CourtWithDistance;
  isFavorite: boolean;
  onToggleFavorite: (courtId: string) => void;
  averageRating?: number | null;
  reviewCount?: number;
}

export default function CourtCard({ court, isFavorite, onToggleFavorite, averageRating, reviewCount }: CourtCardProps) {
  const open = isCurrentlyOpen(court.hours);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${court.coordinates.lat},${court.coordinates.lng}`;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 ${
        court.indoor ? "border-l-blue-500" : "border-l-green-500"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <Link href={`/courts/${court.id}`} className="hover:text-emerald-600 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {open !== null && (
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                  open
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {open ? "Open Now" : "Closed"}
              </span>
            )}
            {court.distance != null && (
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                {court.distance.toFixed(1)} km away
              </span>
            )}
            {averageRating != null && reviewCount != null && reviewCount > 0 && (
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                {"★"} {averageRating.toFixed(1)} ({reviewCount})
              </span>
            )}
          </div>
        </div>
        <FavoriteButton
          courtId={court.id}
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
        />
      </div>
      <p className="text-sm text-gray-500 mb-3">{court.address}</p>
      <p className="text-sm text-gray-600 mb-4">{court.description}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">🕐</span>
          <span className="text-gray-600">{court.hours}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">🏟</span>
          <span className="text-gray-600">{court.numberOfCourts} courts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${court.indoor ? "bg-blue-500" : "bg-green-500"}`} />
          <span className="text-gray-600">{court.indoor ? "Indoor" : "Outdoor"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">◻</span>
          <span className="text-gray-600">{court.surfaceType}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
        {court.contact && (
          <span className="text-gray-500">📞 {court.contact}</span>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 font-medium ml-auto"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}
