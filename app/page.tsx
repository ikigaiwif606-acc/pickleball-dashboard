"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Court, FilterState } from "@/lib/types";
import { filterCourts } from "@/lib/filterCourts";
import { getAllReviews } from "@/lib/reviews";
import { useFavorites } from "@/lib/useFavorites";
import { defaultFilters } from "@/lib/filters";
import courtsData from "@/data/courts.json";
import CourtList from "@/components/CourtList";
import SearchFilter from "@/components/SearchFilter";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";

const CourtMap = dynamic(() => import("@/components/CourtMap"), { ssr: false });

type ViewMode = "list" | "map" | "both";

const courts: Court[] = courtsData as Court[];
const areas = [...new Set(courts.map((c) => c.area))].sort();
const surfaceTypes = [...new Set(courts.map((c) => c.surfaceType))].sort();

export default function DashboardPage() {
  const [view, setView] = useState<ViewMode>("both");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const { favorites, toggleFavorite } = useFavorites();
  const [ratings, setRatings] = useState<Record<string, { average: number; count: number }>>({});

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  const computeRatings = useCallback(() => {
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

  useEffect(() => {
    computeRatings();
  }, [computeRatings]);

  // Re-compute ratings when returning from detail page
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        computeRatings();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [computeRatings]);

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

  const filteredCourts = useMemo(() => {
    return filterCourts({ courts, filters, favorites, userLocation, sortByDistance });
  }, [filters, favorites, userLocation, sortByDistance]);

  // Debounce courts passed to the map to avoid rapid re-fits during typing
  const [debouncedCourts, setDebouncedCourts] = useState(filteredCourts);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    debounceRef.current = setTimeout(() => setDebouncedCourts(filteredCourts), 300);
    return () => clearTimeout(debounceRef.current);
  }, [filteredCourts]);

  const viewButtons: { key: ViewMode; label: string }[] = [
    { key: "both", label: "List + Map" },
    { key: "list", label: "List Only" },
    { key: "map", label: "Map Only" },
  ];

  return (
    <GoogleMapsProvider>
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

      <div className="flex flex-wrap items-center gap-2 mb-4">
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
                courts={debouncedCourts}
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
          courts={debouncedCourts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          userLocation={userLocation}
        />
      )}
    </div>
    </GoogleMapsProvider>
  );
}
