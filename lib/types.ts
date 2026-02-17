export interface Court {
  id: string;
  name: string;
  address: string;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: string;
  numberOfCourts: number;
  indoor: boolean;
  surfaceType: string;
  contact: string;
  description: string;
  image: string;
  bookingUrl: string | null;
  placeId?: string;
}

export interface CourtWithDistance extends Court {
  distance?: number; // km from user
}

export interface FilterState {
  search: string;
  typeFilter: "all" | "indoor" | "outdoor";
  areaFilter: string;
  surfaceFilter: string;
  showFavoritesOnly: boolean;
  openNow: boolean;
  minCourts: number;
}

export interface Review {
  id: string;
  courtId: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date
}
