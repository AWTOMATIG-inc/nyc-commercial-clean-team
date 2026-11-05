import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Stays under Next's 10 MB proxy body limit, which cuts off larger requests.
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const UPLOAD_ERROR = "Upload a JPG, PNG, WebP, GIF or AVIF image up to 8 MB";

// Checks the file's real bytes. The browser-sent name and type can't be trusted.
function detectImageExtension(buffer) {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return ".jpg";
  if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return ".png";
  if (buffer.toString("latin1", 0, 4) === "GIF8") return ".gif";
  if (
    buffer.toString("latin1", 0, 4) === "RIFF" &&
    buffer.toString("latin1", 8, 12) === "WEBP"
  ) {
    return ".webp";
  }
  if (buffer.toString("latin1", 4, 12) === "ftypavif") return ".avif";
  return null;
}

// Returns the saved filename, or null when the file isn't an allowed image.
export const fileuploader = async (file, folder) => {
  if (typeof file?.arrayBuffer !== "function" || file.size > MAX_FILE_SIZE) {
    return null;
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = detectImageExtension(buffer);
  if (!extension) {
    return null;
  }
  const uploadsDir = path.join(process.cwd(), "uploads", folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filename = uuidv4() + extension;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);
  return filename;
};
