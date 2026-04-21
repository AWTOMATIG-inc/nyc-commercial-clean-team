import { UserModel } from "@/database/models/userModel";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  try {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tokenUser = await verifyToken(token);

    if (!tokenUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await UserModel.findById(tokenUser.id);
    return NextResponse.json(
      {
        user: {
          email: user?.email,
          name: user?.name,
          role: user?.role,
          avatar: user?.avatar,
          id: user?._id,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      {
        status: 500,
      }
    );
  }
}
