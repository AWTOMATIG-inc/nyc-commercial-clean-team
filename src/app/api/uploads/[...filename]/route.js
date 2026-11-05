import fs from "fs";
import mime from "mime-types";
import { NextResponse } from "next/server";
import path from "path";

const UPLOAD_FOLDERS = ["blog", "feedback", "page", "user"];

export async function GET(req, context) {
  const { filename } = await context.params;
  const [subfolder, imagefile] = filename;

  // Only <known folder>/<file name>. Params arrive URL-decoded, so %2F and
  // %5C must be caught here.
  if (
    filename.length !== 2 ||
    !UPLOAD_FOLDERS.includes(subfolder) ||
    /[\\/\0]/.test(imagefile) ||
    imagefile === ".." ||
    imagefile === "."
  ) {
    return new NextResponse("File not found", { status: 404 });
  }

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
        "X-Content-Type-Options": "nosniff",
        // Older uploads may include SVG or HTML. This stops any script in them
        // from running on our domain. Images in <img> tags are unaffected.
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
