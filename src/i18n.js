import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Save language and direction to localStorage
const saveLanguageAndDirection = (lang) => {
  localStorage.setItem('language', lang);
  localStorage.setItem('direction', lang === 'ar' ? 'rtl' : 'ltr');
};

// Load language and direction from localStorage
const loadLanguageAndDirection = () => {
  const savedLanguage = localStorage.getItem('language') || 'en';
  const savedDirection = localStorage.getItem('direction') || 'ltr';
  document.documentElement.dir = savedDirection; // Set the direction on the HTML element
  return savedLanguage;
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to your translation files
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
    lng: loadLanguageAndDirection(), // Load the saved language
  });

// Listen for language changes
i18n.on('languageChanged', (lang) => {
  saveLanguageAndDirection(lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; // Update direction on language change
});

export default i18n;