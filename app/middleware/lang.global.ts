export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith("/admin")) return;
  if (to.path.startsWith("/uploads")) return;

  const config = useRuntimeConfig();
  const languages = config.public.contentLanguages as string[];

  const firstSegment = to.path.split("/")[1];

  if (!firstSegment || !languages.includes(firstSegment)) {
    const defaultLang = languages[0];

    const pathWithoutLang = languages.some((lang) =>
      to.path.startsWith(`/${lang}`),
    )
      ? to.path.replace(/^\/[^/]+/, "")
      : to.path;

    const newPath = `/${defaultLang}${pathWithoutLang === "/" ? "" : pathWithoutLang || ""}`;
    return navigateTo(newPath, { redirectCode: 301 });
  }
});
