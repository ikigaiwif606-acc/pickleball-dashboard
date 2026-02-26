"use client";

import { useState, useEffect } from "react";
import { loadFavorites, saveFavorites } from "./favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  function toggleFavorite(courtId: string) {
    setFavorites((prev) => {
      const next = prev.includes(courtId)
        ? prev.filter((id) => id !== courtId)
        : [...prev, courtId];
      saveFavorites(next);
      return next;
    });
  }

  return { favorites, toggleFavorite };
}
