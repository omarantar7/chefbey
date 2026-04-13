export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith("/admin")) return;
  if (to.path.startsWith("/uploads")) return;

  const config = useRuntimeConfig();
  const raw = config.public.contentLanguages as string | string[];
  const languages = Array.isArray(raw) ? raw : raw.split(",").map(l => l.trim());

  const firstSegment = to.path.split("/")[1];

  console.log("middleware - path:", to.path);
  console.log("middleware - firstSegment:", firstSegment);
  console.log("middleware - languages:", languages);
  console.log("middleware - includes:", languages.includes(firstSegment as any));

  if (!firstSegment || !languages.includes(firstSegment)) {
    const defaultLang = languages[0];
    const newPath = `/${defaultLang}${to.path === "/" ? "" : to.path}`;
    return navigateTo(newPath, { redirectCode: 301 });
  }
});