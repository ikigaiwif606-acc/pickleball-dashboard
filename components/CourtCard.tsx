"use client";

import { Court } from "@/lib/types";
import FavoriteButton from "./FavoriteButton";

interface CourtCardProps {
  court: Court;
  isFavorite: boolean;
  onToggleFavorite: (courtId: string) => void;
}

function isCurrentlyOpen(hours: string): boolean | null {
  // Parse hours like "7:00 AM – 10:00 PM"
  const match = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  const [, openH, openM, openP, closeH, closeM, closeP] = match;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let openHour = parseInt(openH);
  if (openP.toUpperCase() === "PM" && openHour !== 12) openHour += 12;
  if (openP.toUpperCase() === "AM" && openHour === 12) openHour = 0;
  const openMinutes = openHour * 60 + parseInt(openM);

  let closeHour = parseInt(closeH);
  if (closeP.toUpperCase() === "PM" && closeHour !== 12) closeHour += 12;
  if (closeP.toUpperCase() === "AM" && closeHour === 12) closeHour = 0;
  const closeMinutes = closeHour * 60 + parseInt(closeM);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export default function CourtCard({ court, isFavorite, onToggleFavorite }: CourtCardProps) {
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
          <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
          {open !== null && (
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                open
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {open ? "Open Now" : "Closed"}
            </span>
          )}
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
