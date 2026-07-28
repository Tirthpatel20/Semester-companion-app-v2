import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ message: "Email is required." })
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z
    .string({ message: "Password is required." })
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export type SignInInput = z.infer<typeof signInSchema>;