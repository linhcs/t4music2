<<<<<<< HEAD
import { NextResponse } from "next/server"; // This allows the client to navigate to each page without having to fully reload a page
import { PrismaClient } from "@prisma/client"; // This is what is connecting our API to the database using Prisma
import bcrypt from "bcryptjs"; // this is just an encryption method..just testing it out here since we need a hashed pw
=======
import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/script";
import bcrypt from "bcryptjs";
>>>>>>> dianethbranch

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

<<<<<<< HEAD
export async function POST(req: Request) {
  // this runs when /api/signup (signups route.ts) receives a POST request
  try {
    const { email, username, password } = await req.json(); // this is going to extract username, email, and password from the request

    // here we are checking if the username with the same email exists (through prismas findUnique query)
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      // if the email is already in the DB its going to reject the request and alert user that such a user already exists
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // here im using bycrypt to hash the pw befire saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // prisma is going to create a new user in the DB with email, username and password, defaultly assigning every user the "listener" role
    const newUser = await prisma.users.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
        role: "listener", // Default role
      },
    });
    // if it works it will return this message with users details
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
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
    // Check if required fields are filled in
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Check if user alr. exists (by username)
    const existingUser = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count FROM users WHERE username = ${username}
    `;

    if (existingUser[0].count > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into DB
    await prisma.$executeRaw`
      INSERT INTO users (username, email, password_hash) 
      VALUES (${username}, ${email || `${username}@example.com`}, ${hashedPassword})
    `;

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
>>>>>>> dianethbranch
  }
}
