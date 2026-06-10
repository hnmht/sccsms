import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import localData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
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

const resources = {
    "en-US": {
        translation: translationEnUS,
    },
    "zh-CN": {
        translation: translationZhHans
    },
};

const detectorLanguage = () => {
    // Check if the item "sccsmsLanguage" exists in localStorage
    let lang = "en-US";
    try {
        lang = localStorage.getItem("sccsmsLanguage");
    } catch (err) {
        console.error(err);
    }
    // Check if the language is supported
    if (lang && Object.keys(resources).includes(lang)) {
        dayjs.locale(lang);
        return lang;
    } else {
        // Get the browser language  
        const browserLang = navigator.language;       
        if (Object.keys(resources).includes(browserLang)) {
            dayjs.locale(browserLang);
            return browserLang;
        }
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
        },
        // detection: {
        //     orderBy: ["localStorage", "navigator"],
        //     caches: ["localStorage"]
        // }
    });

i18n.on("languageChanged", (lng) => {
    localStorage.setItem("sccsmsLanguage", lng);
    dayjs.locale(lng || 'en-US');
});

export { i18n, dayjs };