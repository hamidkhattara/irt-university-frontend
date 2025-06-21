import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import NavbarAR from "../../components/Navbar/NavbarAR";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../AuthContext"; // Assuming AuthContext provides user/token
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt, FaFilePdf } from "react-icons/fa";

const baseURL = "https://irt-university-backend.onrender.com";
const placeholderImage = "/images/placeholder-image.png";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
  return match ? match[1] : null;
};

const AdminPosts = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { user } = useContext(AuthContext); // Get user from context
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [activePage, setActivePage] = useState("");
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
        const page = queryParams.get("page") || "news"; // Default to 'news'
        const section = queryParams.get("section") || ""; // Section can be empty
        setActivePage(page);
        setActiveSection(section);

        let url = `${baseURL}/api/posts?page=${page}`;
        if (section) {
          url += `&section=${section}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchPosts();
    } else {
      setError(new Error("Unauthorized: No user token found."));
      setLoading(false);
    }
  }, [location.search, user]);

  const handleDelete = async (id) => {
    if (window.confirm(t("adminPosts.confirmDelete"))) {
      try {
        await axios.delete(`${baseURL}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPosts(posts.filter((post) => post._id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
        setError(error);
      }
    }
  };

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

  const pageOptions = [
    { key: "news", text: "adminPosts.pages.news" },
    { key: "programs", text: "adminPosts.pages.programs" },
    { key: "research", text: "adminPosts.pages.research" },
  ];

  const getSectionOptions = (page) => {
    switch (page) {
      case "news":
        return [
          { key: "announcements", text: "adminPosts.sections.announcements" },
          { key: "events", text: "adminPosts.sections.events" },
          { key: "webinars-workshops", text: "adminPosts.sections.webinarsWorkshops" },
          { key: "press-releases", text: "adminPosts.sections.pressReleases" },
        ];
      case "programs":
        return [
          { key: "incubation-programs", text: "adminPosts.sections.incubationPrograms" },
          { key: "innovation-labs", text: "adminPosts.sections.innovationLabs" },
          { key: "funding-opportunities", text: "adminPosts.sections.fundingOpportunities" },
        ];
      case "research":
        return [
          { key: "latest-publications", text: "adminPosts.sections.latestPublications" },
          { key: "ongoing-projects", text: "adminPosts.sections.ongoingProjects" },
          { key: "collaborations-partnerships", text: "adminPosts.sections.collaborationsPartnerships" },
        ];
      default:
        return [];
    }
  };

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
      <main className="flex-grow py-12 bg-gray-100 min-h-[calc(100vh-160px)]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
            {t("adminPosts.title")}
          </h1>

          {/* Page Selection */}
          <div className="flex justify-center mb-8">
            <nav className="flex space-x-4">
              {pageOptions.map((option) => (
                <Link
                  key={option.key}
                  to={`/admin/posts?page=${option.key}`}
                  className={`px-4 py-2 rounded-lg text-lg font-medium transition duration-300 ${activePage === option.key
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {t(option.text)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Section Selection (if sections exist for activePage) */}
          {getSectionOptions(activePage).length > 0 && (
            <div className="flex justify-center mb-8">
              <nav className="flex space-x-4 text-sm md:text-base flex-wrap justify-center">
                <Link
                  to={`/admin/posts?page=${activePage}`}
                  className={`px-3 py-2 rounded-lg font-medium transition duration-300 ${activeSection === ""
                      ? "bg-gray-800 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {t("adminPosts.allSections")}
                </Link>
                {getSectionOptions(activePage).map((option) => (
                  <Link
                    key={option.key}
                    to={`/admin/posts?page=${activePage}&section=${option.key}`}
                    className={`px-3 py-2 rounded-lg font-medium transition duration-300 ${activeSection === option.key
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {t(option.text)}
                  </Link>
                ))}
              </nav>
            </div>
          )}


          <div className="text-right mb-6">
            <Link
              to="/admin/create-post"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center justify-center ml-auto w-fit"
            >
              <FaPlus className="mr-2" /> {t("adminPosts.createPost")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={post.imageId ? `${baseURL}/api/files/${post.imageId}` : (getYouTubeVideoId(post.video) ? `https://i.ytimg.com/vi/${getYouTubeVideoId(post.video)}/hqdefault.jpg` : placeholderImage)} 
                    alt={isArabic ? post.title_ar : post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                      {isArabic ? post.title_ar : post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {isArabic ? post.content_ar : post.content}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openModal(post)}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        title={t("adminPosts.view")}
                      >
                        <FaExternalLinkAlt />
                      </button>
                      <Link
                        to={`/admin/edit-post/${post._id}?page=${activePage}&section=${activeSection}`}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                        title={t("adminPosts.edit")}
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        title={t("adminPosts.delete")}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 text-lg">
                {t("adminPosts.noContent")}
              </div>
            )}
          </div>
        </div>

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

export default AdminPosts;