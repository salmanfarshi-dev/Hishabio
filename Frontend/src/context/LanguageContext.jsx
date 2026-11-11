import { createContext, useContext, useEffect, useState } from "react";
import translations from "../utils/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("hishabio-language") || "en",
  );

  useEffect(() => {
    localStorage.setItem("hishabio-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "bn" : "en"));
  };

  const t = (key) => translations[language]?.[key] ?? key;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
