import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

// Standardized placeholder to a local asset for reliability
const placeholderImage = "/images/placeholder-image.png";

const NewsEventsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [newsList, setNewsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [pressReleases, setPressReleases] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [visibleNews, setVisibleNews] = useState(3);
  const [visibleEvents, setVisibleEvents] = useState(3);
  const [visiblePress, setVisiblePress] = useState(3);
  const [visibleAnnounce, setVisibleAnnounce] = useState(3);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [modalData, setModalData] = useState({
    image: null,
    title: "",
    content: "",
    video: "",
    pdfUrl: "",
    showPdf: false,
  });

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, eventsRes, pressRes, announceRes] = await Promise.all([
          axios.get(`${baseURL}/api/posts?page=news&section=webinars-workshops`),
          axios.get(`${baseURL}/api/posts?page=news&section=events`),
          axios.get(`${baseURL}/api/posts?page=news&section=press-releases`),
          axios.get(`${baseURL}/api/posts?page=news&section=announcements`),
        ]);
        setNewsList(newsRes.data);
        setEventsList(eventsRes.data);
        setPressReleases(pressRes.data);
        setAnnouncements(announceRes.data);
      } catch (error) {
        console.error("Error fetching News & Events content:", error);
      }
    };
    fetchData();
  }, [baseURL]);

  const handleLoadMore = (type) => {
    switch (type) {
      case "news":
        setVisibleNews((prev) => prev + 3);
        break;
      case "events":
        setVisibleEvents((prev) => prev + 3);
        break;
      case "press":
        setVisiblePress((prev) => prev + 3);
        break;
      case "announce":
        setVisibleAnnounce((prev) => prev + 3);
        break;
      default:
        break;
    }
  };

  const handleShowLess = (type) => {
    switch (type) {
      case "news":
        setVisibleNews(3);
        break;
      case "events":
        setVisibleEvents(3);
        break;
      case "press":
        setVisiblePress(3);
        break;
      case "announce":
        setVisibleAnnounce(3);
        break;
      default:
        break;
    }
  };

  const handleImageClick = (post) => {
    const title = isArabic ? post.title_ar : post.title;
    const content = isArabic ? post.content_ar || post.description_ar : post.content || post.description;

    setModalData({
      image: post.imageId ? `${baseURL}/api/files/${post.imageId}` : placeholderImage,
      title,
      content,
      video: post.video || "",
      pdfUrl: post.pdfId ? `${baseURL}/api/files/${post.pdfId}` : "",
      pdfId: post.pdfId || "",
      showPdf: false,
    });
  };

  const handleOpenPdf = (e) => {
    e.stopPropagation();
    setModalData((prev) => ({ ...prev, showPdf: true }));
  };

  const formatContent = (text, isArabic) => {
    if (!text) return "";

    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\[color:(.*?)]((?!\[color:).*?)\[\/color]/g, '<span style="color:$1;">$2</span>');
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formattedText = formattedText.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`;
    });

    return formattedText
      .split("\n")
      .map((line) => {
        const style = isArabic ? 'text-align: right; direction: rtl;' : 'text-align: left; direction: ltr;';
        if (line.trim().startsWith("•")) {
          return `<li style="${style}">${line.replace("•", "").trim()}</li>`;
        } else if (line.trim() === "") {
          return "";
        } else {
          return `<p style="${style}">${line.trim()}</p>`;
        }
      })
      .join("");
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

   const renderPostCard = (post) => {
    const title = isArabic ? post.title_ar : post.title;
    const content = isArabic ? post.content_ar || post.description_ar : post.content || post.description;
    const safeContent = content || "";
    const youtubeId = post.video ? getYouTubeVideoId(post.video) : null;

    return (
      <div 
        key={post._id} 
        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105" // Removed cursor-pointer and onClick
      >
        {post.video && youtubeId ? ( // Check if YouTube ID exists
          <div className="mb-4">
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt={title}
              className="w-full aspect-[3/2] object-cover rounded-md transition-transform hover:scale-105 cursor-pointer" // Keep image clickable
              onError={(e) => {
                e.target.src = placeholderImage; // Fallback to local placeholder
                e.target.onerror = null;
              }}
              onClick={() => handleImageClick(post)} // Image click opens modal
            />
          </div>
        ) : (
          post.imageId ? ( // Render image if imageId exists
            <div className="mb-4">
              <img
                src={`${baseURL}/api/files/${post.imageId}`}
                alt={title}
                className="w-full aspect-[3/2] object-cover rounded-md transition-transform hover:scale-105 cursor-pointer" // Keep image clickable
                onError={(e) => {
                  e.target.src = placeholderImage;
                  e.target.onerror = null;
                }}
                onClick={() => handleImageClick(post)} // Image click opens modal
              />
            </div>
          ) : ( // Fallback if neither video nor imageId is present
            <div className="mb-4">
              <img
                src={placeholderImage}
                alt="No Media Available"
                className="w-full aspect-[3/2] object-cover rounded-md"
              />
            </div>
          )
        )}
        <h3 className="text-2xl font-semibold text-blue-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {/* Show truncated content */}
        <div
          className="mt-4 text-gray-700"
          dir={isArabic ? 'rtl' : 'ltr'}
          style={{ textAlign: isArabic ? 'right' : 'left' }}
          dangerouslySetInnerHTML={{ __html: formatContent(safeContent.slice(0, 100), isArabic) + "..." }}
        />
        {/* Reinstated Read More button, now opens modal */}
        {safeContent.length > 100 && (
          <button
            onClick={() => handleImageClick(post)} // Read More button now opens the modal
            className="text-blue-700 hover:underline text-sm font-medium"
          >
            {t("Read More")}
          </button>
        )}
      </div>
    );
  };



  const renderSection = (titleKey, list, visibleCount, type, sectionId) => (
    <section id={sectionId} className="container mx-auto px-8 py-16">
      <h2 className="text-4xl font-bold text-blue-900 text-center">{t(titleKey)}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        {list.length === 0 ? (
          <p className="text-center col-span-full text-gray-600 text-lg">{t("noContent")}</p>
        ) : (
          list.slice(0, visibleCount).map((item) => renderPostCard(item))
        )}
      </div>
      {list.length > visibleCount && (
        <div className="text-center mt-8">
          <button
            onClick={() => handleLoadMore(type)}
            className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
          >
            {t("Load More")}
          </button>
          {visibleCount > 3 && (
            <button
              onClick={() => handleShowLess(type)}
              className="ml-4 px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              {t("Show Less")}
            </button>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      <section className="bg-blue-900 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold">{t("newsEvents.title")}</h1>
        <p className="mt-6 text-xl max-w-2xl mx-auto">{t("newsEvents.subtitle")}</p>
      </section>
      {renderSection("newsEvents.events", eventsList, visibleEvents, "events", "upcoming-events")}
      {renderSection("newsEvents.webinars", newsList, visibleNews, "news", "webinars")}
      {renderSection("newsEvents.press", pressReleases, visiblePress, "press", "press-releases")}
      {renderSection("newsEvents.announcements", announcements, visibleAnnounce, "announce", "announcements")}
      {modalData.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80  w-screen h-screen"
          onClick={() => setModalData({ image: null, title: "", content: "", video: "", pdfUrl: "", showPdf: false })}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[90vw] max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {modalData.video && getYouTubeVideoId(modalData.video) ? (
              <div className="flex justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(modalData.video)}?autoplay=1`}
                  title="YouTube Video"
                  className="w-[800px] h-[450px] rounded-lg mb-4"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
            <div
              className="text-center"
              dir={isArabic ? 'rtl' : 'ltr'}
              style={{ textAlign: isArabic ? 'right' : 'left' }}
            >
              <div dangerouslySetInnerHTML={{ __html: formatContent(modalData.content, isArabic) }} />
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
};

export default NewsEventsPage;
