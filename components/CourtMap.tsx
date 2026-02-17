"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import { CourtWithDistance } from "@/lib/types";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

const defaultCenter = { lat: 5.4141, lng: 100.3288 };

interface CourtMapProps {
  courts: CourtWithDistance[];
  favorites: string[];
  onToggleFavorite: (courtId: string) => void;
  userLocation?: { lat: number; lng: number } | null;
}

export default function CourtMap({ courts, favorites, onToggleFavorite, userLocation }: CourtMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [selectedCourt, setSelectedCourt] = useState<CourtWithDistance | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || courts.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    courts.forEach((c) => bounds.extend({ lat: c.coordinates.lat, lng: c.coordinates.lng }));
    if (userLocation) {
      bounds.extend(userLocation);
    }
    map.fitBounds(bounds, 50);
  }, [courts, userLocation]);

  if (isOffline) {
    return (
      <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-1">Map unavailable offline</p>
          <p className="text-sm">Connect to the internet to view the map.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={onLoad}
      options={{
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {userLocation && (
        <>
          <Circle
            center={userLocation}
            radius={120}
            options={{
              fillColor: "#4285F4",
              fillOpacity: 0.3,
              strokeColor: "#4285F4",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
          <Marker
            position={userLocation}
            title="Your location"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        </>
      )}

      {courts.map((court) => (
        <Marker
          key={court.id}
          position={{ lat: court.coordinates.lat, lng: court.coordinates.lng }}
          title={court.name}
          onClick={() => setSelectedCourt(court)}
          icon={{
            url: court.indoor
              ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
        />
      ))}

      {selectedCourt && (
        <InfoWindow
          position={{
            lat: selectedCourt.coordinates.lat,
            lng: selectedCourt.coordinates.lng,
          }}
          onCloseClick={() => setSelectedCourt(null)}
        >
          <div className="min-w-[220px] p-1">
            <div className="flex justify-between items-center">
              <strong className="text-sm">{selectedCourt.name}</strong>
              <button
                onClick={() => onToggleFavorite(selectedCourt.id)}
                aria-label={favorites.includes(selectedCourt.id) ? "Remove from favorites" : "Add to favorites"}
                className="text-lg ml-2"
              >
                {favorites.includes(selectedCourt.id) ? "♥" : "♡"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{selectedCourt.address}</p>
            <div className="text-xs mt-2 space-y-0.5">
              <p>{selectedCourt.indoor ? "Indoor" : "Outdoor"} · {selectedCourt.numberOfCourts} courts</p>
              <p>{selectedCourt.surfaceType} · {selectedCourt.hours}</p>
              {selectedCourt.distance != null && (
                <p className="text-blue-600 font-medium">{selectedCourt.distance.toFixed(1)} km away</p>
              )}
            </div>
            <div className="flex gap-3 mt-2">
              <Link
                href={`/courts/${selectedCourt.id}`}
                className="text-xs text-emerald-600 hover:underline"
              >
                View Details
              </Link>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.coordinates.lat},${selectedCourt.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
