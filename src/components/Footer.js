import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './footer.css'; // Import the CSS file

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-center">
          <p className="footer-title">{t("footer.universityName")}</p>
          <p className="footer-email">{t("footer.email")}</p>
          <div className="footer-social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61552388491083"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.facebookAriaLabel")}
            >
              <FaFacebook className="footer-social-icon" />
            </a>
            <a
              href="https://www.instagram.com/irt.2026/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.instagramAriaLabel")}
            >
              <FaInstagram className="footer-social-icon" />
            </a>
            <a
              href="https://www.linkedin.com/company/irt-university/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.linkedinAriaLabel")}
            >
              <FaLinkedin className="footer-social-icon" />
            </a>
          </div>
          <p className="footer-copyright">
            © 2025 {t("footer.universityName")}. {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;