import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  // You can set auth header later: api.defaults.headers.common['Authorization'] = `Bearer ${token}`
});
