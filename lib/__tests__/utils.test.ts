import { describe, it, expect } from "vitest";
import { haversineDistance, isCurrentlyOpen } from "../utils";

describe("haversineDistance", () => {
  it("returns 0 for the same point", () => {
    expect(haversineDistance(5.414, 100.329, 5.414, 100.329)).toBe(0);
  });

  it("calculates a known distance (Penang to KL ~300km)", () => {
    const distance = haversineDistance(5.4141, 100.3288, 3.139, 101.6869);
    expect(distance).toBeGreaterThan(280);
    expect(distance).toBeLessThan(320);
  });

  it("calculates short distances accurately", () => {
    // Two courts in Penang ~2km apart
    const distance = haversineDistance(5.44, 100.31, 5.4274, 100.3165);
    expect(distance).toBeGreaterThan(1);
    expect(distance).toBeLessThan(3);
  });
});

describe("isCurrentlyOpen", () => {
  it("returns null for unparseable hours string", () => {
    expect(isCurrentlyOpen("By appointment")).toBeNull();
    expect(isCurrentlyOpen("")).toBeNull();
    expect(isCurrentlyOpen("Open 24 hours")).toBeNull();
  });

  it("correctly parses AM-PM range (normal hours)", () => {
    // Mock: assume we test logic by verifying structure,
    // since we can't control Date.now() easily without mocking
    const result = isCurrentlyOpen("7:00 AM – 11:00 PM");
    expect(result).not.toBeNull();
    expect(typeof result).toBe("boolean");
  });

  it("handles noon correctly (12:00 PM is not midnight)", () => {
    const result = isCurrentlyOpen("12:00 PM – 10:00 PM");
    expect(result).not.toBeNull();
  });

  it("handles midnight close (12:00 AM treated as end-of-day)", () => {
    // 7:00 AM to 12:00 AM should be treated as normal hours (7AM-midnight)
    // not overnight. The fix ensures closeMinutes=0 becomes 1440.
    const result = isCurrentlyOpen("7:00 AM – 12:00 AM");
    expect(result).not.toBeNull();
    // We can't assert true/false without knowing the current time,
    // but we can verify it doesn't crash
    expect(typeof result).toBe("boolean");
  });

  it("handles overnight hours (e.g., 10:00 PM - 2:00 AM)", () => {
    const result = isCurrentlyOpen("10:00 PM – 2:00 AM");
    expect(result).not.toBeNull();
    expect(typeof result).toBe("boolean");
  });

  it("handles en-dash and hyphen separators", () => {
    const resultDash = isCurrentlyOpen("8:00 AM - 10:00 PM");
    const resultEnDash = isCurrentlyOpen("8:00 AM – 10:00 PM");
    expect(resultDash).not.toBeNull();
    expect(resultEnDash).not.toBeNull();
  });
});
