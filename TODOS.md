# TODOS

Deferred improvements identified during code review (Feb 2026).

## 1. Guard localStorage writes against QuotaExceededError

**What:** Add try/catch around `localStorage.setItem` in `saveFavorites()` and `saveAllReviews()`.

**Why:** localStorage writes can throw `QuotaExceededError` when storage is full. Currently only reads are guarded. A failed write silently loses the user's review or favorite — they think they saved it, but on reload it's gone.

**Context:** The two write call sites are `lib/favorites.ts:saveFavorites()` and `lib/reviews.ts:saveAllReviews()`. Both call `localStorage.setItem` without try/catch. The fix is straightforward: wrap each in try/catch, and either show a toast or return a boolean indicating success so the caller can display feedback.

**Depends on / blocked by:** Nothing. Can be done independently.

## 2. Persist filters in URL search params

**What:** Sync the `FilterState` to URL search params (e.g., `?search=pickle&type=indoor&area=Gurney`).

**Why:** Currently, filters reset when navigating to a court detail page and back. This also blocks sharing filtered views — a user can't send a "show me all indoor courts in Gurney" link.

**Context:** The filter state lives in `app/page.tsx` as React state (`useState<FilterState>`). The change would replace `useState` with a custom hook that reads from and writes to `URLSearchParams` via `next/navigation`'s `useSearchParams` and `useRouter`. The `FilterState` type in `lib/types.ts` defines all filter keys. All values are already serializable strings/booleans/numbers.

**Depends on / blocked by:** Nothing. Can be done independently.

## 3. Add component tests (Priority 3)

**What:** Add React component tests for `ReviewForm` and `SearchFilter` using Vitest + React Testing Library.

**Why:** These two components have meaningful interaction logic: `ReviewForm` has submit-disabled state and form clearing; `SearchFilter` has multiple filter controls that should update state correctly. Unit tests for pure functions (now done) catch logic bugs, but component tests catch rendering/interaction bugs.

**Context:** Vitest is already configured. Install `@testing-library/react` and `@testing-library/jest-dom`. Key test cases:
- **ReviewForm:** submit disabled until name + rating set, onSubmit called with trimmed values, form clears after submit.
- **SearchFilter:** each filter control updates the `onFiltersChange` callback correctly, "Clear All" resets to defaults.

**Depends on / blocked by:** Nothing. Vitest setup is complete.

## 4. Add review sorting options

**What:** Allow users to sort reviews by rating (high/low) or date (newest/oldest) on the court detail page.

**Why:** As reviews accumulate, users may want to see highest-rated or most recent reviews first. Currently reviews are always shown newest-first with no option to change.

**Context:** Reviews are rendered in `components/ReviewList.tsx` and managed in `app/courts/[id]/CourtDetailClient.tsx`. The change would add a sort dropdown to `ReviewList` (or its parent) and sort the `reviews` array before rendering. The `Review` type already has `rating` and `createdAt` fields.

**Depends on / blocked by:** Nothing. Can be done independently.
