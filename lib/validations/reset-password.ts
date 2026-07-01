import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required." })
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z
      .string({ required_error: "Please confirm your password." })
      .min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;