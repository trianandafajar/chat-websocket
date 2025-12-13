// app/api/sessions/start/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const auth = await getServerSession(authOptions);

  if (!auth?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return new Response("userId required", { status: 400 });
  }

  const me = auth.user.id;

  // cek apakah session private sudah ada
  const existing = await prisma.session.findFirst({
    where: {
      isGroup: false,
      participantIds: {
        hasEvery: [me, userId],
      },
    },
  });

  if (existing) {
    return Response.json(existing);
  }

  const session = await prisma.session.create({
    data: {
      participantIds: [me, userId],
      isGroup: false,
    },
  });

  return Response.json(session, { status: 201 });
}
