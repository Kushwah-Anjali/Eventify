import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getAddressFromLatLng } from "../services/locationService";

export default function MapViewer({ lat, lng, venue, height = 400 }) {
  const [address, setAddress] = useState("Loading address...");
  const [showInfo, setShowInfo] = useState(false);
  const [markerRef, setMarkerRef] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY || "",
  });

  const position =
    !isNaN(lat) && !isNaN(lng) ? { lat: Number(lat), lng: Number(lng) } : null;

  useEffect(() => {
    if (lat == null || lng == null) return;
    const fetchAddress = async () => {
      try {
        const result = await getAddressFromLatLng(lat, lng);
        setAddress(result || `Lat: ${lat}, Lng: ${lng}`);
      } catch (err) {
        setAddress(`Lat: ${lat}, Lng: ${lng}`);
      }
    };
    fetchAddress();
  }, [lat, lng]);

  if (!isLoaded || !position)
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.9rem",
          letterSpacing: "0.5px",
        }}
      >
        Loading map…
      </div>
    );

  return (
    <div
      style={{
        height,
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
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
            {/* InfoWindow resets all styles — use a wrapper div */}
            <div
              style={{
                width: 230,
                padding: "14px 16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(99,102,241,0.92), rgba(139,92,246,0.92))",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 12px 32px rgba(99,102,241,0.4)",
                color: "#fff",
                fontFamily: "inherit",
              }}
            >
              {/* Pin icon + venue name */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>📍</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.3,
                    letterSpacing: "0.2px",
                  }}
                >
                  {venue || "Event Location"}
                </h4>
              </div>

        
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}