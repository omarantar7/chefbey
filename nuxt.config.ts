// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-mail"],
  css: ["@/assets/css/tailwind.css"],
  app: {
    baseURL: "/chefbey/",
    nitro: {
      preset: "github_pages",
    },
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
      ],
    },
  },
  devtools: { enabled: false },

  runtimeConfig: {
    mail: {
      message: {
        to: "omarantar520@gmail.com",
      },
      smtp: {
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: process.env.ETHEREAL_USER,
          pass: process.env.ETHEREAL_PASS,
        },
      },
    },
  },
});
