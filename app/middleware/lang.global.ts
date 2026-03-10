export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith("/admin")) {
    return;
  }

  const config = useRuntimeConfig();
  const languages = config.public.contentLanguages as string[];

  const firstSegment = to.path.split("/")[1];

  if (!firstSegment || !languages.includes(firstSegment)) {
    const defaultLang = languages[0];
    const newPath = `/${defaultLang}${to.path === "/" ? "" : to.path}`;
    return navigateTo(newPath, { redirectCode: 301 });
  }
});
