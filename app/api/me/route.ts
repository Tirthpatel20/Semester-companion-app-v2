import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session)
    return Response.json(
      {
        error: "Unauthorized Access",
      },
      {
        status: 401,
      },
    );

    return Response.json({
        session
    })
}
