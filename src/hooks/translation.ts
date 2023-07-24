import { I18n } from "i18n-js";

//Translation files import
import english from "../config/translations/english.json";

let i18n: any;

export function initializeTranslations(
  language_code: string,
  translations?: any
) {
  let formatted_translations;
  if (translations == undefined) {
    formatted_translations = {
      eng: english,
    };
  } else {
    formatted_translations = translations.reduce((r: any, language: any) => {
      //Remove line breaks
      r[language.code] = JSON.parse(
        language.translations.code.replace(/\r?\n|\r/g, "")
      ).reduce((l: any, translation: any) => {
        l[translation.name] = translation.value;
        return l;
      }, {});
      return r;
    }, {});
  }

  i18n = new I18n(formatted_translations);
  // Set the locale once at the beginning of your app.
  i18n.defaultLocale = "eng";
  i18n.locale = language_code;

  // When a value is missing from a language it'll fallback to another language with the key present.
  i18n.enableFallback = true;
  // To see the fallback mechanism uncomment line below to force app to use Japanese language.
  // i18n.locale = 'ja';
}

export function updateTranslation(language_code: string) {
  i18n.locale = language_code;
}

export function useTranslation() {
  if (i18n == undefined) {
    initializeTranslations("eng");
  }

  const translate = (value: string) => {
    if (i18n == undefined) {
      initializeTranslations("eng");
    }
    return i18n.t(value);
  };

  return {
    translate,
    i18n,
  };
}
