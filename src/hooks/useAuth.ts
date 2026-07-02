"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/lib/api/client";
import { LoginFormValues, RegisterFormValues } from "@/lib/validation";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormValues) =>
      authApi.login({ email: data.email, password: data.password }),
    onSuccess: (response) => {
      setAuth(response.token, { email: response.email, name: response.name });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormValues) =>
      authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: (response) => {
      setAuth(response.token, { email: response.email, name: response.name });
      toast.success(`Welcome to HireTrack. ${response.name.split(" ")[0]}.`);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  return () => {
    clearAuth();
    router.push("/login");
  };
}
