// import { z } from "zod";

// export const createAssessmentSchema = z
//   .object({
//     name: z
//       .string()
//       .trim()
//       .min(2, "Assessment name must be at least 2 characters."),

//     maxMarks: z
//       .preprocess(
//         (value) => (value === "" || Number.isNaN(value) ? undefined : value),

//         z
//           .number()
//           .int()
//           .positive("Maximum marks must be greater than 0.")
//           .optional(),
//       )
//       .refine((value) => value !== undefined, {
//         message: "Maximum marks is required",
//       }),

//     obtainedMarks: z.preprocess(
//       (value) => {
//         if (value === "" || Number.isNaN(value)) {
//           return undefined;
//         }

//         return value;
//       },

//       z
//         .number()
//         .min(0, "Obtained marks cannot be negative.")
//         .optional(),
//     ),

//     weightage: z
//       .preprocess(
//         (value) => (value === "" || Number.isNaN(value) ? undefined : value),

//         z
//           .number()
//           .int()
//           .min(0, "Weightage cannot be negative.")
//           .max(100, "Weightage cannot exceed 100.")
//           .optional(),
//       )
//       .refine((value) => value !== undefined, {
//         message: "Weightage is required",
//       }),
//   })
//   .refine(
//     (data) =>
//       data.obtainedMarks === undefined ||
//       data.obtainedMarks <= data.maxMarks!,
//     {
//       message: "Obtained marks cannot exceed maximum marks.",
//       path: ["obtainedMarks"],
//     },
//   );

// export type CreateAssessmentFormValues = z.input<typeof createAssessmentSchema>;
// export type CreateAssessmentInput = z.output<typeof createAssessmentSchema>;


import { z } from "zod";

export const createAssessmentSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Assessment name must be at least 2 characters."),

    maxMarks: z
      .preprocess(
        (value) => (value === "" || Number.isNaN(value) ? undefined : value),

        z
          .number()
          .positive("Maximum marks must be greater than 0.")
          .optional()
      )
      .refine((value) => value !== undefined, {
        message: "Maximum marks is required.",
      })
      .refine((value) => Number.isInteger(value!), {
        message: "Maximum marks must be a whole number.",
      }),

    obtainedMarks: z.preprocess(
      (value) => {
        if (value === "" || Number.isNaN(value)) {
          return undefined;
        }

        return value;
      },

      z
        .number()
        .min(0, "Obtained marks cannot be negative.")
        .optional()
    ),

    weightage: z
      .preprocess(
        (value) => (value === "" || Number.isNaN(value) ? undefined : value),

        z
          .number()
          .min(0, "Weightage cannot be negative.")
          .max(100, "Weightage cannot exceed 100.")
          .optional()
      )
      .refine((value) => value !== undefined, {
        message: "Weightage is required.",
      })
      .refine((value) => Number.isInteger(value!), {
        message: "Weightage must be a whole number.",
      }),
  })
  .refine(
    (data) =>
      data.obtainedMarks === undefined ||
      data.obtainedMarks <= data.maxMarks!,
    {
      message: "Obtained marks cannot exceed maximum marks.",
      path: ["obtainedMarks"],
    }
  );

export type CreateAssessmentFormValues = z.input<typeof createAssessmentSchema>;
export type CreateAssessmentInput = z.output<typeof createAssessmentSchema>;