import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Here you would typically validate the token with your backend
  // and fetch the user data based on the token

  return NextResponse.json({
    id: token.id,
    name: token.name,
    email: token.email,
    role: token.role,
  });
}
