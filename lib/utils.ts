/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in kilometres.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Check if a court is currently open based on its hours string.
 * Returns true/false, or null if the hours string can't be parsed.
 */
export function isCurrentlyOpen(hours: string): boolean | null {
  const match = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  const [, openH, openM, openP, closeH, closeM, closeP] = match;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let openHour = parseInt(openH);
  if (openP.toUpperCase() === "PM" && openHour !== 12) openHour += 12;
  if (openP.toUpperCase() === "AM" && openHour === 12) openHour = 0;
  const openMinutes = openHour * 60 + parseInt(openM);

  let closeHour = parseInt(closeH);
  if (closeP.toUpperCase() === "PM" && closeHour !== 12) closeHour += 12;
  if (closeP.toUpperCase() === "AM" && closeHour === 12) closeHour = 0;
  let closeMinutes = closeHour * 60 + parseInt(closeM);
  if (closeMinutes === 0) closeMinutes = 1440; // Treat midnight close as end-of-day

  if (closeMinutes > openMinutes) {
    // Normal hours (e.g. 8:00 AM - 10:00 PM)
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // Overnight hours (e.g. 10:00 PM - 2:00 AM)
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
}
