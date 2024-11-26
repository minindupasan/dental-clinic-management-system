import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // Here you would typically validate the user credentials against your database
  // For this example, we'll use a mock user
  const user = {
    id: "1",
    email: "user@example.com",
    role: "dentist", // This could be 'dentist', 'receptionist', or 'assistant'
  };

  if (email === user.email && password === "password") {
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    (await cookies()).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    return NextResponse.json({ success: true, role: user.role });
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
