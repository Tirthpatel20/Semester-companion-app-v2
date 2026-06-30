// // import { z } from "zod";

// // export const createSubjectSchema = z.object({
// //   name: z
// //     .string()
// //     .trim()
// //     .min(2, "Subject name must be atleast 2 characters long."),

// //   credits: z.number().positive(),

// //   totalClasses: z.number().int().positive(),
// // });

// // export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;

// import { z } from "zod";

// export const createSubjectSchema = z.object({
//   name: z
//     .string()
//     .trim()
//     .min(2, "Subject name must be at least 2 characters long."),

//   credits: z
//     .preprocess(
//       (value) =>
//         value === "" || Number.isNaN(value) ? undefined : value,

//       z
//         .number()
//         .positive("Credits must be greater than 0.")
//         .optional(),
//     )
//     .refine((value) => value !== undefined, {
//       message: "Credits are required.",
//     }),

//   totalClasses: z
//     .preprocess(
//       (value) =>
//         value === "" || Number.isNaN(value) ? undefined : value,

//       z
//         .number()
//         .int("Total classes must be a whole number.")
//         .positive("Total classes must be greater than 0.")
//         .optional(),
//     )
//     .refine((value) => value !== undefined, {
//       message: "Total classes are required.",
//     }),
// });

// export type CreateSubjectFormValues = z.input<typeof createSubjectSchema>;
// export type CreateSubjectInput = z.output<typeof createSubjectSchema>;

import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2, "Subject name must be at least 2 characters."),

  credits: z
    .preprocess(
      (value) => (value === "" || Number.isNaN(value) ? undefined : value),

      z
        .number()
        .positive("Credits must be greater than 0.")
        .max(6, "Credits cannot exceed 6.")
        .optional(),
    )
    .refine((value) => value !== undefined, {
      message: "Credits are required.",
    }),

  totalClasses: z
    .preprocess(
      (value) => (value === "" || Number.isNaN(value) ? undefined : value),

      z
        .number()
        .int("Total classes must be a whole number.")
        .positive("Total classes must be greater than 0.")
        .optional(),
    )
    .refine((value) => value !== undefined, {
      message: "Total classes are required.",
    }),
});

export type CreateSubjectFormValues = z.input<typeof createSubjectSchema>;
export type CreateSubjectInput = z.output<typeof createSubjectSchema>;
