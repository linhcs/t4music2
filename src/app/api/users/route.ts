import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/script";

// Create user
export async function POST(request: Request) {
  try {
    const result = await request.json();
    console.log(result);

    if (!result.username || !result.password_hash) {
      return NextResponse.json(
        { error: "Missing username or password" },
        { status: 400 }
      );
    }

    try {
      await prisma.$queryRaw`
        INSERT INTO users (username, password_hash, email, role) 
        VALUES (
          ${result.username}, 
          ${result.password_hash}, 
          ${result.email || `${result.username}@example.com`}, 
          'listener'
        )
      `;
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error("INSERT ERROR:", e);
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
  } catch (e) {
    console.error("POST ERROR:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request: Request) {
  try {
    const { user_id } = await request.json();

    if (!user_id || isNaN(Number(user_id))) {
      return NextResponse.json({ error: "Invalid or missing user_id" }, { status: 400 });
    }

    await prisma.users.delete({
      where: { user_id: Number(user_id) },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE ERROR:", e);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
