import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

// Standardized placeholder to a local asset for reliability
const placeholderImage = "/images/placeholder-image.png";

const ProgramsInitiativesPage = () => {
  const [innovationLabs, setInnovationLabs] = useState([]);
  const [incubationPrograms, setIncubationPrograms] = useState([]);
  const [fundingOpportunities, setFundingOpportunities] = useState([]);
  const [labsVisible, setLabsVisible] = useState(3);
  const [incubVisible, setIncubVisible] = useState(3);
  const [fundingVisible, setFundingVisible] = useState(3);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [modalData, setModalData] = useState({
    image: null,
    title: "",
    content: "",
    video: "",
    pdfUrl: "",
    showPdf: false,
  });
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { t, i18n } = useTranslation();

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:https?:\/\/)??(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labsRes, incubRes, fundingRes] = await Promise.all([
          axios.get(`${baseURL}/api/posts?page=programs&section=innovation-labs`),
          axios.get(`${baseURL}/api/posts?page=programs&section=incubation-programs`),
          axios.get(`${baseURL}/api/posts?page=programs&section=funding-opportunities`),
        ]);
        setInnovationLabs(labsRes.data);
        setIncubationPrograms(incubRes.data);
        setFundingOpportunities(fundingRes.data);
      } catch (error) {
        console.error("Error fetching programs & initiatives content:", error);
      }
    };
    fetchData();
  }, [baseURL]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-DZ" : undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageClick = (item) => {
    const isArabic = i18n.language === "ar";
    const title = isArabic ? item.title_ar : item.title;
    const content = isArabic ? item.content_ar : item.content;

    setModalData({
      image: item.imageId ? `${baseURL}/api/files/${item.imageId}` : placeholderImage,
      title,
      content,
      video: item.video || "",
      pdfUrl: item.pdfId ? `${baseURL}/api/files/${item.pdfId}` : "",
      pdfId: item.pdfId || "",
      showPdf: false,
    });
  };

  const handleOpenPdf = (e) => {
    e.stopPropagation();
    setModalData((prev) => ({ ...prev, showPdf: true }));
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
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

  const renderCard = (item) => {
    const isArabic = i18n.language === "ar";
    const title = isArabic ? item.title_ar : item.title;
    const content = isArabic ? item.content_ar : item.content;
    const safeContent = content || "";
    const youtubeId = item.video ? getYouTubeVideoId(item.video) : null;

    return (
      <div
        key={item._id}
        className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:scale-105 hover:shadow-xl"
      >
        {item.video && youtubeId ? (
          <div className="cursor-pointer mb-4" onClick={() => handleImageClick(item)}>
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt={title}
              className="w-full aspect-[3/2] object-cover transition-transform hover:scale-105"
              onError={(e) => {
                e.target.src = placeholderImage;
                e.target.onerror = null;
              }}
            />
          </div>
        ) : (
          <div className="cursor-pointer mb-4" onClick={() => handleImageClick(item)}>
            <img
              src={item.imageId ? `${baseURL}/api/files/${item.imageId}` : placeholderImage}
              alt={title}
              className="w-full aspect-[3/2] object-cover transition-transform hover:scale-105"
              onError={(e) => {
                e.target.src = placeholderImage;
                e.target.onerror = null;
              }}
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
          <div
            className="text-gray-700 text-base"
            dir={isArabic ? 'rtl' : 'ltr'}
            style={{ textAlign: isArabic ? 'right' : 'left' }}
          >
            {expandedPosts[item._id] || safeContent.length <= 100 ? (
              <div dangerouslySetInnerHTML={{ __html: formatContent(safeContent, isArabic) }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatContent(safeContent.substring(0, 100), isArabic) + "..." }} />
            )}
          </div>
          {safeContent.length > 100 && (
            <button
              onClick={() => toggleReadMore(item._id)}
              className="text-blue-700 hover:underline text-sm font-medium"
            >
              {expandedPosts[item._id] ? t("Show Less") : t("Read More")}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (titleKey, data, visibleCount, setVisibleCount, fallbackMessageKey, sectionId) => (
    <section id={sectionId} className="container mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">{t(titleKey)}</h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-600 mt-6">{t(fallbackMessageKey)}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {data.slice(0, visibleCount).map(renderCard)}
          </div>
          {data.length > visibleCount && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
              >
                {t("Load More")}
              </button>
              {visibleCount > 3 && (
                <button
                  onClick={() => setVisibleCount(3)}
                  className="ml-4 px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  {t("Show Less")}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      <section className="bg-blue-900 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold">{t("Programs & Initiatives")}</h1>
        <p className="mt-6 text-xl max-w-2xl mx-auto">
          {t("Empowering students and communities through dynamic programs and strategic initiatives.")}
        </p>
      </section>
      {renderSection(
        "Innovation Labs",
        innovationLabs,
        labsVisible,
        setLabsVisible,
        "No Innovation Labs available at the moment.",
        "innovation-labs"
      )}
      <div className="bg-gray-100 w-full">
        {renderSection(
          "Technology Incubation Programs",
          incubationPrograms,
          incubVisible,
          setIncubVisible,
          "No Technology Incubation Programs available at the moment.",
          "technology-incubation"
        )}
      </div>
      {renderSection(
        "Research Funding Opportunities",
        fundingOpportunities,
        fundingVisible,
        setFundingVisible,
        "No Research Funding Opportunities available at the moment.",
        "research-funding"
      )}
      {modalData.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-screen h-screen"
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
              dir={i18n.language === "ar" ? 'rtl' : 'ltr'}
              style={{ textAlign: i18n.language === "ar" ? 'right' : 'left' }}
            >
              <div dangerouslySetInnerHTML={{ __html: formatContent(modalData.content, i18n.language === "ar") }} />
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

export default ProgramsInitiativesPage;
