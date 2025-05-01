import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:5000" });

export const instance = axios.create({
  baseURL: "http://localhost:3000", // Backend server URL
});

export const api = axios.create({
  baseURL: "http://localhost:5051", // Connect to Order Service backend running on port 5051
  headers: {
    "Content-Type": "application/json",
  },
});
