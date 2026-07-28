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

// Schema for editing existing subjects
export const editSubjectSchema = z.object({
  name: z
    .string({ message: "Subject name is required." })
    .trim()
    .min(1, "Subject name is required.")
    .min(2, "Subject name must be at least 2 characters."),

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
      message: "Credits is required.",
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
      message: "Total classes is required.",
    }),
});

export type EditSubjectFormValues = {
  name: string;
  credits?: number;
  totalClasses?: number;
};
export type EditSubjectInput = z.output<typeof editSubjectSchema>;

// Schema for creating new subjects
export const createSubjectSchema = z
  .object({
    name: z
      .string({ message: "Subject name is required." })
      .trim()
      .min(1, "Subject name is required.")
      .min(2, "Subject name must be at least 2 characters."),

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
        message: "Credits is required.",
      }),

    setupMethod: z.enum(["automatic", "manual"], {
      message: "Setup method is required.",
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
      .optional(),

    semesterStartDate: z.string().optional(),
    semesterEndDate: z.string().optional(),

    presentClasses: z
      .preprocess(
        (value) => (value === "" || Number.isNaN(value) ? undefined : value),
        z
          .number()
          .int("Present classes must be a whole number.")
          .min(0, "Present classes cannot be negative.")
          .optional(),
      )
      .optional(),

    conductedClasses: z
      .preprocess(
        (value) => (value === "" || Number.isNaN(value) ? undefined : value),
        z
          .number()
          .int("Conducted classes must be a whole number.")
          .min(0, "Conducted classes cannot be negative.")
          .optional(),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // 1. Validate totalClasses for manual setup
    if (data.setupMethod === "manual") {
      if (data.totalClasses === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Total classes is required.",
          path: ["totalClasses"],
        });
      }
    }

    // 2. Validate semesterStartDate and semesterEndDate for automatic setup
    let resolvedTotalClasses = data.totalClasses;
    if (data.setupMethod === "automatic") {
      if (!data.semesterStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Semester start date is required.",
          path: ["semesterStartDate"],
        });
      }
      if (!data.semesterEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Semester end date is required.",
          path: ["semesterEndDate"],
        });
      }

      if (data.semesterStartDate && data.semesterEndDate) {
        const start = new Date(data.semesterStartDate);
        const end = new Date(data.semesterEndDate);

        if (isNaN(start.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid start date.",
            path: ["semesterStartDate"],
          });
        }
        if (isNaN(end.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid end date.",
            path: ["semesterEndDate"],
          });
        }

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          if (end <= start) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Semester End Date must be after Semester Start Date.",
              path: ["semesterEndDate"],
            });
          } else if (data.credits !== undefined) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const estimated = Math.round(data.credits * (diffDays / 7));
            resolvedTotalClasses = estimated;
            if (estimated <= 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Estimated planned classes must be at least 1.",
                path: ["semesterEndDate"],
              });
            }
          }
        }
      }
    }

    // 3. Validate attendance imports
    if (data.presentClasses !== undefined || data.conductedClasses !== undefined) {
      if (data.conductedClasses === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Conducted classes is required when specifying present classes.",
          path: ["conductedClasses"],
        });
      } else {
        const present = data.presentClasses ?? 0;
        const conducted = data.conductedClasses;

        if (present > conducted) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Present Classes cannot exceed Conducted Classes.",
            path: ["presentClasses"],
          });
        }

        if (resolvedTotalClasses !== undefined && conducted > resolvedTotalClasses) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Conducted classes cannot exceed total planned classes.",
            path: ["conductedClasses"],
          });
        }
      }
    }
  })
  .transform((data) => {
    let totalClasses = data.totalClasses;
    let presentClasses = data.presentClasses;
    let conductedClasses = data.conductedClasses;

    // Check if attendance section is applicable
    let showAttendance = false;
    if (data.setupMethod === "manual") {
      showAttendance = true;
    } else if (data.setupMethod === "automatic" && data.semesterStartDate) {
      const start = new Date(data.semesterStartDate);
      if (!isNaN(start.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        if (today >= start) {
          showAttendance = true;
        }
      }
    }

    if (!showAttendance) {
      presentClasses = undefined;
      conductedClasses = undefined;
    }

    if (data.setupMethod === "automatic" && data.semesterStartDate && data.semesterEndDate && data.credits !== undefined) {
      const start = new Date(data.semesterStartDate);
      const end = new Date(data.semesterEndDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalClasses = Math.round(data.credits * (diffDays / 7));
      }
    }

    return {
      ...data,
      totalClasses: totalClasses as number, // Cast since resolved in transform
      presentClasses,
      conductedClasses,
    };
  });

export type CreateSubjectFormValues = {
  name: string;
  credits?: number;
  setupMethod: "automatic" | "manual";
  totalClasses?: number;
  semesterStartDate?: string;
  semesterEndDate?: string;
  presentClasses?: number;
  conductedClasses?: number;
};
export type CreateSubjectInput = z.output<typeof createSubjectSchema>;

