<script setup lang="ts">
const route = useRoute();

const { data }: any = await useFetch("/api/page/contactUs", {
  params: { lang: route.params.lang },
});

const settings: any = computed(() => data.value?.settings ?? {});
const local: any = computed(() => data.value?.local ?? {});

const contactUs = computed(() => {
  return {
    title: local.value?.title,
    description: local.value?.description,
    bgHeroImage: settings.value?.bgHeroImage,
  };
});

const seoData: any = computed(() => data.value?.seo ?? {});
useSeoMeta({
  title: () => seoData.value?.title,
  description: () => seoData.value?.description,
  keywords: () => seoData.value?.keywords,
  robots: () => seoData.value?.robots,
  ogUrl: () => seoData.value?.canonicalUrl,

  ogTitle: () => seoData.value?.ogTitle,
  ogDescription: () => seoData.value?.ogDescription,
  ogImage: () => seoData.value?.ogImage ?? "/logo.png",

  twitterTitle: () => seoData.value?.twitterTitle,
  twitterDescription: () => seoData.value?.twitterDescription,
  twitterImage: () => seoData.value?.twitterImage ?? "/logo.png",
  twitterCard: "summary_large_image",
});
useHead({
  link: [{ rel: "canonical", href: () => seoData.value?.canonicalUrl ?? "" }],
});
</script>

<template>
  <div v-gsap.from="{ opacity: 0, y: 60, duration: 1, ease: 'power3.out' }">
    <LazyCommonHero :data="contactUs" btnContent="Send Message" />
    <section
      class="relative z-20 bg-white -mt-23 md:-mt-30 w-[95%] md:max-w-6xl py-9 px-8 md:px-28 mx-auto rounded-[16px] shadow-[0px_19px_52.4px_4px_rgba(0,0,0,0.25)] mb-16"
    >
      <div
        class="flex flex-col gap-1 text-black justify-center items-center max-w-2xl text-center mx-auto"
      >
        <h1 class="text-3xl md:text-[42px] font-bold">{{ local?.subTitle }}</h1>
        <p class="text-[#747474] text-sm md:text-xl font-bold mt-1.5 mb-10">
          {{ local?.subDescription }}
        </p>
      </div>
      <ContactForm />
    </section>
  </div>
</template>
