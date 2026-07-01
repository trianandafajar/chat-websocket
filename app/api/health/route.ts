import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let databaseOk = false;

  try {
    await prisma.$runCommandRaw({ ping: 1 });
    databaseOk = true;
  } catch {
    databaseOk = false;
  }

  return NextResponse.json({
    status: databaseOk ? "ok" : "degraded",
    api: true,
    database: databaseOk,
  });
}
