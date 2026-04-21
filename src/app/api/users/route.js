import { db_connect } from "@/database";
import { UserModel } from "@/database/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await db_connect();
    const userData = await UserModel.find().select("-password -__v").lean();
    if (!userData) {
      return NextResponse.json({ error: "user fetch failed" }, { status: 500 });
    }

    return NextResponse.json(userData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
