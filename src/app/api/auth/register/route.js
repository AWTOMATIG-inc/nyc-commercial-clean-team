import { db_connect } from "@/database";
import { UserModel } from "@/database/models/userModel";
import { hashPassword } from "@/lib/bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  await db_connect();
  const { name, email, password } = await request.json();
  if (!email.endsWith("@gmail.com")) {
    return NextResponse.json(
      { error: "Only @gmail.com emails are allowed." },
      { status: 403 }
    );
  }
  if ((!name, !email, !password)) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const isExist = await UserModel.findOne({ email: email });
    if (isExist) {
      return NextResponse.json(
        { error: "Email already exists!" },
        { status: 409 }
      );
    }
    const userData = await UserModel.create({
      name,
      email,
      password: await hashPassword(password),
    });
    if (!userData) {
      return NextResponse.json(
        { error: "user creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(userData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      { status: 500 }
    );
  }
}
