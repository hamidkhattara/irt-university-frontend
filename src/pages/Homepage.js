import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

export default function Homepage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [modalData, setModalData] = useState({ 
    image: null, 
    title: "", 
    content: "", 
    video: "", 
    pdfUrl: "", 
    showPdf: false,
    pdfLoading: false,
    pdfError: null
  });
  const { i18n, t } = useTranslation();

  const baseURL = process.env.REACT_APP_API_URL || "https://irt-university-backend.onrender.com";

  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/posts`);
        const posts = response.data;
        const sorted = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestPosts(sorted);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [baseURL]);

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

  const handleImageClick = (post) => {
    const isArabic = i18n.language === "ar";
    const title = isArabic ? post.title_ar : post.title;
    const content = isArabic ? post.content_ar : post.content || "";
    
    setModalData({
      image: post.imageId ? `${baseURL}/api/files/${post.imageId}` : "https://via.placeholder.com/600x400?text=Post+Image",
      title,
      content,
      video: post.video || "",
      pdfUrl: post.pdfId ? `${baseURL}/api/files/${post.pdfId}` : "",
      showPdf: false,
      pdfLoading: false,
      pdfError: null
    });
  };
  const handleOpenPdf = async (e) => {
    e.stopPropagation();
    
    if (!modalData.pdfUrl) {
      setModalData(prev => ({ ...prev, pdfError: "No PDF URL provided" }));
      return;
    }

    setModalData(prev => ({ ...prev, pdfLoading: true, pdfError: null }));
    
    try {
      // Verify URL is HTTPS
      if (!modalData.pdfUrl.startsWith("https://")) {
        throw new Error("PDF must be served over HTTPS");
      }

      // Test PDF accessibility
      const response = await fetch(modalData.pdfUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`PDF not accessible (HTTP ${response.status})`);
      }
      
      setModalData(prev => ({ 
        ...prev, 
        showPdf: true,
        pdfLoading: false 
      }));
    } catch (error) {
      console.error("PDF loading error:", error);
      setModalData(prev => ({ 
        ...prev, 
        showPdf: false,
        pdfLoading: false,
        pdfError: error.message 
      }));
    }
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

  const renderPostCard = (post) => {
    const isArabic = i18n.language === "ar";
    const title = isArabic ? post.title_ar : post.title;
    const content = isArabic ? post.content_ar : post.content || "";

    return (
      <div key={post._id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:scale-105 hover:shadow-xl">
        {post.video ? (
          <img
            src={`https://img.youtube.com/vi/${getYouTubeVideoId(post.video)}/0.jpg`}
            alt={title}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => handleImageClick(post)}
          />
        ) : (
          <img
          src={post.imageId ? `${baseURL}/api/files/${post.imageId}` : "https://via.placeholder.com/600x400?text=Post+Image"}
          alt={title}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={() => handleImageClick(post)}
        />
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{formatDate(post.createdAt)}</p>
          <div className="text-gray-700 text-base mb-2">
            {expandedPosts[post._id] || content.length <= 100 ? (
              <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatContent(content.slice(0, 100)) + "..." }} />
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

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 3);
  };

  const handleShowLess = () => {
    setVisiblePosts(3);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Navbar />
      <HeroSlider />
      <section className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">📰 {t("Latest News & Posts")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.length > 0 ? (
            latestPosts.slice(0, visiblePosts).map((post) => renderPostCard(post))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              {t("No posts available yet.")}
            </p>
          )}
        </div>
        {latestPosts.length > visiblePosts && (
          <div className="text-center mt-6">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
            >
              {t("Load More")}
            </button>
            {visiblePosts > 3 && (
              <button
                onClick={handleShowLess}
                className="ml-4 px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                {t("Show Less")}
              </button>
            )}
          </div>
        )}
      </section>
      {modalData.image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalData({ 
            image: null, 
            title: "", 
            content: "", 
            video: "", 
            pdfUrl: "", 
            showPdf: false,
            pdfLoading: false,
            pdfError: null
          })}
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
                  onClick={handleOpenPdf}
                  disabled={modalData.pdfLoading}
                  className={`px-4 py-2 rounded transition ${modalData.pdfLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-700'}`}
                >
                  {modalData.pdfLoading ? t("Loading...") : 
                   modalData.showPdf ? t("Hide PDF") : t("Open PDF")}
                </button>
                
                {modalData.pdfError && (
                  <div className="mt-2 text-red-600">
                    {t("Error loading PDF:")} {modalData.pdfError}
                    <div className="mt-2">
                      <a 
                        href={modalData.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {t("Try opening in new tab")}
                      </a>
                    </div>
                  </div>
                )}

                {modalData.showPdf && !modalData.pdfError && (
                  <div className="mt-4" style={{ height: '600px' }}>
                    <iframe
                      src={`${modalData.pdfUrl}#view=fitH`}
                      className="w-full h-full rounded-lg border"
                      title="PDF Viewer"
                      frameBorder="0"
                    />
                    <div className="mt-4 flex justify-center gap-4">
                      <a 
                        href={modalData.pdfUrl} 
                        download 
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("Download PDF")}
                      </a>
                      <a 
                        href={modalData.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("Open in New Tab")}
                      </a>
                    </div>
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
}