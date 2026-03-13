// server/routes/uploads/[filename].get.ts
import { createReadStream, existsSync } from "fs";
import { join, extname } from "path";

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, "filename")!;
  const isProd = existsSync(join(process.cwd(), ".output"));
  const uploadDir = isProd
    ? join(process.cwd(), ".output/public/uploads")
    : join(process.cwd(), "public/uploads");

  const filepath = join(uploadDir, filename);

  if (!existsSync(filepath)) {
    throw createError({ statusCode: 404, message: "File not found" });
  }

  const ext = extname(filename).toLowerCase();
  const mimeType = mimeTypes[ext] ?? "application/octet-stream";

  setHeader(event, "Content-Type", mimeType);
  setHeader(event, "Cache-Control", "public, max-age=2592000");

  return sendStream(event, createReadStream(filepath));
});
