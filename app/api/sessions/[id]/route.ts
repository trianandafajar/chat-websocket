// app/api/sessions/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 });
  }

  // load participant user data
  const participants = await prisma.user.findMany({
    where: { id: { in: session.participantIds } },
    select: { id: true, name: true, picture: true, isOnline: true },
  });

  return new Response(JSON.stringify({ ...session, participants }), { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  if (!existing.participantIds.includes(me)) {
    return new Response("Forbidden", { status: 403 });
  }
  if (!existing.isGroup) {
    return new Response("Only group sessions are editable", { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const nextTitle =
    typeof body?.title === "string" ? body.title.trim() : undefined;
  const addUserIds: string[] = Array.isArray(body?.addUserIds)
    ? body.addUserIds.filter((u: unknown) => typeof u === "string")
    : [];
  const removeUserIds: string[] = Array.isArray(body?.removeUserIds)
    ? body.removeUserIds.filter((u: unknown) => typeof u === "string")
    : [];

  if (
    nextTitle === undefined &&
    addUserIds.length === 0 &&
    removeUserIds.length === 0
  ) {
    return new Response("No changes", { status: 400 });
  }

  if (nextTitle !== undefined && nextTitle.length === 0) {
    return new Response("title cannot be empty", { status: 400 });
  }

  const nextParticipants = new Set(existing.participantIds);
  for (const uid of addUserIds) nextParticipants.add(uid);
  for (const uid of removeUserIds) {
    if (uid === me) {
      return new Response("Use leave endpoint to remove yourself", { status: 400 });
    }
    nextParticipants.delete(uid);
  }

  if (!nextParticipants.has(me)) {
    return new Response("Cannot remove yourself via this endpoint", { status: 400 });
  }
  if (nextParticipants.size < 3) {
    return new Response("Group needs at least 3 members", { status: 400 });
  }

  if (addUserIds.length) {
    const addExist = await prisma.user.count({
      where: { id: { in: addUserIds } },
    });
    if (addExist !== addUserIds.length) {
      return new Response("some users not found", { status: 400 });
    }
  }

  const updated = await prisma.session.update({
    where: { id },
    data: {
      ...(nextTitle !== undefined ? { title: nextTitle } : {}),
      participantIds: Array.from(nextParticipants),
    },
  });

  const participants = await prisma.user.findMany({
    where: { id: { in: updated.participantIds } },
    select: { id: true, name: true, picture: true, isOnline: true },
  });

  return Response.json({ ...updated, participants });
}
