// app/api/sessions/discover/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const auth = await getServerSession(authOptions);
  if (!auth?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const me = auth.user.id;

  const groups = await prisma.session.findMany({
    where: {
      isGroup: true,
      NOT: { participantIds: { has: me } },
    },
    orderBy: [
      { lastMessageAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  const groupsWithParticipants = await Promise.all(
    groups.map(async (g) => {
      const participants = await prisma.user.findMany({
        where: { id: { in: g.participantIds } },
        select: { id: true, name: true, picture: true, isOnline: true },
      });
      return { ...g, participants };
    }),
  );

  return NextResponse.json(groupsWithParticipants);
}
