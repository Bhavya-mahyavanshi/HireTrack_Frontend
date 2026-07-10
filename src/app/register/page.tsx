"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerSchema, RegisterFormValues } from "@/lib/validation";
import { useRegister } from "@/hooks/useAuth";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Password strength — purely visual, not a security gate
function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
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
  const register2 = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
  const strength = getStrength(passwordValue);

  const onSubmit = (data: RegisterFormValues) => {
    register2.mutate(data);
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
          Start tracking.
        </h1>
        <p className="font-text text-body text-ink-muted-48">
          Create your free HireTrack account.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <motion.div variants={container} className="flex flex-col gap-md">
          {/* Name */}
          <motion.div variants={item}>
            <Input
              label="Full name"
              type="text"
              autoComplete="name"
              error={errors.name?.message}
              leftIcon={<User className="w-4 h-4" strokeWidth={1.5} />}
              {...register("name")}
            />
          </motion.div>

          {/* Email */}
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

          {/* Password + strength meter */}
          <motion.div variants={item} className="flex flex-col gap-xs">
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

            {/* Strength bar */}
            <AnimatePresence>
              {passwordValue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-sm overflow-hidden"
                >
                  <div className="flex gap-xxs flex-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <motion.div
                        key={level}
                        className="h-1 flex-1 rounded-full"
                        animate={{
                          backgroundColor:
                            level <= strength.score
                              ? strength.color
                              : "var(--color-hairline)",
                        }}
                        transition={{ duration: 0.25 }}
                      />
                    ))}
                  </div>
                  <motion.span
                    className="text-fine-print font-medium whitespace-nowrap"
                    animate={{ color: strength.color }}
                  >
                    {strength.label}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confirm password */}
          <motion.div variants={item}>
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
                  className="text-ink-muted-48 hover:text-ink transition-colors duration-150 p-xxs"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              }
              {...register("confirmPassword")}
            />
          </motion.div>

          <motion.div variants={item} className="pt-xs">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={register2.isPending}
            >
              Create account
            </Button>
          </motion.div>
        </motion.div>
      </form>

      {/* Terms note */}
      <motion.p
        variants={item}
        className="text-center text-fine-print text-ink-muted-48 leading-relaxed"
      >
        By creating an account you agree to our{" "}
        <span className="text-primary">Terms of Service</span> and{" "}
        <span className="text-primary">Privacy Policy</span>.
      </motion.p>

      {/* Switch to login */}
      <motion.p
        variants={item}
        className="text-center text-caption text-ink-muted-48"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary-focus transition-colors duration-150 font-medium"
        >
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
