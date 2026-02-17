"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Court } from "@/lib/types";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function FitBounds({ courts }: { courts: Court[] }) {
  const map = useMap();
  useEffect(() => {
    if (courts.length > 0) {
      const bounds = L.latLngBounds(
        courts.map((c) => [c.coordinates.lat, c.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [courts, map]);
  return null;
}

interface CourtMapProps {
  courts: Court[];
  favorites: string[];
  onToggleFavorite: (courtId: string) => void;
}

export default function CourtMap({ courts, favorites, onToggleFavorite }: CourtMapProps) {
  return (
    <MapContainer
      center={[5.4141, 100.3288]}
      zoom={12}
      className="h-[500px] w-full rounded-lg shadow-md z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds courts={courts} />
      {courts.map((court) => (
        <Marker
          key={court.id}
          position={[court.coordinates.lat, court.coordinates.lng]}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="flex justify-between items-center">
                <strong className="text-sm">{court.name}</strong>
                <button
                  onClick={() => onToggleFavorite(court.id)}
                  className="text-lg ml-2"
                >
                  {favorites.includes(court.id) ? "♥" : "♡"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{court.address}</p>
              <div className="text-xs mt-2 space-y-0.5">
                <p>{court.indoor ? "Indoor" : "Outdoor"} · {court.numberOfCourts} courts</p>
                <p>{court.surfaceType} · {court.hours}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
