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
}
