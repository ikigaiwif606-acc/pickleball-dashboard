"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Court } from "@/lib/types";
import courtsData from "@/data/courts.json";
import CourtList from "@/components/CourtList";
import SearchFilter from "@/components/SearchFilter";

const CourtMap = dynamic(() => import("@/components/CourtMap"), { ssr: false });

type ViewMode = "list" | "map" | "both";

const FAVORITES_KEY = "pickleball-favorites";

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const courts: Court[] = courtsData;
  const [view, setView] = useState<ViewMode>("both");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "indoor" | "outdoor">("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const areas = useMemo(
    () => [...new Set(courts.map((c) => c.area))].sort(),
    [courts]
  );

  const filteredCourts = useMemo(() => {
    return courts.filter((court) => {
      if (search && !court.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (typeFilter === "indoor" && !court.indoor) return false;
      if (typeFilter === "outdoor" && court.indoor) return false;
      if (areaFilter !== "all" && court.area !== areaFilter) return false;
      if (showFavoritesOnly && !favorites.includes(court.id)) return false;
      return true;
    });
  }, [courts, search, typeFilter, areaFilter, showFavoritesOnly, favorites]);

  function toggleFavorite(courtId: string) {
    setFavorites((prev) => {
      const next = prev.includes(courtId)
        ? prev.filter((id) => id !== courtId)
        : [...prev, courtId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }

  const viewButtons: { key: ViewMode; label: string }[] = [
    { key: "both", label: "List + Map" },
    { key: "list", label: "List Only" },
    { key: "map", label: "Map Only" },
  ];

  return (
    <div>
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        areaFilter={areaFilter}
        onAreaFilterChange={setAreaFilter}
        areas={areas}
        showFavoritesOnly={showFavoritesOnly}
        onShowFavoritesOnlyChange={setShowFavoritesOnly}
        courtCount={filteredCourts.length}
      />

      <div className="flex items-center gap-2 mb-4">
        {viewButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setView(btn.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === btn.key
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {view === "both" ? (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/2">
            <CourtList
              courts={filteredCourts}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              compact
            />
          </div>
          <div className="lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
            <CourtMap
              courts={filteredCourts}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      ) : view === "list" ? (
        <CourtList
          courts={filteredCourts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <CourtMap
          courts={filteredCourts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
