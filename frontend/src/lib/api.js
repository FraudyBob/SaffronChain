import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Standard JSON API instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Form-data API instance for login (x-www-form-urlencoded)
export const formApi = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

// Helper function for setting global Authorization header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    formApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
    delete formApi.defaults.headers.common["Authorization"];
  }
};
