import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-blue-950 text-white py-8 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-lg md:text-xl font-semibold mb-2">{t("footer.universityName")}</p>
          <p className="text-sm md:text-base">{t("footer.email")}</p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://www.facebook.com/profile.php?id=61552388491083"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition duration-200"
              aria-label={t("footer.facebookAriaLabel")}
            >
              <FaFacebook className="text-xl md:text-2xl" />
            </a>
            <a
              href="https://www.instagram.com/irt.2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition duration-200"
              aria-label={t("footer.instagramAriaLabel")}
            >
              <FaInstagram className="text-xl md:text-2xl" />
            </a>
            <a
              href="https://www.linkedin.com/company/irt-university/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition duration-200"
              aria-label={t("footer.linkedinAriaLabel")}
            >
              <FaLinkedin className="text-xl md:text-2xl" />
            </a>
          </div>
          <p className="mt-4 text-xs md:text-sm">
            © 2025 {t("footer.universityName")}. {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;