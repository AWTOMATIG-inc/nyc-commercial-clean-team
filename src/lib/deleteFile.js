import fs from "fs";
import path from "path";
export const deleteFile = (folder, filename) => {
  // Some filenames come from the request body, so never follow a path.
  if (typeof filename !== "string" || /[\\/]/.test(filename) || filename === "..") {
    return false;
  }
  const filePath = path.join(process.cwd(), "uploads", folder, filename);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  fs.unlinkSync(filePath);
  return true;
};
