import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      Allow: "POST,OPTIONS",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
  });
}

export async function POST(request: NextRequest) {
  const userIdStr = request.cookies.get("user_id")?.value;
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { username } = (await request.json()) as { username?: string };
  if (!username || username.trim().length < 3) {
    return NextResponse.json(
      { error: "Username is required and must be ≥ 3 chars." },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.users.update({
      where: { user_id: userId },
      data: { username: username.trim() },
    });
    return NextResponse.json({ username: updated.username }, { status: 200 });
  } catch (e: unknown) {
    console.error("❌ /api/user/update error:", e);

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
      if (e.code === "P2025") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: (e as Error).message || "Could not update username" },
      { status: 500 }
    );
  }
}
