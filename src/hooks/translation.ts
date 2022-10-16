import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

//Translation files import
import english from "../config/translations/english.json";
import korean from "../config/translations/korean.json";
import french from "../config/translations/french.json";

let i18n: I18n;

export function initializeTranslations(language_code: string) {
  const translations = {
    en: english,
    kr: korean,
    fr: french,
  };

  i18n = new I18n(translations);
  // Set the locale once at the beginning of your app.
  i18n.defaultLocale = "en";
  i18n.locale = language_code;

  // When a value is missing from a language it'll fallback to another language with the key present.
  i18n.enableFallback = true;
  // To see the fallback mechanism uncomment line below to force app to use Japanese language.
  // i18n.locale = 'ja';
}

export function useTranslation() {
  return i18n;
}
