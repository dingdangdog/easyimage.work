import en from "./locales/en";
import es from "./locales/es";
import zh from "./locales/zh";
import ja from "./locales/ja";
import ar from "./locales/ar";
import hi from "./locales/hi";
import pt_br from "./locales/pt_br";
import zh_Hant from "./locales/zh_Hant";

// You can use `defineI18nConfig` to get type inferences for options to pass to vue-i18n.
export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "en",
    messages: {
      en,
      es,
      zh,
      ja,
      ar,
      hi,
      pt_br,
      zh_Hant,
    },
  };
});
