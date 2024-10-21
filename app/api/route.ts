import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "John Doe",
    bio: "I'm a software engineer",
  });
}
