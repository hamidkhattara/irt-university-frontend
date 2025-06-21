import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import NavbarAR from "../../components/Navbar/NavbarAR";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../AuthContext"; // Assuming AuthContext provides user/token
import { FaUpload, FaFilePdf, FaYoutube } from "react-icons/fa";

const baseURL = "https://irt-university-backend.onrender.com";
const placeholderImage = "/images/placeholder-image.png";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
  return match ? match[1] : null;
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [page, setPage] = useState("news");
  const [section, setSection] = useState("");
  const [video, setVideo] = useState("");
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [currentImageId, setCurrentImageId] = useState(null);
  const [currentPdfId, setCurrentPdfId] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!user || !user.token) {
          throw new Error("Unauthorized: No user token found.");
        }
        const response = await axios.get(`${baseURL}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const postData = response.data;
        setTitle(postData.title || "");
        setContent(postData.content || "");
        setTitleAr(postData.title_ar || "");
        setContentAr(postData.content_ar || "");
        setPage(postData.page || "news");
        setSection(postData.section || "");
        setVideo(postData.video || "");
        setCurrentImageId(postData.imageId || null);
        setCurrentPdfId(postData.pdfId || null);
        setCurrentVideoUrl(postData.video || "");
      } catch (err) {
        console.error("Error fetching post for editing:", err);
        setError(err.message || "Failed to fetch post data.");
      } finally {
        setLoading(false);
      }
    };

    if (id && user && user.token) {
      fetchPost();
    } else {
      setLoading(false);
      setError("Not authorized or post ID missing.");
    }
  }, [id, user]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setVideo(""); // Clear video if image is selected
  };

  const handlePdfChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.value);
    setImage(null); // Clear image if video is entered
    setPdf(null); // Clear PDF if video is entered (assuming only one media type for simplicity)
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("title_ar", titleAr);
      formData.append("content_ar", contentAr);
      formData.append("page", page);
      formData.append("section", section);

      if (video) {
        formData.append("video", video);
      } else if (image) {
        formData.append("image", image);
      } else if (!currentImageId && !currentVideoUrl) {
        // If neither new image/video nor existing image/video, then error
        throw new Error("Please provide either an image, a video, or keep existing media.");
      }

      if (pdf) {
        formData.append("pdf", pdf);
      } else if (currentPdfId) {
        // If there's an existing PDF but no new one, ensure its ID is passed
        // This logic depends on backend handling; often, if not provided, it's not updated
        // Or if you want to keep it, you don't append anything
      }


      const response = await axios.put(`${baseURL}/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      setSuccess("Post updated successfully!");
      // Optionally navigate back to admin posts after a delay
      setTimeout(() => {
        const prevPage = new URLSearchParams(location.search).get("page") || "news";
        const prevSection = new URLSearchParams(location.search).get("section") || "";
        navigate(`/admin/posts?page=${prevPage}&section=${prevSection}`);
      }, 2000);

    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.response?.data?.error || err.message || "Failed to update post.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const pages = [
    { value: "news", label: t("createPost.pageOptions.news") },
    { value: "programs", label: t("createPost.pageOptions.programs") },
    { value: "research", label: t("createPost.pageOptions.research") },
  ];

  const sections = {
    news: [
      { value: "announcements", label: t("createPost.sectionOptions.news.announcements") },
      { value: "events", label: t("createPost.sectionOptions.news.events") },
      { value: "webinars-workshops", label: t("createPost.sectionOptions.news.webinarsWorkshops") },
      { value: "press-releases", label: t("createPost.sectionOptions.news.pressReleases") },
    ],
    programs: [
      { value: "incubation-programs", label: t("createPost.sectionOptions.programs.incubationPrograms") },
      { value: "innovation-labs", label: t("createPost.sectionOptions.programs.innovationLabs") },
      { value: "funding-opportunities", label: t("createPost.sectionOptions.programs.fundingOpportunities") },
    ],
    research: [
      { value: "latest-publications", label: t("createPost.sectionOptions.research.latestPublications") },
      { value: "ongoing-projects", label: t("createPost.sectionOptions.research.ongoingProjects") },
      { value: "collaborations-partnerships", label: t("createPost.sectionOptions.research.collaborationsPartnerships") },
    ],
  };

  const currentSections = sections[page] || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isArabic ? <NavbarAR /> : <Navbar />}
      <main className="flex-grow py-12 bg-gray-100 min-h-[calc(100vh-160px)]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
            {t("editPost.title")}
          </h1>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">{success}</div>}

          <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            {/* Title and Content inputs */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                {t("createPost.postTitle")}
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                {t("createPost.postContent")}
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                required
              ></textarea>
            </div>
            {/* Arabic Title and Content inputs */}
            <div className="mb-6">
              <label htmlFor="titleAr" className="block text-gray-700 text-sm font-bold mb-2">
                {t("createPost.postTitleAr")}
              </label>
              <input
                type="text"
                id="titleAr"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                dir="rtl"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="contentAr" className="block text-gray-700 text-sm font-bold mb-2">
                {t("createPost.postContentAr")}
              </label>
              <textarea
                id="contentAr"
                value={contentAr}
                onChange={(e) => setContentAr(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                required
                dir="rtl"
              ></textarea>
            </div>

            {/* Page and Section Selects */}
            <div className="mb-6">
              <label htmlFor="page" className="block text-gray-700 text-sm font-bold mb-2">
                {t("createPost.page")}
              </label>
              <select
                id="page"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                {pages.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {currentSections.length > 0 && (
              <div className="mb-6">
                <label htmlFor="section" className="block text-gray-700 text-sm font-bold mb-2">
                  {t("createPost.section")}
                </label>
                <select
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">{t("createPost.selectSection")}</option>
                  {currentSections.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Existing Media Display */}
            <div className="mb-6">
              <p className="block text-gray-700 text-sm font-bold mb-2">
                {t("editPost.currentMedia")}
              </p>
              {(currentImageId || currentVideoUrl) ? (
                <div className="flex items-center space-x-4">
                  {currentImageId && (
                    <img
                      src={`${baseURL}/api/files/${currentImageId}`}
                      alt="Current Post"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  {currentVideoUrl && (
                    <div className="flex items-center text-blue-600">
                      <FaYoutube className="mr-2" /> {t("editPost.currentVideo")}: {currentVideoUrl.substring(0, 30)}...
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">{t("editPost.noCurrentMedia")}</p>
              )}
            </div>

            {currentPdfId && (
              <div className="mb-6">
                <p className="block text-gray-700 text-sm font-bold mb-2">
                  {t("editPost.currentPdf")}
                </p>
                <a
                  href={`${baseURL}/api/files/${currentPdfId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <FaFilePdf className="mr-2" /> {t("editPost.viewCurrentPdf")}
                </a>
              </div>
            )}


            {/* Media Uploads */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("createPost.uploadMedia")}
              </label>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 flex items-center"
                >
                  <FaUpload className="mr-2" /> {t("createPost.uploadImage")}
                </label>
                {image && <span className="text-gray-600 text-sm">{image.name}</span>}
              </div>

              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-gray-700 text-sm font-bold mb-2">
                  {t("createPost.youtubeVideoUrl")}
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  value={video}
                  onChange={handleVideoChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // MODIFIED: Corrected placeholder
                />
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="pdfUpload"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
                <label
                  htmlFor="pdfUpload"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600 flex items-center"
                >
                  <FaUpload className="mr-2" /> {t("createPost.uploadPdf")}
                </label>
                {pdf && <span className="text-gray-600 text-sm">{pdf.name}</span>}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)} // Go back
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
              >
                {t("createPost.cancel")}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                disabled={submitLoading}
              >
                {submitLoading ? t("createPost.saving") : t("editPost.updatePost")}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditPost;