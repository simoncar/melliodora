import I18n from "i18n-js";
import * as Localization from "expo-localization";

// i18n-translate-json apiKey js/locales/ en fr,es,ja,ko,zh
// https://github.com/meedan/i18n-translate-json

I18n.fallbacks = true;

I18n.translations = {
  en: require("../locales/en.json"),
  fr: require("../locales/fr.json"),
  es: require("../locales/es.json"),
  ja: require("../locales/ja.json"),
  ko: require("../locales/ko.json"),
  zh: require("../locales/zh.json"),
};

I18n.locale = Localization.locale;

export default I18n;
