// app/api/sessions/[id]/join/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getServerSession(authOptions);
  if (!auth?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const me = auth.user.id;

  const existing = await prisma.session.findUnique({ where: { id } });
  if (!existing) {
    return new Response("Session not found", { status: 404 });
  }
  if (!existing.isGroup) {
    return new Response("Cannot join non-group sessions", { status: 400 });
  }
  if (existing.participantIds.includes(me)) {
    return new Response("Already a member", { status: 400 });
  }

  const updated = await prisma.session.update({
    where: { id },
    data: {
      participantIds: { push: me },
    },
  });

  const participants = await prisma.user.findMany({
    where: { id: { in: updated.participantIds } },
    select: { id: true, name: true, picture: true, isOnline: true },
  });

  return Response.json({ ...updated, participants });
}
