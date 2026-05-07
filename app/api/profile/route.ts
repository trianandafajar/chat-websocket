import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      picture: true,
      bio: true,
      isOnline: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session: any = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  const { name, bio, picture } = body as {
    name?: string;
    bio?: string;
    picture?: string;
  };

  const data: { name?: string; bio?: string | null; picture?: string } = {};

  if (typeof name === "string") {
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 50) {
      return NextResponse.json(
        { message: "Name must be 1-50 characters" },
        { status: 400 }
      );
    }
    data.name = trimmed;
  }

  if (typeof bio === "string") {
    const trimmed = bio.trim();
    if (trimmed.length > 200) {
      return NextResponse.json(
        { message: "Bio must be 200 characters or less" },
        { status: 400 }
      );
    }
    data.bio = trimmed.length === 0 ? null : trimmed;
  }

  if (typeof picture === "string" && picture.trim().length > 0) {
    const trimmed = picture.trim();

    // Accept either http(s) URL or data:image/* base64 (capped at ~1.5MB encoded)
    const isUrl = /^https?:\/\//i.test(trimmed);
    const isDataImage = /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(trimmed);

    if (!isUrl && !isDataImage) {
      return NextResponse.json(
        { message: "Invalid picture format" },
        { status: 400 }
      );
    }

    if (trimmed.length > 1_500_000) {
      return NextResponse.json(
        { message: "Picture too large (max ~1MB)" },
        { status: 413 }
      );
    }

    data.picture = trimmed;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      picture: true,
      bio: true,
    },
  });

  return NextResponse.json(updated);
}
