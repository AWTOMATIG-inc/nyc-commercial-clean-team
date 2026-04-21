import { db_connect } from "@/database";
import { UserModel } from "@/database/models/userModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader } from "@/lib/fileuploader";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  const { id } = await context.params;
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  let updatedData;
  try {
    await db_connect();
    if (formData.has("avatar")) {
      const filename = await fileuploader(body.avatar, "user");
      updatedData = { ...body, avatar: filename };
    } else if (formData.has("role") && body?.role == "admin") {
      const isExistUser = await UserModel.find({ role: "admin" });
      if (isExistUser.length >= 5) {
        return NextResponse.json(
          { error: "Maximum of 5 admin accounts allowed" },
          { status: 400 }
        );
      } else {
        updatedData = { ...body };
      }
    } else {
      updatedData = { ...body };
    }
    const userData = await UserModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    })
      .select("-password -__v")
      .lean();

    if (!userData) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    if (formData.has("avatar") && formData.has("oldAvatar")) {
      deleteFile("user", body.oldAvatar);
    }
    return NextResponse.json(
      { message: "User updated successfully" },
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
export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const userData = await UserModel.findByIdAndDelete(id);
    if (!userData) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "user deleted successfully" },
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
