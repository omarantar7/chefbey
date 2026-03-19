import { useDataset } from "~~/lib/dataset";

export const useContent = (type: string) => {
  const languages = useDataset()?.contentLanguages;

  const currentLang = useState("lang", () => languages[0]);

  const { data, refresh } = useFetch(`/api/public/${type}`, {
    query: { lang: currentLang },
    watch: [currentLang],
  });

  return { data, languages, currentLang, refresh };
};
