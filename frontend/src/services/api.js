import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:5000" });

export const instance = axios.create({
  baseURL: "http://localhost:3000", // Backend server URL
});
