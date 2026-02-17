"use client";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: "all" | "indoor" | "outdoor";
  onTypeFilterChange: (value: "all" | "indoor" | "outdoor") => void;
  areaFilter: string;
  onAreaFilterChange: (value: string) => void;
  areas: string[];
  showFavoritesOnly: boolean;
  onShowFavoritesOnlyChange: (value: boolean) => void;
  courtCount: number;
}

export default function SearchFilter({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  areaFilter,
  onAreaFilterChange,
  areas,
  showFavoritesOnly,
  onShowFavoritesOnlyChange,
  courtCount,
}: SearchFilterProps) {
  return (
    <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pb-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search courts by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as "all" | "indoor" | "outdoor")}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Types</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
          <select
            value={areaFilter}
            onChange={(e) => onAreaFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button
            onClick={() => onShowFavoritesOnlyChange(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              showFavoritesOnly
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {showFavoritesOnly ? "♥ Favorites" : "♡ Favorites"}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {courtCount} court{courtCount !== 1 ? "s" : ""} found
        </div>
      </div>
    </div>
  );
}
