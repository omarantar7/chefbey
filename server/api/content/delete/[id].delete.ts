import { contentService } from "~~/server/services/ContentService";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) throw createError({ status: 400, message: "Invalid ID" });

  return contentService.delete(id);
});