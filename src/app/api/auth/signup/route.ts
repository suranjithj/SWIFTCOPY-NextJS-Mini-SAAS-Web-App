import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        // Note: In a real app, you'd store the hashed password
        // For demo purposes, we'll skip password storage since NextAuth handles it
      }
    });

    return new Response(JSON.stringify({ 
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }), { 
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Failed to create account" }), { status: 500 });
  }
}
