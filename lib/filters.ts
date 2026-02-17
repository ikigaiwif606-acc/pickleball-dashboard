import { FilterState } from "./types";

export const defaultFilters: FilterState = {
  search: "",
  typeFilter: "all",
  areaFilter: "all",
  surfaceFilter: "all",
  showFavoritesOnly: false,
  openNow: false,
  minCourts: 0,
};
