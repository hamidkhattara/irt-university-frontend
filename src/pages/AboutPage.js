import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-gray-900 min-h-screen" dir={t("dir")}>
      <Navbar />
      <section className="bg-blue-900 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold">{t("about.heroTitle")}</h1>
        <p className="mt-6 text-xl max-w-2xl mx-auto">{t("about.heroSubtitle")}</p>
      </section>
      <section className="container mx-auto px-8 py-16 text-center">
        <h2 className="text-4xl font-bold text-blue-900">{t("about.definitionTitle")}</h2>
        <p className="text-lg text-gray-700 mt-4 max-w-4xl mx-auto leading-relaxed">
          {t("about.definitionContent")}
        </p>
      </section>
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-blue-900">{t("about.missionVisionTitle")}</h2>
          <div className="flex flex-col md:flex-row gap-12 justify-center mt-8">
            <div className="bg-white shadow-lg p-8 rounded-lg w-full md:w-1/2">
              <h3 className="text-2xl font-semibold text-blue-900">{t("about.missionTitle")}</h3>
              <p className="text-gray-700 mt-4 leading-relaxed">
                {t("about.missionContent")}
              </p>
            </div>
            <div className="bg-white shadow-lg p-8 rounded-lg w-full md:w-1/2">
              <h3 className="text-2xl font-semibold text-blue-900">{t("about.visionTitle")}</h3>
              <p className="text-gray-700 mt-4 leading-relaxed">
                {t("about.visionContent")}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-8 py-16 text-center">
        <h2 className="text-4xl font-bold text-blue-900">{t("about.valuesTitle")}</h2>
        <div className="flex flex-col md:flex-row gap-12 justify-center mt-8">
          <div className="bg-white shadow-lg p-8 rounded-lg w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900">{t("about.value1Title")}</h3>
            <p className="text-gray-700 mt-4 leading-relaxed">{t("about.value1Content")}</p>
          </div>
          <div className="bg-white shadow-lg p-8 rounded-lg w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900">{t("about.value2Title")}</h3>
            <p className="text-gray-700 mt-4 leading-relaxed">{t("about.value2Content")}</p>
          </div>
          <div className="bg-white shadow-lg p-8 rounded-lg w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900">{t("about.value3Title")}</h3>
            <p className="text-gray-700 mt-4 leading-relaxed">{t("about.value3Content")}</p>
          </div>
        </div>
      </section>
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-4xl font-bold text-blue-900">{t("about.teamTitle")}</h2>
        <p className="mt-6 text-lg max-w-4xl mx-auto leading-relaxed">
          {t("about.teamContent")}
        </p>
      </section>
      <section className="container mx-auto px-8 py-16 text-center">
        <h2 className="text-4xl font-bold text-blue-900">{t("about.historyTitle")}</h2>
        <p className="text-lg text-gray-700 mt-4 max-w-4xl mx-auto leading-relaxed">
          {t("about.historyContent")}
        </p>
      </section>
      <section className="bg-blue-900 text-white py-16 text-center">
        <h2 className="text-4xl font-bold">{t("about.contactTitle")}</h2>
        <p className="mt-6 text-lg">{t("about.contactAddress")}</p>
        <p className="mt-2 text-lg">{t("about.contactDetails")}</p>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;