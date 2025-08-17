import ar from "./locales/ar";
import bn from "./locales/bn";
import en from "./locales/en";
import es from "./locales/es";
import hi from "./locales/hi";
import ja from "./locales/ja";
import pt_br from "./locales/pt_br";
import zh from "./locales/zh";
import zh_Hant from "./locales/zh_Hant";
import vn from "./locales/vn";

// You can use `defineI18nConfig` to get type inferences for options to pass to vue-i18n.
export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "en",
    messages: {
      ar,
      bn,
      en,
      es,
      hi,
      ja,
      pt_br,
      zh,
      zh_Hant,
      vn,
    },
  };
});
