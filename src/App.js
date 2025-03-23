import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';

// Public Pages
import Homepage from './pages/Homepage';
import AboutPage from './pages/AboutPage';
import ProgramsInitiativesPage from './pages/ProgramsInitiativesPage';
import ResearchPage from './pages/ResearchPage';
import NewsEventsPage from './pages/NewsEventsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminPosts from './pages/admin/AdminPosts';
import CreatePost from './pages/admin/CreatePost';
import EditPost from './pages/admin/EditPost';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs-initiatives" element={<ProgramsInitiativesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/news-events" element={<NewsEventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/posts"
            element={
              <ProtectedAdminRoute>
                <AdminPosts />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/create"
            element={
              <ProtectedAdminRoute>
                <CreatePost />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedAdminRoute>
                <EditPost />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Router>
    </I18nextProvider>
  );
};

export default App;