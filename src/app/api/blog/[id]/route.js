import { db_connect } from "@/database";
import { BlogModel } from "@/database/models/blogModel";
import { UserModel } from "@/database/models/userModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader } from "@/lib/fileuploader";
import { makeSlug } from "@/utility/makeSlug";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function GET(request, context) {
  const { id } = await context.params;
  console.log(UserModel);
  try {
    await db_connect();
    const blogs = await BlogModel.findById(id).populate("author");

    if (!blogs) {
      return new NextResponse("blogs not found", { status: 404 });
    }

    return NextResponse.json(blogs, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json("something went wrong", { status: 500 });
  }
}
export async function DELETE(request, context) {
  const { id } = await context.params;
  console.log(UserModel);

  try {
    await db_connect();
    const deleteBlog = await BlogModel.findByIdAndDelete(id);
    if (!deleteBlog) {
      return new NextResponse(
        { error: "blog deletion failed" },
        { status: 500 },
      );
    }
    deleteFile("blog", deleteBlog.image);
    const paths = ["/", "/blogs","/blog/" + deleteBlog.slug];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "blog deleted successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
export async function PUT(request, context) {
  const { id } = await context.params;
  const formData = await request.formData();
  const { image, title, content, existingImage } = Object.fromEntries(formData);
  if (
    !formData.has("title") ||
    !formData.has("content") ||
    (!formData.has("image") && !existingImage)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  let blogData;
  try {
    const slug = makeSlug(title);
    const isExistSlug = await BlogModel.find({ slug });
    if (image) {
      const filename = await fileuploader(image, "blog");
      blogData = {
        title,
        slug: isExistSlug.length > 0 ? slug + "-" + isExistSlug.length : slug,
        content,
        image: filename,
      };
    } else {
      blogData = {
        title,
        slug: isExistSlug.length > 0 ? slug + "-" + isExistSlug.length : slug,
        content,
        image: existingImage,
      };
    }

    await db_connect();
    const editBlog = await BlogModel.findByIdAndUpdate(id, blogData);
    if (!editBlog) {
      return new NextResponse(
        { error: "blog deletion failed" },
        { status: 500 },
      );
    }
    if (image) {
      deleteFile("blog", existingImage);
    }
    const paths = ["/", "/blogs"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "blog updated successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
