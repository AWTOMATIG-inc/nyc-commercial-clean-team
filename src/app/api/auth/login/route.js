import { db_connect } from "@/database";
import { UserModel } from "@/database/models/userModel";
import { comparePassword } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
const EXPIRES_IN = parseInt(process.env.JWT_TOKEN_EXPIRED || "86400");
export async function POST(request) {
  await db_connect();
  const { email, password } = await request.json();
  if ((!email, !password)) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      avatar: user?.avatar || "",
      name: user.name,
    });
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: EXPIRES_IN,
      sameSite: "strict",
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      { status: 500 }
    );
  }
}
