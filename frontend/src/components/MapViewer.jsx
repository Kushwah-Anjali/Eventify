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
        console.error(err);
        setAddress(`Lat: ${lat}, Lng: ${lng}`);
      }
    };

    fetchAddress();
  }, [lat, lng]);
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
