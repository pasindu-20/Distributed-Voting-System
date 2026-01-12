import axios from "axios";

const API_BASE = "http://localhost:7000"; // Watchdog

export const login = (data) => axios.post("http://localhost:4000/auth/login", data);
export const vote = (data, token) =>
  axios.post(`${API_BASE}/votes/vote`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const getResults = () =>
  axios.get("http://localhost:6000/api/");
