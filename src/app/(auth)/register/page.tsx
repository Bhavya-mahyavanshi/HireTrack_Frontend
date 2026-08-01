"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerSchema, RegisterFormValues } from "@/lib/validation";
import { useRegister } from "@/hooks/useAuth";

function getStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "var(--color-status-rejected)" };
  if (score <= 3) return { score, label: "Fair", color: "var(--color-status-interview)" };
  return { score, label: "Strong", color: "var(--color-status-offer)" };
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const register2 = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
  const strength = getStrength(passwordValue);

  const onSubmit = (data: RegisterFormValues) => {
    register2.mutate(data, { onSuccess: () => router.push("/dashboard") });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 34, color: "var(--color-ink)", margin: 0, width: "100%" }}>
          Start tracking.
        </h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 17, color: "var(--color-ink-muted-48)", margin: 0, width: "100%" }}>
          Create your free HireTrack account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 17, width: "100%" }}>
          <Input
            label="Full name"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            leftIcon={<User className="w-4 h-4" strokeWidth={1.5} />}
            {...register("name")}
          />

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4" strokeWidth={1.5} />}
            {...register("email")}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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

            <AnimatePresence>
              {passwordValue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden", width: "100%" }}
                >
                  <div style={{ display: "flex", gap: 4, flex: 1 }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <motion.div
                        key={level}
                        style={{ height: 4, flex: 1, borderRadius: 9999 }}
                        animate={{ backgroundColor: level <= strength.score ? strength.color : "var(--color-hairline)" }}
                        transition={{ duration: 0.25 }}
                      />
                    ))}
                  </div>
                  <motion.span
                    style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}
                    animate={{ color: strength.color }}
                  >
                    {strength.label}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Input
            label="Confirm password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="w-4 h-4" strokeWidth={1.5} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink-muted-48)", padding: 4 }}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            }
            {...register("confirmPassword")}
          />

          <div style={{ paddingTop: 8, width: "100%" }}>
            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={register2.isPending}>
              Create account
            </Button>
          </div>
        </div>
      </form>

      <p style={{ textAlign: "center", fontSize: 12, color: "var(--color-ink-muted-48)", lineHeight: 1.5, width: "100%", margin: 0 }}>
        By creating an account you agree to our{" "}
        <span style={{ color: "var(--color-primary)" }}>Terms of Service</span> and{" "}
        <span style={{ color: "var(--color-primary)" }}>Privacy Policy</span>.
      </p>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--color-ink-muted-48)", width: "100%", margin: 0 }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
