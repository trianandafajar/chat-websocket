// app/api/sessions/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
  });
  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(session), { status: 200 });
}