import ar from "../lang/ar";
import tr from "../lang/tr";

const langs: Record<string, Record<string, string>> = { ar, tr };

export const useT = () => {
  const route = useRoute();

  return (key: string): string => {
    const lang = (route.params.lang as string) ?? "en";
    return langs[lang]?.[key] ?? key;
  };
};
