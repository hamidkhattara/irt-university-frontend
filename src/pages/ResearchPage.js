import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

const ResearchPage = () => {
  const [publications, setPublications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [visiblePublications, setVisiblePublications] = useState(3);
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [visibleCollaborations, setVisibleCollaborations] = useState(3);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [modalData, setModalData] = useState({ image: null, title: "", content: "", video: "", pdfUrl: "", showPdf: false });
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { t, i18n } = useTranslation();

  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  const handleImageClick = (post) => {
    const isArabic = i18n.language === "ar";
    const title = isArabic ? post.title_ar || post.title : post.title;
    const content = isArabic ? post.content_ar || post.content || "" : post.content || "";

    setModalData({
      image: post.imageId ? `${baseURL}/api/files/${post.imageId}` : "https://via.placeholder.com/600x400?text=Research+Image",
      title,
      content,
      video: post.video || "",
      pdfUrl: post.pdfId ? `${baseURL}/api/files/${post.pdfId}` : "",
      pdfId: post.pdfId || "", // Add this line
      showPdf: false
    });
  };

  const handleOpenPdf = (e) => {
    e.stopPropagation();
    setModalData((prev) => ({ ...prev, showPdf: true }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-DZ" : undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatContent = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line, index) => {
        if (line.trim().startsWith("•")) {
          return `<li style="text-align: left;">${line.replace("•", "").trim()}</li>`;
        } else if (line.trim() === "") {
          return "";
        } else {
          return `<p style="text-align: left;">${line.trim()}</p>`;
        }
      })
      .join("");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          axios.get(`${baseURL}/api/posts?page=research&section=latest-publications`),
          axios.get(`${baseURL}/api/posts?page=research&section=ongoing-projects`),
          axios.get(`${baseURL}/api/posts?page=research&section=collaborations-partnerships`)

        ]);
        setPublications(res1.data);
        setProjects(res2.data);
        setCollaborations(res3.data);
      } catch (err) {
        console.error("Error fetching research posts", err);
      }   
    };
    fetchPosts();
  }, [baseURL]);

  const renderPostCard = (post) => {
    if (!post || !post.title || !post.createdAt) return null;

    const isArabic = i18n.language === "ar";
    const title = isArabic ? post.title_ar || post.title : post.title;
    const content = isArabic ? post.content_ar || post.content || "" : post.content || "";

    return (
      <div key={post._id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:scale-105 hover:shadow-xl">
        {post.video ? (
          <div onClick={() => handleImageClick(post)} className="cursor-pointer">
            <img
              src={`https://img.youtube.com/vi/${getYouTubeVideoId(post.video)}/0.jpg`}
              alt={title}
              className="w-full aspect-[3/2] object-cover transition-transform hover:scale-105"
            />
          </div>
        ) : (
          <div onClick={() => handleImageClick(post)} className="cursor-pointer">
            <img
              src={post.imageId ? `${baseURL}/api/files/${post.imageId}` : "https://via.placeholder.com/600x400?text=Research+Image"}
              alt={title}
              className="w-full aspect-[3/2] object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{formatDate(post.createdAt)}</p>
          <div className="text-gray-700 text-base mb-2">
            {expandedPosts[post._id] || content.length <= 100 ? (
              <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatContent(content.substring(0, 100)) + "..." }} />
            )}
          </div>
          {content.length > 100 && (
            <button
              onClick={() => toggleReadMore(post._id)}
              className="text-blue-700 hover:underline text-sm font-medium"
            >
              {expandedPosts[post._id] ? t("Show Less") : t("Read More")}
            </button>
          )}
        </div>
      </div>
    );
  };

  const loadMoreHandler = (type) => {
    switch (type) {
      case "publications":
        setVisiblePublications((prev) => (prev + 3 <= publications.length ? prev + 3 : prev));
        break;
      case "projects":
        setVisibleProjects((prev) => (prev + 3 <= projects.length ? prev + 3 : prev));
        break;
      case "collaborations":
        setVisibleCollaborations((prev) => (prev + 3 <= collaborations.length ? prev + 3 : prev));
        break;
      default:
        break;
    }
  };

  const loadLessHandler = (type) => {
    switch (type) {
      case "publications": setVisiblePublications(3); break;
      case "projects": setVisibleProjects(3); break;
      case "collaborations": setVisibleCollaborations(3); break;
      default: break;
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />

      <section className="bg-blue-900 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold">{t("Research & Insights")}</h1>
        <p className="mt-6 text-xl max-w-2xl mx-auto">
          {t("Exploring groundbreaking research, ongoing projects, and global collaborations.")}
        </p>
      </section>

      <section id="latest-research" className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
          {t("Latest Research Publications")}
        </h2>
        {publications.length === 0 ? (
          <p className="text-center text-gray-500">{t("No available publications for now.")}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {publications.slice(0, visiblePublications).map(renderPostCard)}
            </div>
            {publications.length > 3 && (
              <div className="text-center mt-6">
                {visiblePublications < publications.length && (
                  <button
                    onClick={() => loadMoreHandler("publications")}
                    className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition mr-2"
                  >
                    {t("Load More")}
                  </button>
                )}
                {visiblePublications > 3 && (
                  <button
                    onClick={() => loadLessHandler("publications")}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    {t("Show Less")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <section id="ongoing-projects" className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">{t("Ongoing Projects")}</h2>
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">{t("No available ongoing projects for now.")}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {projects.slice(0, visibleProjects).map(renderPostCard)}
            </div>
            {projects.length > 3 && (
              <div className="text-center mt-6">
                {visibleProjects < projects.length && (
                  <button
                    onClick={() => loadMoreHandler("projects")}
                    className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition mr-2"
                  >
                    {t("Load More")}
                  </button>
                )}
                {visibleProjects > 3 && (
                  <button
                    onClick={() => loadLessHandler("projects")}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    {t("Show Less")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <section id="collaborations" className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
          {t("Collaborations and Partnerships")}
        </h2>
        {collaborations.length === 0 ? (
          <p className="text-center text-gray-500">{t("No available collaborations for now.")}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {collaborations.slice(0, visibleCollaborations).map(renderPostCard)}
            </div>
            {collaborations.length > 3 && (
              <div className="text-center mt-6">
                {visibleCollaborations < collaborations.length && (
                  <button
                    onClick={() => loadMoreHandler("collaborations")}
                    className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition mr-2"
                  >
                    {t("Load More")}
                  </button>
                )}
                {visibleCollaborations > 3 && (
                  <button
                    onClick={() => loadLessHandler("collaborations")}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    {t("Show Less")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {modalData.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalData({ image: null, title: "", content: "", video: "", pdfUrl: "", showPdf: false })}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[90vw] max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {modalData.video ? (
              <div className="flex justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(modalData.video)}`}
                  title="YouTube Video"
                  className="w-[800px] h-[450px] rounded-lg mb-4"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <img
                  src={modalData.image}
                  alt="Enlarged"
                  className="max-w-full max-h-[80vh] rounded-lg mb-4"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">{modalData.title}</h2>
            <div className="text-center">
              <div className="inline-block text-left">
                <div dangerouslySetInnerHTML={{ __html: formatContent(modalData.content) }} />
              </div>
            </div>
            {modalData.pdfUrl && (
              <div className="mt-4 text-center">
                <button
                  onClick={(e) => handleOpenPdf(e)}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
                >
                  {t("Open PDF")}
                </button>
               {modalData.showPdf && (
  <div className="mt-4 w-full h-[70vh]">
    <iframe 
      src={`https://irt-university-backend.onrender.com/api/files/${modalData.pdfId}#view=fitH`}
      width="100%"
      height="100%"
      style={{ border: 'none', minHeight: '500px' }}
      title="PDF Viewer"
      className="w-full h-full"
    />
    <p className="text-center mt-2">
      <a 
        href={`https://irt-university-backend.onrender.com/api/files/${modalData.pdfId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {t('Open PDF in new tab')}
      </a>
    </p>


                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ResearchPage;