import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

// Standardized placeholder to a local asset for reliability
const placeholderImage = "/images/placeholder-image.png"; // Assuming you have this file in your public/images folder

export default function Homepage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [modalData, setModalData] = useState({ 
    image: null, 
    title: "", 
    content: "", 
    video: "", 
    pdfUrl: "", 
    showPdf: false 
  });
  const { i18n, t } = useTranslation();

  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // More robust getYouTubeVideoId function
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
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
    const content = isArabic ? post.content_ar : post.content;
    const imageUrl = post.imageId ? `${baseURL}/api/files/${post.imageId}` : placeholderImage;

    setModalData({
      image: imageUrl,
      title,
      content,
      video: post.video || "",
      pdfUrl: post.pdfId ? `${baseURL}/api/files/${post.pdfId}` : "",
      pdfId: post.pdfId || "",
      showPdf: false
    });
  };

  const handleOpenPdf = (e) => {
    e.stopPropagation();
    setModalData((prev) => ({ ...prev, showPdf: true }));
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
    const content = isArabic ? post.content_ar : post.content;
    const youtubeId = post.video ? getYouTubeVideoId(post.video) : null;

    return (
      <div key={post._id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:scale-105 hover:shadow-xl">
        {post.video && youtubeId ? ( // Check if YouTube ID exists
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title}
            className="w-full h-64 object-cover cursor-pointer"
            onError={(e) => {
                e.target.src = placeholderImage; // Fallback to local placeholder
                e.target.onerror = null;
            }}
            onClick={() => handleImageClick(post)}
          />
        ) : (
          <img
            src={post.imageId ? `${baseURL}/api/files/${post.imageId}` : placeholderImage}
            alt={title}
            className="w-full h-64 object-cover cursor-pointer"
            onError={(e) => {
              e.target.src = placeholderImage;
              e.target.onerror = null;
            }}
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

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Navbar />
      <HeroSlider />
      
      <main className="flex-grow">
        <section className="py-12 px-6">
          <h2 className="text-3xl font-bold text-center mb-6">📰 {t("latestNews")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.length > 0 ? (
              latestPosts.slice(0, 3).map((post) => renderPostCard(post))
            ) : (
              <p className="text-center col-span-3 text-gray-500">
                {t("No posts available yet.")}
              </p>
            )}
          </div>
        </section>
      </main>

      {modalData.image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalData({ image: null, title: "", content: "", video: "", pdfUrl: "", showPdf: false })}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[90vw] max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {modalData.video && getYouTubeVideoId(modalData.video) ? ( // Check if YouTube ID exists
              <div className="flex justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(modalData.video)}?autoplay=1`}
                  title="YouTube Video"
                  className="w-[800px] h-[450px] rounded-lg mb-4"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" // Standard YouTube iframe permissions
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <img
                  src={modalData.image}
                  alt="Enlarged"
                  className="max-w-full max-h-[80vh] rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = placeholderImage;
                    e.target.onerror = null;
                  }}
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
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
                >
                  {t("Open PDF")}
                </button>
                {modalData.showPdf && (
                  <div className="mt-4 w-full h-[100vh]">
                    <iframe 
                      src={`${baseURL}/api/files/${modalData.pdfId}#view=fitH`}
                      width="100%"
                      height="100%"
                      style={{ border: 'none', minHeight: '500px' }}
                      title="PDF Viewer"
                      className="w-full h-full"
                    />
                    <p className="text-center mt-2">
                      <a 
                        href={`${baseURL}/api/files/${modalData.pdfId}`}
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
}