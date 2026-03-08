import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";
import env from "~~/lib/env";

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

    const uploadDir = join(process.cwd(), "public/uploads");
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    writeFileSync(join(uploadDir, name), filePart.data);

    console.log("✅ File saved:", name);

    return {
      name: filePart?.filename,
      url: env.BASE_URL ? `${env.BASE_URL}uploads/${name}` : `/uploads/${name}`,
    };
  } catch (e) {
    console.error("❌ Upload error on server:", e);
    throw e;
  }
});
