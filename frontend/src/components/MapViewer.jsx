import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
const Base_url = process.env.REACT_APP_API_URL;
export default function MapViewer({ lat, lng, venue, height = 400 }) {
  const [address, setAddress] = useState("Loading address...");
  const [showInfo, setShowInfo] = useState(false);
  const [markerRef, setMarkerRef] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY || "",
  });
  const position =
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null;
  useEffect(() => {
    if (!position) return;
    const fetchAddress = async () => {
      let attempts = 0;
      while (attempts < 3) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          const res = await fetch(
            `${Base_url}/api/reverse-geo?lat=${lat}&lng=${lng}`,
            {
              signal: controller.signal,
            }
          );
          clearTimeout(timeout);
          if (!res.ok) throw new Error("Fetch failed");
          const data = await res.json();
          setAddress(data.display_name || `Lat: ${lat}, Lng: ${lng}`);
          return;
        } catch (err) {
          attempts++;
          if (attempts === 3) {
            setAddress(`Lat: ${lat}, Lng: ${lng}`);
            console.error("Reverse geocode error:", err);
          }
        }
      }
    };
    fetchAddress();
  }, [lat, lng, position]);
  if (!isLoaded || !position) return <div style={{ height }}>Loading map…</div>;
  return (
    <div
      style={{
        height,
        width: "100%",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={position}
        zoom={16}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        <Marker
          position={position}
          onLoad={(marker) => setMarkerRef(marker)}
          onClick={() => setShowInfo(true)}
        />
        {markerRef && showInfo && (
          <InfoWindow
            anchor={markerRef}
            onCloseClick={() => setShowInfo(false)}
          >
            <div
              style={{
                width: 220,
                padding: "12px 14px",
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, rgba(40,60,120,0.95), rgba(10,20,40,0.95))",
                color: "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
              }}
            >
              <h4 style={{ margin: "0 0 6px", fontSize: 15 }}>
                {venue || "Event Location"}
              </h4>
              <p style={{ margin: 0, fontSize: 13 }}>{address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
