import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { sessionId, text } = body;

  const msg = await prisma.message.create({
    data: {
      sessionId,
      senderId: String(token.id),
      text,
    },
  });

  await prisma.session.update({
    where: { id: sessionId },
    data: { lastMessage: text, lastMessageAt: msg.createdAt },
  }).catch(console.error);

  return new Response(JSON.stringify(msg), { status: 201 });
}
