import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
export const withAdminKey = (key) => ({
  headers: { "x-admin-key": key },
});
export const getUsers = () => API.get("/api/users");
export const addUser = (data, adminKey) => API.post("/api/users/add", data, withAdminKey(adminKey));
export const updateUser = (data, adminKey) => API.post("/api/users/update", data, withAdminKey(adminKey));
export const deleteUser = (data, adminKey) => API.post("/api/users/delete", data, withAdminKey(adminKey));
export default API;
