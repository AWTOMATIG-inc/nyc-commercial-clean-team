import { db_connect } from "@/database";
import { UserModel } from "@/database/models/userModel";
import { hashPassword } from "@/lib/bcrypt";
import { isEmail, isNonEmptyString } from "@/lib/sanitize";
import { NextResponse } from "next/server";

// Same rule as src/yup/userSchema.js. bcrypt only reads the first 72 bytes.
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,72}$)/;

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const { name, email, password } = body ?? {};
  if (
    !isNonEmptyString(name) ||
    name.length > 100 ||
    !isEmail(email) ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  if (!PASSWORD_RULE.test(password)) {
    return NextResponse.json(
      {
        error:
          "Password must be 8 to 72 characters with an uppercase letter, a lowercase letter, a number and a special character",
      },
      { status: 400 }
    );
  }

  try {
    await db_connect();
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

    return NextResponse.json(
      {
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        },
      },
      {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      { status: 500 }
    );
  }
}
