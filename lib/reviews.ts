import { Review } from "./types";

const REVIEWS_KEY = "pickleball-reviews";

function loadAllReviews(): Record<string, Review[]> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(REVIEWS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveAllReviews(all: Record<string, Review[]>) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
}

export function getReviews(courtId: string): Review[] {
  const all = loadAllReviews();
  return all[courtId] ?? [];
}

export function getAllReviews(): Record<string, Review[]> {
  return loadAllReviews();
}

export function addReview(courtId: string, author: string, rating: number, comment: string): Review {
  const all = loadAllReviews();
  const review: Review = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    courtId,
    author,
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    comment,
    createdAt: new Date().toISOString(),
  };
  if (!all[courtId]) all[courtId] = [];
  all[courtId].unshift(review);
  saveAllReviews(all);
  return review;
}

export function deleteReview(courtId: string, reviewId: string) {
  const all = loadAllReviews();
  if (!all[courtId]) return;
  all[courtId] = all[courtId].filter((r) => r.id !== reviewId);
  if (all[courtId].length === 0) delete all[courtId];
  saveAllReviews(all);
}

export function getAverageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}
