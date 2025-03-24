import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // ✅ Authentication Successful - Redirect or Set Session
    return NextResponse.json(
      { message: "Logging you in!", userId: user.user_id },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Type-check the error variable
    if (error instanceof Error) {
      console.error(error.message); // You can log the error message
    } else {
      console.error("An unknown error occurred");
    }
    return NextResponse.json({ error: "Oops! Login failed!" }, { status: 500 });
  }
}
