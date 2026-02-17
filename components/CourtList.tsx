"use client";

import { Court } from "@/lib/types";
import CourtCard from "./CourtCard";

interface CourtListProps {
  courts: Court[];
  favorites: string[];
  onToggleFavorite: (courtId: string) => void;
  compact?: boolean;
}

export default function CourtList({ courts, favorites, onToggleFavorite, compact }: CourtListProps) {
  if (courts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No courts found matching your filters.</p>
        <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className={
      compact
        ? "flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2"
        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    }>
      {courts.map((court) => (
        <CourtCard
          key={court.id}
          court={court}
          isFavorite={favorites.includes(court.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
