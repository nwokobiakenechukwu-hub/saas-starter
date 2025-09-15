"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

type Creds = { email: string; password: string; name?: string };

export function useRegister() {
  return useMutation({
    mutationFn: async (body: Creds) =>
      api<{ user: any; accessToken: string; refreshToken: string }>("/api/auth/register", {
        method: "POST", body: JSON.stringify(body)
      }),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (body: Creds) =>
      api<{ user: any; accessToken: string; refreshToken: string }>("/api/auth/login", {
        method: "POST", body: JSON.stringify(body)
      }),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  });
}
