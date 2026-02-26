import { Court, CourtWithDistance, FilterState } from "./types";
import { haversineDistance, isCurrentlyOpen } from "./utils";

interface FilterOptions {
  courts: Court[];
  filters: FilterState;
  favorites: string[];
  userLocation: { lat: number; lng: number } | null;
  sortByDistance: boolean;
}

export function filterCourts({
  courts,
  filters,
  favorites,
  userLocation,
  sortByDistance,
}: FilterOptions): CourtWithDistance[] {
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
}
