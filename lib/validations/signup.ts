import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string({ message: "Name is required." })
    .trim()
    .min(1, "Name is required.")
    .min(3, "Name must be at least 3 characters."),
  email: z
    .string({ message: "Email is required." })
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string({ message: "Password is required." })
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
