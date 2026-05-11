// app/api/sessions/group/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const auth = await getServerSession(authOptions);

  if (!auth?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const userIds: unknown = body?.userIds;

  if (!title) {
    return new Response("title required", { status: 400 });
  }
  if (!Array.isArray(userIds) || userIds.some((u) => typeof u !== "string")) {
    return new Response("userIds must be string[]", { status: 400 });
  }
  if (userIds.length < 2) {
    return new Response("group needs at least 2 other members", { status: 400 });
  }

  const me = auth.user.id;
  const uniqueIds = Array.from(new Set([me, ...(userIds as string[])]));

  const usersExist = await prisma.user.count({
    where: { id: { in: uniqueIds } },
  });
  if (usersExist !== uniqueIds.length) {
    return new Response("some users not found", { status: 400 });
  }

  const session = await prisma.session.create({
    data: {
      participantIds: uniqueIds,
      isGroup: true,
      title,
    },
  });

  const participants = await prisma.user.findMany({
    where: { id: { in: session.participantIds } },
    select: { id: true, name: true, picture: true, isOnline: true },
  });

  return Response.json({ ...session, participants }, { status: 201 });
}
