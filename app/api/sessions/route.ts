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

    return NextResponse.json(sessions);
  } catch (err) {
    console.error("GET /api/sessions error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
