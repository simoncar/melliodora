import I18n from "i18n-js";

import * as Localization from "expo-localization";

I18n.fallbacks = true;

I18n.translations = {
  en: require("../locales/en.json"),
  fr: require("../locales/fr.json"),
};

I18n.locale = Localization.locale;

export default I18n;
