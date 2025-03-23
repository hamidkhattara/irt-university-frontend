// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded ${i18n.language === "en" ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-800"}`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className={`px-3 py-1 rounded ${i18n.language === "ar" ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-800"}`}
      >
        ع
      </button>
    </div>
  );
};

export default LanguageSwitcher;
