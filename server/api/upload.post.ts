import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    const filePart = formData?.find((p) => p.name === "file");
    console.log("filePart:", filePart?.filename, filePart?.data?.length);

    if (!filePart || !filePart.data || !filePart.filename) {
      throw createError({ statusCode: 400, message: "No file provided" });
    }

    const ext = extname(filePart.filename) || ".jpg";
    const name = `${Date.now()}${ext}`;

    // Check if .output/public exists (production/docker)
    // otherwise fall back to public/ (local dev)
    const outputPublic = join(process.cwd(), ".output/public/uploads");
    const devPublic = join(process.cwd(), "public/uploads");
    const uploadDir = existsSync(join(process.cwd(), ".output/public"))
      ? outputPublic
      : devPublic;

    console.log("saving to:", uploadDir);

    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    writeFileSync(join(uploadDir, name), filePart.data);

    console.log("✅ File saved:", name);

    return {
      name: filePart.filename,
      url: `/uploads/${name}`,
    };
  } catch (e) {
    console.error("❌ Upload error on server:", e);
    throw e;
  }
});