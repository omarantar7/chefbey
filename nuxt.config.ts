import env from "./lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxt/ui",
    "v-gsap-nuxt",
    "@nuxtjs/sitemap",
  ],
  site: {
    url: env.BETTER_AUTH_URL,
    name: "Chefbey",
  },
  sitemap: {
    exclude: ["/admin/**"],
    urls: async () => {
      if (env.BUN_ENV !== "production") return [];

      const languages = (process.env.CONTENT_LANGUAGES ?? "en")
        .split(",")
        .map((l) => l.trim());

      const staticUrls = languages.flatMap((lang) => [
        { loc: `/${lang}` },
        { loc: `/${lang}/recipes` },
      ]);

      try {
        const response = await fetch(
          `${env.BETTER_AUTH_URL}/api/page/contents/recipes`,
        );
        if (!response.ok) return staticUrls;
        const recipes = (await response.json()) as any[];

        const recipeUrls = recipes.flatMap((recipe: any) =>
          languages.map((lang) => ({
            loc: `/${lang}/recipes/${recipe.id}`,
            lastmod: new Date().toISOString(),
          })),
        );

        return [...staticUrls, ...recipeUrls];
      } catch {
        return staticUrls;
      }
    },
  },
  css: ["@/assets/css/tailwind.css"],
  app: {
    baseURL: env.BASE_URL,
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Allura&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favIcon/favicon-96x96.png",
          sizes: "96x96",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favIcon/favicon.svg" },
        { rel: "shortcut icon", href: "/favIcon/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favIcon/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/favIcon/site.webmanifest" },
      ],
    },
  },
  devtools: {
    enabled: env?.BUN_ENV === "development",
  },
  runtimeConfig: {
    public: {
      contentLanguages: (process.env.CONTENT_LANGUAGES ?? "en")
        .split(",")
        .map((l) => l.trim()),
      baseUrl: env.BASE_URL,
      recieverEmail: env.RECIEVED_Email,
      gaId: env.NUXT_PUBLIC_GA_ID ?? "",
    },
    db_file_name: env.NUXT_DB_FILE_NAME,
  },
});
