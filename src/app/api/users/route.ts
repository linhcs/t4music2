 // Import necessary modules and functions
import { NextResponse } from "next/server";
 import { prisma } from "../../../../prisma/script"; // Import prisma client

 // Define the POST function to handle user creation
 export async function POST(request: Request) {
   try {
    // Parse the request body
    const result = await request.json();
     console.log(result);

     // Check if username and password are provided
     if (!result.username || !result.password_hash) {
       // Handle missing username or password
     }
    try {
       // Insert user into the database
       await prisma.$queryRaw`INSERT INTO users (username, password_hash, email, role) VALUES (${
         result.username
       }, ${result.password_hash}, ${
         result.email || `${result.username}@example.com`
       }, 'listener')`;
    } catch (e) {
       // Handle error if username or email already exists
      console.log("ERROR", e);
      return NextResponse.json(
         { error: "Username or email already exists" },
         { status: 409 }
       );
    }
   } catch {
     // Handle internal server error
     return NextResponse.json(
       { error: "Internal Server Error" },
       { status: 500 }
     );
   }
 }
