import { z } from "zod";

// Mirrors backend RegisterRequest @Valid rules:
// @NotBlank name, @Email email, @Size(min=8) password
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be under 100 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be under 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Mirrors backend LoginRequest — no additional constraints beyond presence
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
