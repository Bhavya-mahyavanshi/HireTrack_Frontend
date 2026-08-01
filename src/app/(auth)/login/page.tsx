"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, LoginFormValues } from "@/lib/validation";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, { onSuccess: () => router.push("/dashboard") });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 34, color: "var(--color-ink)", margin: 0, width: "100%" }}>
          Welcome back.
        </h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 17, color: "var(--color-ink-muted-48)", margin: 0, width: "100%" }}>
          Sign in to your HireTrack workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 17, width: "100%" }}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4" strokeWidth={1.5} />}
            {...register("email")}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            error={errors.password?.message}
            leftIcon={<Lock className="w-4 h-4" strokeWidth={1.5} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink-muted-48)", padding: 4 }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            }
            {...register("password")}
          />

          <div style={{ paddingTop: 8, width: "100%" }}>
            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={login.isPending}>
              Sign in
            </Button>
          </div>
        </div>
      </form>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--color-ink-muted-48)", width: "100%", margin: 0 }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>
          Create one
        </Link>
      </p>
    </div>
  );
}
