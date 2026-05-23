const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const getAddressFromLatLng = async (lat, lng) => {
  const res = await fetch(
    `${BASE_URL}/api/reverse-geo?lat=${lat}&lng=${lng}`
  );
  if (!res.ok) throw new Error("Failed to fetch address");
  const data = await res.json();
  return data.display_name;
};
