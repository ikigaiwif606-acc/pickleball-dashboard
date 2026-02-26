import { describe, it, expect, beforeEach, vi } from "vitest";

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

// Mock crypto.randomUUID
let uuidCounter = 0;
vi.stubGlobal("crypto", { randomUUID: () => `test-uuid-${++uuidCounter}` });

import { getReviews, getAllReviews, addReview, deleteReview, getAverageRating } from "../reviews";
import type { Review } from "../types";

beforeEach(() => {
  localStorageMock.clear();
});

describe("getReviews", () => {
  it("returns empty array for court with no reviews", () => {
    expect(getReviews("1")).toEqual([]);
  });

  it("returns reviews for a court", () => {
    addReview("1", "Alice", 5, "Great!");
    const reviews = getReviews("1");
    expect(reviews).toHaveLength(1);
    expect(reviews[0].author).toBe("Alice");
    expect(reviews[0].rating).toBe(5);
    expect(reviews[0].comment).toBe("Great!");
  });
});

describe("getAllReviews", () => {
  it("returns empty object when no reviews exist", () => {
    expect(getAllReviews()).toEqual({});
  });

  it("returns all reviews grouped by court", () => {
    addReview("1", "Alice", 5, "Great!");
    addReview("2", "Bob", 3, "OK");
    const all = getAllReviews();
    expect(Object.keys(all)).toHaveLength(2);
    expect(all["1"]).toHaveLength(1);
    expect(all["2"]).toHaveLength(1);
  });

  it("filters out invalid review data from localStorage", () => {
    localStorageMock.setItem("pickleball-reviews", JSON.stringify({
      "1": [
        { id: "a", courtId: "1", author: "Alice", rating: 5, comment: "Good", createdAt: "2024-01-01" },
        { id: "b", courtId: "1", author: "Bob", rating: 10, comment: "Bad rating" }, // invalid: rating > 5, missing createdAt
        { bad: "data" }, // invalid: missing fields
      ],
    }));
    const all = getAllReviews();
    expect(all["1"]).toHaveLength(1);
    expect(all["1"][0].author).toBe("Alice");
  });

  it("handles corrupt JSON gracefully", () => {
    localStorageMock.setItem("pickleball-reviews", "not json");
    expect(getAllReviews()).toEqual({});
  });

  it("handles non-object JSON gracefully", () => {
    localStorageMock.setItem("pickleball-reviews", JSON.stringify([1, 2, 3]));
    expect(getAllReviews()).toEqual({});
  });
});

describe("addReview", () => {
  it("creates a review with correct fields", () => {
    const review = addReview("1", "Alice", 4, "Nice courts");
    expect(review.courtId).toBe("1");
    expect(review.author).toBe("Alice");
    expect(review.rating).toBe(4);
    expect(review.comment).toBe("Nice courts");
    expect(review.id).toBeTruthy();
    expect(review.createdAt).toBeTruthy();
  });

  it("clamps rating to 1-5 range", () => {
    const low = addReview("1", "A", 0, "");
    expect(low.rating).toBe(1);

    const high = addReview("1", "B", 10, "");
    expect(high.rating).toBe(5);

    const negative = addReview("1", "C", -3, "");
    expect(negative.rating).toBe(1);
  });

  it("prepends new reviews (newest first)", () => {
    addReview("1", "First", 3, "");
    addReview("1", "Second", 4, "");
    const reviews = getReviews("1");
    expect(reviews[0].author).toBe("Second");
    expect(reviews[1].author).toBe("First");
  });

  it("creates array for new court", () => {
    addReview("99", "Test", 5, "");
    expect(getReviews("99")).toHaveLength(1);
  });
});

describe("deleteReview", () => {
  it("removes the specified review", () => {
    const review = addReview("1", "Alice", 5, "Great!");
    expect(getReviews("1")).toHaveLength(1);
    deleteReview("1", review.id);
    expect(getReviews("1")).toEqual([]);
  });

  it("cleans up empty court arrays", () => {
    const review = addReview("1", "Alice", 5, "Great!");
    deleteReview("1", review.id);
    const all = getAllReviews();
    expect(all["1"]).toBeUndefined();
  });

  it("no-ops for missing courtId", () => {
    addReview("1", "Alice", 5, "Great!");
    deleteReview("nonexistent", "fake-id");
    expect(getReviews("1")).toHaveLength(1);
  });

  it("no-ops for missing reviewId", () => {
    addReview("1", "Alice", 5, "Great!");
    deleteReview("1", "nonexistent");
    expect(getReviews("1")).toHaveLength(1);
  });
});

describe("getAverageRating", () => {
  it("returns null for empty array", () => {
    expect(getAverageRating([])).toBeNull();
  });

  it("returns the rating for a single review", () => {
    const reviews: Review[] = [
      { id: "1", courtId: "1", author: "A", rating: 4, comment: "", createdAt: "" },
    ];
    expect(getAverageRating(reviews)).toBe(4);
  });

  it("calculates correct average for multiple reviews", () => {
    const reviews: Review[] = [
      { id: "1", courtId: "1", author: "A", rating: 5, comment: "", createdAt: "" },
      { id: "2", courtId: "1", author: "B", rating: 3, comment: "", createdAt: "" },
      { id: "3", courtId: "1", author: "C", rating: 4, comment: "", createdAt: "" },
    ];
    expect(getAverageRating(reviews)).toBe(4);
  });
});
