"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Court, CourtWithDistance, FilterState } from "@/lib/types";
import { haversineDistance, isCurrentlyOpen } from "@/lib/utils";
import { getAllReviews } from "@/lib/reviews";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { defaultFilters } from "@/lib/filters";
import courtsData from "@/data/courts.json";
import CourtList from "@/components/CourtList";
import SearchFilter from "@/components/SearchFilter";

const CourtMap = dynamic(() => import("@/components/CourtMap"), { ssr: false });

type ViewMode = "list" | "map" | "both";

const courts: Court[] = courtsData as Court[];

export default function DashboardPage() {
  const [view, setView] = useState<ViewMode>("both");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, { average: number; count: number }>>({});

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    // Compute ratings from all reviews
    const allReviews = getAllReviews();
    const ratingsMap: Record<string, { average: number; count: number }> = {};
    for (const [courtId, courtReviews] of Object.entries(allReviews)) {
      if (courtReviews.length > 0) {
        const sum = courtReviews.reduce((acc, r) => acc + r.rating, 0);
        ratingsMap[courtId] = {
          average: sum / courtReviews.length,
          count: courtReviews.length,
        };
      }
    }
    setRatings(ratingsMap);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
        setSortByDistance(true);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access denied. Please enable location permissions."
            : "Unable to get your location. Please try again."
        );
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const areas = useMemo(
    () => [...new Set(courts.map((c) => c.area))].sort(),
    [courts]
  );

  const surfaceTypes = useMemo(
    () => [...new Set(courts.map((c) => c.surfaceType))].sort(),
    [courts]
  );

  const filteredCourts: CourtWithDistance[] = useMemo(() => {
    let result: CourtWithDistance[] = courts
      .filter((court) => {
        if (filters.search && !court.name.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        if (filters.typeFilter === "indoor" && !court.indoor) return false;
        if (filters.typeFilter === "outdoor" && court.indoor) return false;
        if (filters.areaFilter !== "all" && court.area !== filters.areaFilter) return false;
        if (filters.surfaceFilter !== "all" && court.surfaceType !== filters.surfaceFilter) return false;
        if (filters.showFavoritesOnly && !favorites.includes(court.id)) return false;
        if (filters.openNow) {
          const open = isCurrentlyOpen(court.hours);
          if (open !== true) return false;
        }
        if (filters.minCourts > 0 && court.numberOfCourts < filters.minCourts) return false;
        return true;
      })
      .map((court) => {
        if (!userLocation) return court;
        return {
          ...court,
          distance: haversineDistance(
            userLocation.lat,
            userLocation.lng,
            court.coordinates.lat,
            court.coordinates.lng
          ),
        };
      });

    if (sortByDistance && userLocation) {
      result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    return result;
  }, [courts, filters, favorites, userLocation, sortByDistance]);

  function toggleFavorite(courtId: string) {
    setFavorites((prev) => {
      const next = prev.includes(courtId)
        ? prev.filter((id) => id !== courtId)
        : [...prev, courtId];
      saveFavorites(next);
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
        filters={filters}
        onFiltersChange={setFilters}
        areas={areas}
        surfaceTypes={surfaceTypes}
        courtCount={filteredCourts.length}
        onRequestLocation={requestLocation}
        locationLoading={locationLoading}
        locationError={locationError}
        hasLocation={!!userLocation}
        sortByDistance={sortByDistance}
        onSortByDistanceChange={setSortByDistance}
      />

      <div className="flex items-center gap-2 mb-4">
        {viewButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setView(btn.key)}
            aria-pressed={view === btn.key}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === btn.key
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {view === "both" ? (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="order-2 lg:order-1 lg:w-1/2">
            <CourtList
              courts={filteredCourts}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              ratings={ratings}
              compact
            />
          </div>
          <div className="order-1 lg:order-2 lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
            <div className="h-[45vh] lg:h-[calc(100vh-10rem)]">
              <CourtMap
                courts={filteredCourts}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                userLocation={userLocation}
              />
            </div>
          </div>
        </div>
      ) : view === "list" ? (
        <CourtList
          courts={filteredCourts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          ratings={ratings}
        />
      ) : (
        <CourtMap
          courts={filteredCourts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          userLocation={userLocation}
        />
      )}
    </div>
  );
}
