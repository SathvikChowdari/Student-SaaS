// src/api/auth.ts
import axiosClient from "./axioscleint";

/**
 * LOGIN — sends username/password, backend sets JWT cookie automatically.
 */
export async function login(username: string, password: string) {
  const res = await axiosClient.post("/auth/login", { username, password });
  return res.data; // contains { role }
}

/**
 * CHECK AUTH — verifies if user is logged in using existing cookie.
 */
export async function checkAuth() {
  try {
    const res = await axiosClient.get("/auth/verify"); // you'll add this endpoint soon
    return res.data; // e.g. { valid: true, username: "charith", role: "ADMIN" }
  } catch (err) {
    return { valid: false };
  }
}

/**
 * LOGOUT — clears the JWT cookie from backend.
 */
export async function logout() {
  await axiosClient.post("/auth/logout"); // backend will clear cookie
}
