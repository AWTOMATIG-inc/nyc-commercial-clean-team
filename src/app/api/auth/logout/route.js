import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });  
  response.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
    sameSite: "strict",
  });
  
  return response;
}
