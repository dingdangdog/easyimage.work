import en from "./locales/en";
import zh from "./locales/zh";
import ja from "./locales/ja";

// You can use `defineI18nConfig` to get type inferences for options to pass to vue-i18n.
export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "en",
    messages: {
      en,
      zh,
      ja,
    },
  };
});
