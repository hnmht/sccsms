import i18n, { ResourceLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import localData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getLanguage, setLanguage } from "../db/crud/lang";
// import dayjs local package
import "./locale/en-us";
import "./locale/zh-cn";
// import translation resource
import translationEnUS from "./translations/en-us.json";
import translationZhHans from "./translations/zh-cn.json"

dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localData);
dayjs.extend(utc);
dayjs.extend(timezone);

interface ScResource {
    [language: string]: {
        translation: ResourceLanguage;
        label: string
    }
}

export const resources: ScResource = {
    "en-US": {
        translation: translationEnUS,
        label: "English(United States)"
    },
    "zh-CN": {
        translation: translationZhHans,
        label: "简体中文"
    },
};

const detectorLanguage = () => {
    let lang = "en-US";
    // Check if the lang exists in the local database
    try {
        lang = getLanguage();
    } catch (err) {
        console.error(err);
    }
    // Check if the language is supported
    if (lang && Object.keys(resources).includes(lang)) {
        dayjs.locale(lang);
        return lang;
    } else {
        dayjs.locale("en-US");
        return "en-US";
    }
};

const lang = detectorLanguage();

i18n
    .use(initReactI18next)
    .init({
        lng: lang,
        fallbackLng: "en-US",
        resources: resources,
        supportedLngs: ["en-US", "zh-CN"],
        interpolation: {
            escapeValue: false,
        }
    });

i18n.on("languageChanged", (lng) => {
    // Set Locale
    setLanguage(lng);
    // Set Dayjs locale
    dayjs.locale(lng || 'en-US');
});

export { i18n, dayjs }; 