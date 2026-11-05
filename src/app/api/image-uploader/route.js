import { db_connect } from "@/database";
import { ImageModel } from "@/database/models/imageModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader, UPLOAD_ERROR } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  await db_connect();
  if (!formData.has("image")) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const image = formData.get("image");
    const filename = await fileuploader(image, "page");
    if (!filename) {
      return NextResponse.json(
        { error: UPLOAD_ERROR },
        { status: 400 },
      );
    }

    const imageData = await ImageModel.create({
      image: filename,
    });

    if (!imageData) {
      return NextResponse.json(
        { error: "image creation failed" },
        { status: 500 },
      );
    }
    const paths = ["/"];

    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(imageData, {
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

export async function GET(request) {
  try {
    await db_connect();
    const images = await ImageModel.find().sort({ createdAt: -1 });
    return NextResponse.json(images, {
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

export async function DELETE(request) {
  const formData = await request.formData();
  if (!formData.has("image")) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const image = formData.get("image");
    await db_connect();
    const deleteImage = await ImageModel.findOneAndDelete({ image:image });
    console.log(deleteImage)
    if (!deleteImage) {
      return new NextResponse(
        { error: "Image deletion failed" },
        { status: 500 },
      );
    }
    deleteFile("page", deleteImage.image);
    const paths = ["/","/dashboard/pages"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "image deleted successfully" },
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
