import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subject name must be atleast 2 characters long."),

  credits: z.number().positive(),

  totalClasses: z.number().int().positive(),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;