import fs from "fs";
import mime from "mime-types";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req, context) {
  const { filename } = await context.params;
  const subfolder = filename[0];
  const imagefile = filename[1];
  const filePath = path.join(process.cwd(), "uploads", subfolder, imagefile);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
