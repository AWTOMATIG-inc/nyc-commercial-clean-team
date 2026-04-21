import { db_connect } from "@/database";
import { BlogModel } from "@/database/models/blogModel";
import { UserModel } from "@/database/models/userModel";
import { NextResponse } from "next/server";
export async function GET(request, context) {
  const { id } = await context.params;
  console.log(UserModel);
  try {
    await db_connect();
    const user = await UserModel.findById(id);
    if (!user) {
      return new NextResponse({ error: "user not found" }, { status: 404 });
    }
    const blogs = await BlogModel.find({
      author: id,
    });

    if (!blogs) {
      return new NextResponse({ error: "blogs not found" }, { status: 404 });
    }

    return NextResponse.json(
      { user, blogs },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
