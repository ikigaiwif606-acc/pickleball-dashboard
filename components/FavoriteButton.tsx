"use client";

interface FavoriteButtonProps {
  courtId: string;
  isFavorite: boolean;
  onToggle: (courtId: string) => void;
}

export default function FavoriteButton({ courtId, isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle(courtId);
      }}
      className={`text-2xl transition-transform hover:scale-110 ${
        isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-300"
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}
