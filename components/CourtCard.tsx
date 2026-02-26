"use client";

import Link from "next/link";
import Image from "next/image";
import { CourtWithDistance } from "@/lib/types";
import { isCurrentlyOpen } from "@/lib/utils";
import Badge from "./Badge";
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
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${
        court.indoor ? "border-l-blue-500" : "border-l-green-500"
      }`}
    >
      <div className="relative h-40 w-full">
        <Image
          src={court.image}
          alt={court.name}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link href={`/courts/${court.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{court.name}</h3>
            </Link>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {open !== null && (
                <Badge variant={open ? "success" : "danger"}>
                  {open ? "Open Now" : "Closed"}
                </Badge>
              )}
              {court.distance != null && (
                <Badge variant="info">
                  {court.distance.toFixed(1)} km away
                </Badge>
              )}
              {averageRating != null && reviewCount != null && reviewCount > 0 && (
                <Badge variant="warning">
                  {"★"} {averageRating.toFixed(1)} ({reviewCount})
                </Badge>
              )}
            </div>
          </div>
          <FavoriteButton
            courtId={court.id}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{court.address}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{court.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">🕐</span>
            <span className="text-gray-600 dark:text-gray-300">{court.hours}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">🏟</span>
            <span className="text-gray-600 dark:text-gray-300">{court.numberOfCourts} courts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${court.indoor ? "bg-blue-500" : "bg-green-500"}`} />
            <span className="text-gray-600 dark:text-gray-300">{court.indoor ? "Indoor" : "Outdoor"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">◻</span>
            <span className="text-gray-600 dark:text-gray-300">{court.surfaceType}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-sm">
          {court.contact && (
            <span className="text-gray-500 dark:text-gray-400">📞 {court.contact}</span>
          )}
          <div className="flex items-center gap-3 ml-auto">
<a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
