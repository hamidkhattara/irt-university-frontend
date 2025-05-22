import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/irt-logo.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdown, setDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    document.documentElement.dir = selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = selectedLang;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDropdown = (page) => {
    setDropdown(dropdown === page ? null : page);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (path, sectionId = null) => {
    setIsMobileMenuOpen(false);
    setDropdown(null);
    
    if (path === location.pathname && sectionId) {
      scrollToSection(sectionId);
    } else if (sectionId) {
      navigate(path, {
        state: { scrollTo: sectionId }
      });
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location, navigate]);

  // Set initial direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={() => handleNavigation('/')}>
            <img src={logo} alt="IRT University Logo" className="logo-image" />
            <span className="logo-text">{t("IRT University")}</span>
          </Link>
        </div>

        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? t("Close menu") : t("Open menu")}
          aria-expanded={isMobileMenuOpen}
          aria-controls="navbar-content"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div 
          id="navbar-content"
          className={`navbar-main-content ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
        >
          <ul className="navbar-menu">
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''} 
                onClick={() => handleNavigation('/')}
              >
                {t("Home")}
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={location.pathname === '/about' ? 'active' : ''} 
                onClick={() => handleNavigation('/about')}
              >
                {t("About")}
              </Link>
            </li>
            <li
              onMouseEnter={() => !isMobileMenuOpen && toggleDropdown('programs')}
              onMouseLeave={() => !isMobileMenuOpen && toggleDropdown(null)}
              onClick={() => isMobileMenuOpen && toggleDropdown('programs')}
              className={dropdown === 'programs' ? 'active' : ''}
            >
              <Link
                to="/programs-initiatives"
                className={location.pathname === '/programs-initiatives' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/programs-initiatives');
                }}
              >
                {t("Programs & Initiatives")}
              </Link>
              <ul className="dropdown-menu">
                <li onClick={() => {
                  handleNavigation('/programs-initiatives', 'innovation-labs');
                  setTimeout(() => {
                    const element = document.getElementById('innovation-labs');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}>
                  {t("Innovation Labs")}
                </li>
                <li onClick={() => {
                  handleNavigation('/programs-initiatives', 'technology-incubation');
                  setTimeout(() => {
                    const element = document.getElementById('technology-incubation');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}>
                  {t("Technology Incubation Programs")}
                </li>
                <li onClick={() => {
                  handleNavigation('/programs-initiatives', 'research-funding');
                  setTimeout(() => {
                    const element = document.getElementById('research-funding');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}>
                  {t("Research Funding Opportunities")}
                </li>
              </ul>
            </li>
            <li
              onMouseEnter={() => !isMobileMenuOpen && toggleDropdown('research')}
              onMouseLeave={() => !isMobileMenuOpen && toggleDropdown(null)}
              onClick={() => isMobileMenuOpen && toggleDropdown('research')}
              className={dropdown === 'research' ? 'active' : ''}
            >
              <Link
                to="/research"
                className={location.pathname === '/research' ? 'active' : ''}
                onClick={() => handleNavigation('/research')}
              >
                {t("Research & Insights")}
              </Link>
              <ul className="dropdown-menu">
                <li onClick={() => handleNavigation('/research', 'latest-research')}>
                  {t("Latest Research Publications")}
                </li>
                <li onClick={() => handleNavigation('/research', 'ongoing-projects')}>
                  {t("Ongoing Projects")}
                </li>
                <li onClick={() => handleNavigation('/research', 'collaborations')}>
                  {t("Collaborations and Partnerships")}
                </li>
              </ul>
            </li>
            <li
              onMouseEnter={() => !isMobileMenuOpen && toggleDropdown('news')}
              onMouseLeave={() => !isMobileMenuOpen && toggleDropdown(null)}
              onClick={() => isMobileMenuOpen && toggleDropdown('news')}
              className={dropdown === 'news' ? 'active' : ''}
            >
              <Link
                to="/news-events"
                className={location.pathname === '/news-events' ? 'active' : ''}
                onClick={() => handleNavigation('/news-events')}
              >
                {t("News & Events")}
              </Link>
              <ul className="dropdown-menu">
                <li onClick={() => handleNavigation('/news-events', 'upcoming-events')}>
                  {t("Upcoming and Past Events")}
                </li>
                <li onClick={() => handleNavigation('/news-events', 'webinars')}>
                  {t("Webinars and Workshops")}
                </li>
                <li onClick={() => handleNavigation('/news-events', 'press-releases')}>
                  {t("Press Releases")}
                </li>
                <li onClick={() => handleNavigation('/news-events', 'announcements')}>
                  {t("Announcements")}
                </li>
              </ul>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={location.pathname === '/contact' ? 'active' : ''} 
                onClick={() => handleNavigation('/contact')}
              >
                {t("Contact")}
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link 
                  to="/admin/posts" 
                  className={location.pathname.startsWith('/admin') ? 'active' : ''} 
                  onClick={() => handleNavigation('/admin/posts')}
                >
                  {t("Admin Panel")}
                </Link>
              </li>
            )}
          </ul>

          <div className="navbar-icons">
            <div className="language-switcher">
              <select
                onChange={handleLanguageChange}
                value={i18n.language}
                aria-label={t("Language selector")}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            {!user ? (
              <div className="auth-buttons">
                <button
                  className="login-btn register-btn"
                  onClick={() => handleNavigation('/register')}
                >
                  {t("Register")}
                </button>
                <button
                  className="login-btn"
                  onClick={() => handleNavigation('/login')}
                >
                  {t("Log in")}
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={handleLogout}>
                {t("Logout")}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;