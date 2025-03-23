import React from 'react';
import { useTranslation } from 'react-i18next';
import './HeroSlider.css';

const HeroSlider = () => {
  const { t } = useTranslation();

  return (
    <div className="hero-slider">
      <div className="slide active">
        <div className="slide-content">
          <h1>{t("Welcome to IRT University")}</h1>
          <p>{t("Excellence in Education, Innovation in Research")}</p>
          <a href="programs" className="cta-btn">
            {t("Explore Programs")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;