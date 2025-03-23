import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/irt-logo.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdown, setDropdown] = useState(null);

  // Handle language switch
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    document.documentElement.dir = selectedLang === 'ar' ? 'rtl' : 'ltr';
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Handle dropdown toggle
  const toggleDropdown = (page) => {
    setDropdown(dropdown === page ? null : page);
  };

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to section after navigation
  useEffect(() => {
    const hash = location.hash; // Get the hash from the URL (e.g., "#latest-research")
    if (hash) {
      // Wait for the page to render before scrolling
      setTimeout(() => {
        const sectionId = hash.replace('#', ''); // Remove the "#" to get the section ID
        scrollToSection(sectionId); // Scroll to the section
      }, 100); // Small delay to ensure the page has rendered
    }
  }, [location]); // Run this effect whenever the location changes

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="IRT University Logo" className="logo-image" />
          <span className="logo-text">{t("IRT University")}</span>
        </Link>
      </div>

      {/* Menu */}
      <ul className="navbar-menu">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            {t("Home")}
          </Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            {t("About")}
          </Link>
        </li>
        <li
          onMouseEnter={() => toggleDropdown('programs')}
          onMouseLeave={() => toggleDropdown(null)}
        >
          <Link
            to="/programs-initiatives"
            className={location.pathname === '/programs-initiatives' ? 'active' : ''}
          >
            {t("Programs & Initiatives")}
          </Link>
          {dropdown === 'programs' && (
            <ul className="dropdown-menu">
              <li onClick={() => navigate('/programs-initiatives#innovation-labs')}>
                {t("Innovation labs")}
              </li>
              <li onClick={() => navigate('/programs-initiatives#technology-incubation')}>
                {t("Technology incubation programs")}
              </li>
              <li onClick={() => navigate('/programs-initiatives#research-funding')}>
                {t("Research funding opportunities")}
              </li>
            </ul>
          )}
        </li>
        <li
          onMouseEnter={() => toggleDropdown('research')}
          onMouseLeave={() => toggleDropdown(null)}
        >
          <Link
            to="/research"
            className={location.pathname === '/research' ? 'active' : ''}
          >
            {t("Research & Insights")}
          </Link>
          {dropdown === 'research' && (
            <ul className="dropdown-menu">
              <li onClick={() => navigate('/research#latest-research')}>
                {t("Latest research publications")}
              </li>
              <li onClick={() => navigate('/research#ongoing-projects')}>
                {t("Ongoing projects")}
              </li>
              <li onClick={() => navigate('/research#collaborations')}>
                {t("Collaborations and partnerships")}
              </li>
            </ul>
          )}
        </li>
        <li
          onMouseEnter={() => toggleDropdown('news')}
          onMouseLeave={() => toggleDropdown(null)}
        >
          <Link
            to="/news-events"
            className={location.pathname === '/news-events' ? 'active' : ''}
          >
            {t("News & Events")}
          </Link>
          {dropdown === 'news' && (
            <ul className="dropdown-menu">
              <li onClick={() => navigate('/news-events#upcoming-events')}>
                {t("Upcoming and past events")}
              </li>
              <li onClick={() => navigate('/news-events#webinars')}>
                {t("Webinars and workshops")}
              </li>
              <li onClick={() => navigate('/news-events#press-releases')}>
                {t("Press releases")}
              </li>
              <li onClick={() => navigate('/news-events#announcements')}>
                {t("Announcements")}
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            {t("Contact")}
          </Link>
        </li>
        {user?.role === 'admin' && (
          <li>
            <Link to="/admin/posts" className={location.pathname === '/admin/posts' ? 'active' : ''}>
              {t("Admin Panel")}
            </Link>
          </li>
        )}
      </ul>

      {/* Language Switcher + Auth Buttons */}
      <div className="navbar-icons">
        <select
          className="language-switcher"
          onChange={handleLanguageChange}
          value={i18n.language}
        >
          <option value="en">🇬🇧 English</option>
          <option value="ar">🇩🇿 Arabic</option>
        </select>

        {!user ? (
          <>
            <button
              className="login-btn register-btn"
              onClick={() => navigate('/register')}
            >
              {t("Register")}
            </button>
            <button
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              {t("Log-in")}
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            {t("Logout")}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;