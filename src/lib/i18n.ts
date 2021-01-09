import I18n from "i18n-js";

// i18n-translate-json AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw src/locales/ en fr,es,ja,ko,zh,da,nl,fi,de,hi,id,ga,it,lt,ms,no,pl,pt,ro,ru,sl,sv,th,vi,cy
// https://github.com/meedan/i18n-translate-json

//I18n.fallbacks = true;

I18n.translations = {
	en: require("../locales/en.json"),
	fr: require("../locales/fr.json"),
	es: require("../locales/es.json"),
	ja: require("../locales/ja.json"),
	ko: require("../locales/ko.json"),
	zh: require("../locales/zh.json"),
	da: require("../locales/da.json"),
	nl: require("../locales/nl.json"),
	fi: require("../locales/fi.json"),
	de: require("../locales/de.json"),
	hi: require("../locales/hi.json"),
	id: require("../locales/id.json"),
	ga: require("../locales/ga.json"),
	it: require("../locales/it.json"),
	lt: require("../locales/lt.json"),
	ms: require("../locales/ms.json"),
	no: require("../locales/no.json"),
	pl: require("../locales/pl.json"),
	pt: require("../locales/pt.json"),
	ro: require("../locales/ro.json"),
	ru: require("../locales/ru.json"),
	sl: require("../locales/sl.json"),
	sv: require("../locales/sv.json"),
	th: require("../locales/th.json"),
	vi: require("../locales/vi.json"),
	cy: require("../locales/cy.json"),
};

export default I18n;
