"use client";

import { FilterState } from "@/lib/types";
import { defaultFilters } from "@/lib/filters";

interface SearchFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  areas: string[];
  surfaceTypes: string[];
  courtCount: number;
  onRequestLocation: () => void;
  locationLoading: boolean;
  locationError: string | null;
  hasLocation: boolean;
  sortByDistance: boolean;
  onSortByDistanceChange: (value: boolean) => void;
}

export default function SearchFilter({
  filters,
  onFiltersChange,
  areas,
  surfaceTypes,
  courtCount,
  onRequestLocation,
  locationLoading,
  locationError,
  hasLocation,
  sortByDistance,
  onSortByDistanceChange,
}: SearchFilterProps) {
  const update = (partial: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...partial });

  const hasActiveFilters =
    filters.search !== "" ||
    filters.typeFilter !== "all" ||
    filters.areaFilter !== "all" ||
    filters.surfaceFilter !== "all" ||
    filters.showFavoritesOnly ||
    filters.openNow ||
    filters.minCourts > 0;

  return (
    <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm pb-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search courts by name..."
            aria-label="Search courts by name"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white dark:bg-slate-700 dark:text-gray-200 dark:placeholder-gray-400"
          />
          <select
            value={filters.typeFilter}
            onChange={(e) => update({ typeFilter: e.target.value as "all" | "indoor" | "outdoor" })}
            aria-label="Filter by type"
            className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white dark:bg-slate-700 dark:text-gray-200"
          >
            <option value="all">All Types</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
          <select
            value={filters.areaFilter}
            onChange={(e) => update({ areaFilter: e.target.value })}
            aria-label="Filter by area"
            className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white dark:bg-slate-700 dark:text-gray-200"
          >
            <option value="all">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <select
            value={filters.surfaceFilter}
            onChange={(e) => update({ surfaceFilter: e.target.value })}
            aria-label="Filter by surface type"
            className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white dark:bg-slate-700 dark:text-gray-200"
          >
            <option value="all">All Surfaces</option>
            {surfaceTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
          <button
            onClick={() => update({ showFavoritesOnly: !filters.showFavoritesOnly })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filters.showFavoritesOnly
                ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
            }`}
          >
            {filters.showFavoritesOnly ? "♥ Favorites" : "♡ Favorites"}
          </button>

          <button
            onClick={() => update({ openNow: !filters.openNow })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filters.openNow
                ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
            }`}
          >
            {filters.openNow ? "✓ Open Now" : "Open Now"}
          </button>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Min courts:</label>
            <input
              type="range"
              min={0}
              max={16}
              value={filters.minCourts}
              onChange={(e) => update({ minCourts: parseInt(e.target.value) })}
              className="w-20 accent-emerald-600"
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 w-8">{filters.minCourts || "Any"}</span>
          </div>

          <button
            onClick={onRequestLocation}
            disabled={locationLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              hasLocation
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {locationLoading ? "Locating..." : hasLocation ? "📍 Located" : "📍 Near Me"}
          </button>

          {hasLocation && (
            <button
              onClick={() => onSortByDistanceChange(!sortByDistance)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                sortByDistance
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
              }`}
            >
              Sort by Distance
            </button>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => onFiltersChange(defaultFilters)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}

          {locationError && (
            <span className="text-xs text-red-500">{locationError}</span>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {courtCount} court{courtCount !== 1 ? "s" : ""} found
        </div>
      </div>
    </div>
  );
}
