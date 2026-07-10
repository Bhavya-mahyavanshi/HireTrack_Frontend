"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, LoginFormValues } from "@/lib/validation";
import { useLogin } from "@/hooks/useAuth";
import type { Metadata } from "next";

// Note: metadata export is ignored in client components but kept as a reminder
// for when this is converted if needed

// Stagger animation for form fields
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-xl"
    >
      {/* Heading */}
      <motion.div variants={item} className="flex flex-col gap-xs">
        <h1 className="font-display text-display-md text-ink tracking-tight">
          Welcome back.
        </h1>
        <p className="font-text text-body text-ink-muted-48">
          Sign in to your HireTrack workspace.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <motion.div variants={container} className="flex flex-col gap-md">
          <motion.div variants={item}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              error={errors.email?.message}
              leftIcon={<Mail className="w-4 h-4" strokeWidth={1.5} />}
              {...register("email")}
            />
          </motion.div>

          <motion.div variants={item}>
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
                  className="text-ink-muted-48 hover:text-ink transition-colors duration-150 p-xxs"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              }
              {...register("password")}
            />
          </motion.div>

          <motion.div variants={item} className="pt-xs">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={login.isPending}
            >
              Sign in
            </Button>
          </motion.div>
        </motion.div>
      </form>

      {/* Footer link */}
      <motion.p
        variants={item}
        className="text-center text-caption text-ink-muted-48"
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary-focus transition-colors duration-150 font-medium"
        >
          Create one
        </Link>
      </motion.p>
    </motion.div>
  );
}
