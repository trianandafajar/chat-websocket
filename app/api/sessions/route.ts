import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json([], { status: 200 }); // ⬅️ PENTING
    }

    const sessions = await prisma.session.findMany({
      where: {
        participantIds: {
          has: session.user.id,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    // Get participants for each session
    const sessionsWithParticipants = await Promise.all(
      sessions.map(async (s) => {
        const participants = await prisma.user.findMany({
          where: {
            id: { in: s.participantIds },
          },
          select: {
            id: true,
            name: true,
            picture: true,
            isOnline: true,
          },
        });
        return { ...s, participants };
      })
    );

    return NextResponse.json(sessionsWithParticipants);
  } catch (err) {
    console.error("GET /api/sessions error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
