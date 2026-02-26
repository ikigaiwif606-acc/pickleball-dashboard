import { describe, it, expect } from "vitest";
import { filterCourts } from "../filterCourts";
import { Court, FilterState } from "../types";
import { defaultFilters } from "../filters";

const makeCourt = (overrides: Partial<Court> = {}): Court => ({
  id: "1",
  name: "Test Court",
  address: "123 Test St",
  area: "George Town",
  coordinates: { lat: 5.414, lng: 100.329 },
  hours: "8:00 AM – 10:00 PM",
  numberOfCourts: 6,
  indoor: false,
  surfaceType: "Acrylic",
  contact: "+60123456789",
  description: "A test court",
  image: "/courts/1.jpg",
  bookingUrl: null,
  ...overrides,
});

const sampleCourts: Court[] = [
  makeCourt({ id: "1", name: "Pickle By The Sea", area: "Gurney", indoor: false, surfaceType: "Acrylic", numberOfCourts: 16 }),
  makeCourt({ id: "2", name: "Heritage Courts", area: "George Town", indoor: true, surfaceType: "Vinyl", numberOfCourts: 8 }),
  makeCourt({ id: "3", name: "Pickle Lab", area: "Jelutong", indoor: true, surfaceType: "Sport Court", numberOfCourts: 6 }),
  makeCourt({ id: "4", name: "PickleSquad", area: "Butterworth", indoor: false, surfaceType: "Acrylic", numberOfCourts: 8 }),
];

describe("filterCourts", () => {
  it("returns all courts with default filters", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: defaultFilters,
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(4);
  });

  it("filters by search text (case-insensitive)", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, search: "pickle" },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(3); // Pickle By The Sea, Pickle Lab, PickleSquad
    expect(result.map((c) => c.id).sort()).toEqual(["1", "3", "4"]);
  });

  it("filters by indoor type", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, typeFilter: "indoor" },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(2);
    expect(result.every((c) => c.indoor)).toBe(true);
  });

  it("filters by outdoor type", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, typeFilter: "outdoor" },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(2);
    expect(result.every((c) => !c.indoor)).toBe(true);
  });

  it("filters by area", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, areaFilter: "George Town" },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by surface type", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, surfaceFilter: "Acrylic" },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(2);
  });

  it("filters by favorites only", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, showFavoritesOnly: true },
      favorites: ["2", "4"],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id).sort()).toEqual(["2", "4"]);
  });

  it("filters by minimum courts", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, minCourts: 10 },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1"); // 16 courts
  });

  it("adds distance when userLocation is provided", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: defaultFilters,
      favorites: [],
      userLocation: { lat: 5.414, lng: 100.329 },
      sortByDistance: false,
    });
    expect(result.every((c) => c.distance !== undefined)).toBe(true);
  });

  it("sorts by distance when enabled", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: defaultFilters,
      favorites: [],
      userLocation: { lat: 5.414, lng: 100.329 },
      sortByDistance: true,
    });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].distance!).toBeGreaterThanOrEqual(result[i - 1].distance!);
    }
  });

  it("combines multiple filters", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, typeFilter: "outdoor", surfaceFilter: "Acrylic" },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(2); // Both outdoor + Acrylic
  });

  it("returns empty array when no courts match", () => {
    const result = filterCourts({
      courts: sampleCourts,
      filters: { ...defaultFilters, search: "nonexistent" },
      favorites: [],
      userLocation: null,
      sortByDistance: false,
    });
    expect(result).toHaveLength(0);
  });
});
