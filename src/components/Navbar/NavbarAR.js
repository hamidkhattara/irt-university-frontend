import React from 'react';
import './Navbar.css';
import logo from '../../assets/irt-logo.png';

const NavbarAr = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPath = window.location.pathname;

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    if (selectedLang === 'en') {
      window.location.href = currentPath.replace('/ar', '') || '/';
    } else {
      window.location.href = currentPath; // already in /ar
    }
  };

  return (
    <nav className="navbar" dir="rtl">
      <div className="navbar-logo">
        <a href="/ar">
          <img src={logo} alt="شعار جامعة IRT" className="logo-image" />
          <span className="logo-text">جامعة IRT</span>
        </a>
      </div>

      <ul className="navbar-menu">
        <li><a href="/ar">الرئيسية</a></li>
        <li><a href="/ar/about">حول الجامعة</a></li>
        <li><a href="/ar/programs-initiatives">البرامج والمبادرات</a></li>
        <li><a href="/ar/research">الأبحاث والرؤى</a></li>
        <li><a href="/ar/news-events">الأخبار والفعاليات</a></li>
        <li><a href="/ar/contact">اتصل بنا</a></li>
        
      </ul>

      <div className="navbar-icons">
        <select className="language-switcher" onChange={handleLanguageChange}>
          <option value="ar" selected={currentPath.startsWith('/ar')}>🇩🇿 العربية</option>
          <option value="en">🇬🇧 الإنجليزية</option>
        </select>

        {!user ? (
          <>
            <button className="login-btn register-btn" onClick={() => window.location.href = '/ar/register'}>
              التسجيل
            </button>
            <button className="login-btn" onClick={() => window.location.href = '/ar/login'}>
              تسجيل الدخول
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/ar';
          }}>
            تسجيل الخروج
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavbarAr;
