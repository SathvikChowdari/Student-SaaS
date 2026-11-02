// src/api/auth.ts
import axiosClient from "./axioscleint";

type ApiEnvelope<T> = {
  data: T;
};

export type AuthSession = {
  valid: boolean;
  username?: string;
  role?: string;
};

type LoginResult = {
  username: string;
  role: string;
};

export async function login(username: string, password: string) {
  const res = await axiosClient.post<ApiEnvelope<LoginResult>>("/auth/login", {
    username,
    password,
  });
  return res.data.data;
}

export async function checkAuth(): Promise<AuthSession> {
  try {
    const res = await axiosClient.get<ApiEnvelope<AuthSession>>("/auth/verify");
    return res.data.data;
  } catch {
    return { valid: false };
  }
}

export async function logout() {
  await axiosClient.post("/auth/logout");
}
