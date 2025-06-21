import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import NavbarAR from "../components/Navbar/NavbarAR";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { FaExternalLinkAlt, FaFilePdf } from "react-icons/fa";

const baseURL = "https://irt-university-backend.onrender.com";
const placeholderImage = "/images/placeholder-image.png";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
  return match ? match[1] : null;
};

const ProgramsInitiativesPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
    image: "",
    video: "",
    pdfUrl: "",
    showPdf: false
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const section = queryParams.get("section") || "incubation-programs"; // Default to 'incubation-programs'
        setActiveSection(section);

        const response = await axios.get(`${baseURL}/api/posts?page=programs&section=${section}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching programs & initiatives content:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const openModal = (post) => {
    const youtubeId = getYouTubeVideoId(post.video);
    setModalData({
      title: isArabic ? post.title_ar : post.title,
      content: isArabic ? post.content_ar : post.content,
      image: post.imageId ? `${baseURL}/api/files/${post.imageId}` : placeholderImage,
      video: youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null, // MODIFIED: Corrected YouTube embed URL
      pdfUrl: post.pdfId ? `${baseURL}/api/files/${post.pdfId}` : null,
      showPdf: post.pdfId && fileExtension(post.pdfId) === 'pdf'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({
      title: "",
      content: "",
      image: "",
      video: "",
      pdfUrl: "",
      showPdf: false
    });
  };

  const fileExtension = (filename) => {
    return filename.split('.').pop();
  };

  const sections = [
    { key: "incubation-programs", text: "programsInitiatives.incubationPrograms" },
    { key: "innovation-labs", text: "programsInitiatives.innovationLabs" },
    { key: "funding-opportunities", text: "programsInitiatives.fundingOpportunities" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isArabic ? <NavbarAR /> : <Navbar />}
      <main className="flex-grow">
        <section className="py-12 bg-gray-100 min-h-[calc(100vh-160px)]">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
              {t("programsInitiatives.title")}
            </h1>
            <div className="flex justify-center mb-8">
              <nav className="flex space-x-4">
                {sections.map((section) => (
                  <Link
                    key={section.key}
                    to={`/programs-initiatives?section=${section.key}`}
                    className={`px-4 py-2 rounded-lg text-lg font-medium transition duration-300 ${activeSection === section.key
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {t(section.text)}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
                    onClick={() => openModal(post)}
                  >
                    <img
                      src={post.imageId ? `${baseURL}/api/files/${post.imageId}` : (getYouTubeVideoId(post.video) ? `https://i.ytimg.com/vi/${getYouTubeVideoId(post.video)}/hqdefault.jpg` : placeholderImage)} 
                      alt={isArabic ? post.title_ar : post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                        {isArabic ? post.title_ar : post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {isArabic ? post.content_ar : post.content}
                      </p>
                      <span className="text-blue-600 text-sm font-medium hover:underline">
                        {t("programsInitiatives.learnMore")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600 text-lg">
                  {t("programsInitiatives.noContent")}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                onClick={closeModal}
              >
                ×
              </button>
              {modalData.image && !modalData.video && (
                <img
                  src={modalData.image}
                  alt={modalData.title}
                  className="w-full max-h-80 object-cover rounded-t-lg"
                />
              )}
              {modalData.video && (
                <div className="w-full aspect-video">
                  <iframe
                    src={modalData.video}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-t-lg"
                  ></iframe>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {modalData.title}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                  {modalData.content}
                </p>
                {modalData.pdfUrl && (
                  <div className="mt-4">
                    <a
                      href={modalData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FaFilePdf className="mr-2 text-red-600" />
                      {t("viewPdf")} <FaExternalLinkAlt className="ml-2 text-sm" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProgramsInitiativesPage;