import { db_connect } from "@/database";
import { BlogModel } from "@/database/models/blogModel";
import { CommentModel } from "@/database/models/commentModel";
import { isEmail, isNonEmptyString, pickStrings } from "@/lib/sanitize";
import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function POST(request) {
  const formData = await request.formData();
  await db_connect();
  const { name, email, message, blogId } = pickStrings(
    Object.fromEntries(formData),
    ["name", "email", "message", "blogId"],
    5000,
  );
  if (
    !isNonEmptyString(name) ||
    !isEmail(email) ||
    !isNonEmptyString(message) ||
    !isValidObjectId(blogId)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    if (!(await BlogModel.exists({ _id: blogId }))) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const comment = await CommentModel.create({
      name,
      email,
      message,
      blog: blogId,
    });

    await BlogModel.findByIdAndUpdate(blogId, {
      $push: {
        comments: comment._id,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "comments creation failed" },
        { status: 500 },
      );
    }
   const paths = ["/", "/blogs", "/blog/" + blogId];

    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(comment, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
