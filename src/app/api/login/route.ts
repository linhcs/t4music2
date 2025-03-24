import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/script";
import bcrypt from "bcryptjs";

type User = {
  id: string;
  username: string;
  password_hash: string;
  email?: string;
  role: string;
};

<<<<<<< HEAD
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
=======
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log(" Logging in:", username);

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Ensure Prisma query returns a typed array
    const users: User[] = await prisma.$queryRaw<User[]>`
      SELECT * FROM users WHERE username = ${username} LIMIT 1;
    `;

    console.log(" Found user:", users);

    // Check if user exists in the returned array
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const userData = users[0]; // Extract the first user

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
    console.log(" Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json(
      { 
        message: "Login successful" ,
      role: userData.role, 
  },
  { status: 200 });

  } catch (error:unknown) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
>>>>>>> dianethbranch
  }
}


