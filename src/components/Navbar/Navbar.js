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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdown && !event.target.closest('.navbar-menu li')) {
        setDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdown]);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle navigation and close mobile menu
  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
    setDropdown(null);
  };

  return (
    <nav className="navbar">
      {/* Logo and Mobile Menu Button */}
      <div className="navbar-main">
        <div className="navbar-logo">
          <Link to="/" onClick={handleNavigation}>
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
      </div>

      {/* Menu - Desktop and Mobile */}
      <div 
        id="navbar-content"
        className={`navbar-content ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
      >
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''} 
              onClick={handleNavigation}
            >
              {t("Home")}
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''} 
              onClick={handleNavigation}
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
              onClick={handleNavigation}
            >
              {t("Programs & Initiatives")}
            </Link>
            <ul className="dropdown-menu">
              <li onClick={() => { navigate('/programs-initiatives#innovation-labs'); handleNavigation(); }}>
                {t("Innovation labs")}
              </li>
              <li onClick={() => { navigate('/programs-initiatives#technology-incubation'); handleNavigation(); }}>
                {t("Technology incubation programs")}
              </li>
              <li onClick={() => { navigate('/programs-initiatives#research-funding'); handleNavigation(); }}>
                {t("Research funding opportunities")}
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
              onClick={handleNavigation}
            >
              {t("Research & Insights")}
            </Link>
            <ul className="dropdown-menu">
              <li onClick={() => { navigate('/research#latest-research'); handleNavigation(); }}>
                {t("Latest research publications")}
              </li>
              <li onClick={() => { navigate('/research#ongoing-projects'); handleNavigation(); }}>
                {t("Ongoing projects")}
              </li>
              <li onClick={() => { navigate('/research#collaborations'); handleNavigation(); }}>
                {t("Collaborations and partnerships")}
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
              onClick={handleNavigation}
            >
              {t("News & Events")}
            </Link>
            <ul className="dropdown-menu">
              <li onClick={() => { navigate('/news-events#upcoming-events'); handleNavigation(); }}>
                {t("Upcoming and past events")}
              </li>
              <li onClick={() => { navigate('/news-events#webinars'); handleNavigation(); }}>
                {t("Webinars and workshops")}
              </li>
              <li onClick={() => { navigate('/news-events#press-releases'); handleNavigation(); }}>
                {t("Press releases")}
              </li>
              <li onClick={() => { navigate('/news-events#announcements'); handleNavigation(); }}>
                {t("Announcements")}
              </li>
            </ul>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''} 
              onClick={handleNavigation}
            >
              {t("Contact")}
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link 
                to="/admin/posts" 
                className={location.pathname.startsWith('/admin') ? 'active' : ''} 
                onClick={handleNavigation}
              >
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
            aria-label={t("Language selector")}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>

          {!user ? (
            <div className="auth-buttons">
              <button
                className="login-btn register-btn"
                onClick={() => { navigate('/register'); handleNavigation(); }}
              >
                {t("Register")}
              </button>
              <button
                className="login-btn"
                onClick={() => { navigate('/login'); handleNavigation(); }}
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
    </nav>
  );
};

export default Navbar;