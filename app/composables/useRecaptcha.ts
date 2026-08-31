import { useDataset } from "~~/lib/dataset";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA script"));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export const useRecaptcha = () => {
  const { recaptchaSecretKey: siteKey } = useDataset();

  const isReady = ref(false);

  const init = async () => {
    if (!siteKey) {
      throw new Error("reCAPTCHA site key is missing from runtime config");
    }
    await loadRecaptchaScript(siteKey as string);
    await new Promise<void>((resolve) => {
      window.grecaptcha.ready(() => resolve());
    });
    isReady.value = true;
  };

  const execute = async (action: string): Promise<string> => {
    if (!isReady.value) {
      await init();
    }
    if (!siteKey) {
      throw new Error("reCAPTCHA site key is missing from runtime config");
    }
    return window.grecaptcha.execute(siteKey as string, { action });
  };

  return {
    isReady,
    init,
    execute,
  };
};
