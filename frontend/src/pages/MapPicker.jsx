import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function MapPicker({ onSelect, initialPosition, height = 300 }) {
  const [markerPos, setMarkerPos] = useState(null);
  console.log(process.env.REACT_APP_GOOGLE_MAPS_KEY);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "",
  });

  const center = markerPos ||
    initialPosition || {
      lat: 28.6139,
      lng: 77.209,
    };

  useEffect(() => {
    if (initialPosition) {
      setMarkerPos({
        lat: Number(initialPosition.lat),
        lng: Number(initialPosition.lng),
      });
    }
  }, [initialPosition]);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPos({ lat, lng });

    // ONLY send lat & lng
    onSelect({ lat, lng });
  };

  if (!isLoaded) {
    return <div style={{ height }}>Loading map…</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ height, width: "100%" }}
      center={center}
      zoom={13}
      onClick={handleMapClick}
    >
      {markerPos && <Marker position={markerPos} />}
    </GoogleMap>
  );
}
