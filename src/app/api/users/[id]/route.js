import { db_connect } from "@/database";
import { UserModel } from "@/database/models/userModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader, UPLOAD_ERROR } from "@/lib/fileuploader";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

const USER_ROLES = ["admin", "user"];
const MAX_ADMINS = 5;

// Email and password can't be changed here. A role change has to arrive on
// its own, from a different admin, so it can't slip in with a profile edit.
export async function PUT(request, context) {
  const { id } = await context.params;
  const token = request.cookies.get("token")?.value;
  const admin = token ? await verifyToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const updatedData = {};
  const hasRole = formData.has("role");
  const hasName = formData.has("name");
  const hasAvatar = formData.has("avatar");
  try {
    await db_connect();

    if (hasRole) {
      if (hasName || hasAvatar) {
        return NextResponse.json(
          { error: "Change the role in a separate request" },
          { status: 409 }
        );
      }
      const role = formData.get("role");
      if (!USER_ROLES.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 422 });
      }
      if (id === admin.id) {
        return NextResponse.json(
          { error: "You can't change your own role" },
          { status: 409 }
        );
      }
      const target = await UserModel.findById(id).select("role").lean();
      if (!target) {
        return NextResponse.json({ error: "user not found" }, { status: 404 });
      }
      if (role === "admin" && target.role !== "admin") {
        const adminCount = await UserModel.countDocuments({ role: "admin" });
        if (adminCount >= MAX_ADMINS) {
          return NextResponse.json(
            { error: "Maximum of 5 admin accounts allowed" },
            { status: 400 }
          );
        }
      }
      updatedData.role = role;
    }

    if (hasName) {
      const name = formData.get("name");
      if (typeof name !== "string" || name.trim().length < 3 || name.length > 100) {
        return NextResponse.json({ error: "Invalid name" }, { status: 422 });
      }
      updatedData.name = name.trim();
    }

    if (hasAvatar) {
      const filename = await fileuploader(formData.get("avatar"), "user");
      if (!filename) {
        return NextResponse.json({ error: UPLOAD_ERROR }, { status: 400 });
      }
      updatedData.avatar = filename;
    }

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
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

    if (hasAvatar && formData.has("oldAvatar")) {
      deleteFile("user", formData.get("oldAvatar"));
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
