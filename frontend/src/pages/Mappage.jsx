import { useLocation } from "react-router-dom";
import MapViewer from "../components/MapViewer";

export default function MapPage() {
  const location = useLocation();
  const { lat, lng, venue } = location.state || {};
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude === 0 ||
    longitude === 0
  ) {
    return <p>No valid location data available</p>;
  }

  return (
    <div>
      <MapViewer lat={latitude} lng={longitude} venue={venue} height={420} />
    </div>
  );
}
