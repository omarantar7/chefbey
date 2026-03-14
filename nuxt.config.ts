import env from "./lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@pinia/nuxt", "nuxt-mail", "@nuxt/icon", "@nuxt/ui"],
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
  devtools: { enabled: true },

  runtimeConfig: {
    mail: {
      message: {
        to: env.RECIEVED_Email,
      },
      smtp: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: env.RESEND_API_KEY,
        },
      },
    },
    public: {
      contentLanguages: (process.env.CONTENT_LANGUAGES ?? "en")
        .split(",")
        .map((l) => l.trim()),
      baseUrl: env.BASE_URL,
      recieverEmail: env.RECIEVED_Email,
    },
    db_file_name: env.NUXT_DB_FILE_NAME,
  },
});
