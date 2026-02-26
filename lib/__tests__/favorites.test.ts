import { describe, it, expect, beforeEach } from "vitest";

// Mock window + localStorage so the `typeof window === "undefined"` guard passes
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, "window", { value: globalThis, writable: true });
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

import { loadFavorites, saveFavorites } from "../favorites";

beforeEach(() => {
  localStorageMock.clear();
});

describe("loadFavorites", () => {
  it("returns empty array when nothing is stored", () => {
    expect(loadFavorites()).toEqual([]);
  });

  it("returns stored favorites", () => {
    localStorageMock.setItem("pickleball-favorites", JSON.stringify(["1", "3", "5"]));
    expect(loadFavorites()).toEqual(["1", "3", "5"]);
  });

  it("filters out non-string values", () => {
    localStorageMock.setItem("pickleball-favorites", JSON.stringify(["1", 42, null, "3"]));
    expect(loadFavorites()).toEqual(["1", "3"]);
  });

  it("returns empty array for corrupt JSON", () => {
    localStorageMock.setItem("pickleball-favorites", "not valid json");
    expect(loadFavorites()).toEqual([]);
  });

  it("returns empty array for non-array JSON", () => {
    localStorageMock.setItem("pickleball-favorites", JSON.stringify({ key: "value" }));
    expect(loadFavorites()).toEqual([]);
  });
});

describe("saveFavorites", () => {
  it("persists favorites to localStorage", () => {
    saveFavorites(["1", "2"]);
    expect(loadFavorites()).toEqual(["1", "2"]);
  });

  it("overwrites previous favorites", () => {
    saveFavorites(["1"]);
    saveFavorites(["2", "3"]);
    expect(loadFavorites()).toEqual(["2", "3"]);
  });

  it("saves empty array", () => {
    saveFavorites(["1"]);
    saveFavorites([]);
    expect(loadFavorites()).toEqual([]);
  });
});
