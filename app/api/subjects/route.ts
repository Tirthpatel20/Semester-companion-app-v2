import { db } from "@/db";
import { subjects } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { createSubjectSchema } from "@/lib/validations/create-subject";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

export async function POST(request: Request) {
  let session;
  let body;

  try {
    try {
      session = await requireSession();
    } catch (error: any) {
      return Response.json({ error: "Unauthorized Access" }, { status: 401 });
    }

    try {
      body = createSubjectSchema.parse(await request.json());
    } catch (error) {
      if (error instanceof ZodError)
        return Response.json(
          {
            error: error.flatten(),
          },
          {
            status: 400,
          },
        );
    }

    if (body) {
      const [subject] = await db
        .insert(subjects)
        .values({
          name: body.name,
          credits: Number(body.credits),
          totalClasses: body.totalClasses,

          userId: session.user.id,
        })
        .returning();

      return Response.json(
        {
          success: true,
          subject,
        },
        {
          status: 201,
        },
      );
    }
  } catch (error: any) {
    if (error.code === "23505")
      return Response.json(
        {
          error: "Subject already exists",
        },
        {
          status: 409,
        },
      );

    return Response.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  let session;

  try {
    session = await requireSession();
  } catch (error: any) {
    return Response.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  const userSubjects = await db.query.subjects.findMany({
    where: eq(subjects.userId, session.user.id),
    orderBy: (subject, { asc }) => [asc(subject.name)],
  });

  return Response.json({
    subjects: userSubjects,
  });
}


// export async function POST(request: Request) {
//   try {
//     const session = await requireSession();

//     const body = createSubjectSchema.parse(
//       await request.json(),
//     );

//     const [subject] = await db
//       .insert(subjects)
//       .values({
//         name: body.name,
//         credits: body.credits,
//         totalClasses: body.totalClasses,
//         userId: session.user.id,
//       })
//       .returning();

//     return Response.json(
//       {
//         success: true,
//         subject,
//       },
//       {
//         status: 201,
//       },
//     );
//   } catch (error: any) {
//     if (error instanceof ZodError) {
//       return Response.json(
//         {
//           error: error.flatten(),
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     if (error.code === "23505") {
//       return Response.json(
//         {
//           error: "Subject already exists",
//         },
//         {
//           status: 409,
//         },
//       );
//     }

//     return Response.json(
//       {
//         error: "Internal server error",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }