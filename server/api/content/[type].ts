import { contentService } from "~~/server/services/ContentService";

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, "type")!;

  if (event.method === "GET") {
    return contentService.get(type);
  }

  if (event.method === "PUT") {
    const body = await readBody<{
      type: "settings" | "local";
      language?: string;
      attrs: Record<string, any>;
    }>(event);
    return contentService.update(type, body);
  }

  throw createError({ status: 405, message: "Method not allowed" });
});
