// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api", // your Spring Boot backend
  withCredentials: true, // ✅ allow cookies to be sent and received
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
