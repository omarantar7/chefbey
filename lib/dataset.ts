export const useDataset = () => {
  const config = useRuntimeConfig();

  return {
    contentLanguages: config.public.contentLanguages,
    recaptchaSecretKey: config.public.recaptchaSitetKey,
  };
};
