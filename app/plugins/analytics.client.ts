export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const gaId = config.public.gaId;
  if (!gaId) return;

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
        async: true,
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `,
      },
    ],
  });

  const router = useRouter();
  router.afterEach((to) => {
    if (to.path.startsWith("/admin")) return;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: to.fullPath,
      });
    }
  });
});