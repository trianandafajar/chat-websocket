// app/api/presence/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, online } = await req.json();

  await prisma.user.update({
    where: { id: userId },
    data: { isOnline: online, lastSeen: new Date() },
  });

  return new Response("OK", { status: 200 });
}