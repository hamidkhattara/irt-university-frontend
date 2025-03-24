import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

const ProgramsInitiativesPage = () => {
  const [innovationLabs, setInnovationLabs] = useState([]);
  const [incubationPrograms, setIncubationPrograms] = useState([]);
  const [fundingOpportunities, setFundingOpportunities] = useState([]);

  const [labsVisible, setLabsVisible] = useState(3);
  const [incubVisible, setIncubVisible] = useState(3);
  const [fundingVisible, setFundingVisible] = useState(3);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [modalData, setModalData] = useState({ image: null, title: "", content: "", video: "", pdfUrl: "", showPdf: false });

  const baseURL = process.env.REACT_APP_API_URL || "link";
  const { t, i18n } = useTranslation();

  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
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

  const handleImageClick = (item) => {
    const isArabic = i18n.language === "ar";
    const title = isArabic ? item.title_ar : item.title;
    const content = isArabic ? item.content_ar : item.content || "";

    setModalData({
      image: item.imageUrl || "https://via.placeholder.com/600x400?text=Program+Image",
      title,
      content,
      video: item.video || "",
      pdfUrl: item.pdfUrl || "",
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

  const renderCard = (item) => {
    const isArabic = i18n.language === "ar";
    const title = isArabic ? item.title_ar : item.title;
    const content = isArabic ? item.content_ar : item.content || "";

    return (
      <div key={item._id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:scale-105 hover:shadow-xl">
        {item.video ? (
          <div onClick={() => handleImageClick(item)} className="cursor-pointer">
            <img
              src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.video)}/0.jpg`}
              alt={title}
              className="w-full aspect-[3/2] object-cover transition-transform hover:scale-105"
            />
          </div>
        ) : (
          <div onClick={() => handleImageClick(item)} className="cursor-pointer">
            <img
              src={item.imageUrl || "https://via.placeholder.com/600x400?text=Program+Image"}
              alt={title}
              className="w-full aspect-[3/2] object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{new Date(item.createdAt).toLocaleDateString()}</p>
          <div className="text-gray-700 text-base">
            {expandedPosts[item._id] || content.length <= 100 ? (
              <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatContent(content.substring(0, 100)) + "..." }} />
            )}
          </div>
          {content.length > 100 && (
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
                  <div className="mt-4">
                    <iframe
                      src={modalData.pdfUrl}
                      className="w-full h-[600px] rounded-lg"
                      title="PDF Viewer"
                    />
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