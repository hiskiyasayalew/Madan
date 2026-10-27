"use client";

import { useLanguage } from "../app/context/LanguageContext";
import { translations } from "../app/lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  return translations[language];
}