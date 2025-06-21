import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next"; // Added useTranslation for localization
import { FaUpload, FaYoutube, FaFilePdf } from 'react-icons/fa'; // Added FaYoutube, FaFilePdf for icons

// Standardized placeholder to a local asset for reliability
const placeholderImage = "/images/placeholder-image.png"; // Assuming you have this file in your public/images folder

const CreatePost = () => {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const isArabic = i18n.language === 'ar'; // Check for Arabic language

  const [postData, setPostData] = useState({
    title: '',
    content: '',
    title_ar: '',
    content_ar: '',
    page: '',
    section: '',
    image: null,
    video: '',
    pdf: null,
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // State to hold the URL for the local image preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Effect to create/revoke object URL for image preview
  useEffect(() => {
    if (postData.image) {
      const url = URL.createObjectURL(postData.image);
      setImagePreviewUrl(url);
      // Clean up the object URL when the component unmounts or image changes
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [postData.image]);


  const handleImageChange = (e) => {
    if (postData.video) {
      setMessage(t('createPost.messages.imageVideoConflict')); // Localized message
      // Clear the input selection to prevent misleading state
      e.target.value = null; 
      return;
    }
    setPostData({ ...postData, image: e.target.files[0], video: '' });
    setMessage('');
  };

  const handleVideoChange = (e) => {
    // Check both currently selected image AND existing image if applicable (though this is CreatePost)
    if (postData.image) { 
      setMessage(t('createPost.messages.imageVideoConflict')); // Localized message
      return;
    }
    setPostData({ ...postData, video: e.target.value, image: null });
    setMessage('');
  };

  const handlePdfChange = (e) => {
    setPostData({ ...postData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // More comprehensive validation for required text fields
    if (!postData.title || !postData.content || !postData.title_ar || !postData.content_ar || !postData.page || !postData.section) {
      setMessage(t('createPost.messages.allFieldsRequired')); // Localized message
      setIsSubmitting(false);
      return;
    }

    if (!postData.image && !postData.video) {
      setMessage(t('createPost.messages.imageOrVideoRequired')); // Localized message
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('title_ar', postData.title_ar);
      formData.append('content_ar', postData.content_ar);
      formData.append('page', postData.page);
      formData.append('section', postData.section);
      if (postData.image) formData.append('image', postData.image);
      if (postData.video) formData.append('video', postData.video);
      if (postData.pdf) formData.append('pdf', postData.pdf);

      const response = await axios.post(`${baseURL}/api/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setMessage(t('createPost.messages.success')); // Localized message
        setTimeout(() => navigate('/admin/posts', { state: { fromCreate: true } }), 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(`${t('createPost.messages.errorPrefix')}: ${error.response?.data?.message || error.message}`); // Localized message
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatContentWithLinks = (text) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`);
  };

  // Define page and section options for selects (assuming these values are translated via i18n)
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

  const currentSections = sections[postData.page] || []; // Use postData.page to determine sections

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">{t("createPost.title")}</h2>

        {message && (
          <div className={`mb-3 text-sm ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t("createPost.postTitle")}
            className="w-full border p-2 rounded"
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder={t("createPost.postTitleAr")}
            className="w-full border p-2 rounded text-right"
            value={postData.title_ar}
            onChange={(e) => setPostData({ ...postData, title_ar: e.target.value })}
            required
          />

          <textarea
            placeholder={t("createPost.postContent")}
            className="w-full border p-2 rounded"
            rows="6"
            value={postData.content}
            onChange={(e) => setPostData({ ...postData, content: e.target.value })}
            required
          />

          <textarea
            placeholder={t("createPost.postContentAr")}
            className="w-full border p-2 rounded text-right"
            rows="6"
            value={postData.content_ar}
            onChange={(e) => setPostData({ ...postData, content_ar: e.target.value })}
            required
          />

          <select
            className="w-full border p-2 rounded"
            value={postData.page}
            onChange={(e) => setPostData({ ...postData, page: e.target.value, section: '' })}
            required
          >
            <option value="">{t("createPost.selectPage")}</option>
            {pages.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {postData.page && currentSections.length > 0 && ( // Only show section select if a page is selected and has sections
            <select
              className="w-full border p-2 rounded"
              value={postData.section}
              onChange={(e) => setPostData({ ...postData, section: e.target.value })}
              required
            >
              <option value="">{t("createPost.selectSection")}</option>
              {currentSections.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          )}

          {/* Conditional rendering for image preview */}
          {imagePreviewUrl && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">{t("createPost.imagePreview")}</p>
              <img 
                src={imagePreviewUrl} 
                alt="Preview" 
                className="max-h-40 mt-1"
                onError={(e) => {
                  e.target.src = placeholderImage; // Fallback to local placeholder
                  e.target.onerror = null;
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setPostData({ ...postData, image: null });
                  setImagePreviewUrl(null); // Explicitly clear preview URL
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                {t("createPost.removeImage")}
              </button>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-4"> {/* Added container for upload buttons */}
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={!!postData.video}
            />
            <label
              htmlFor="imageUpload"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 flex items-center"
            >
              <FaUpload className="mr-2" /> {t("createPost.uploadImage")}
            </label>
            {postData.image && <span className="text-gray-600 text-sm">{postData.image.name}</span>}
          </div>

          <input
            type="text"
            placeholder={t("createPost.youtubeVideoUrlPlaceholder")} // Localized placeholder
            className="w-full border p-2 rounded"
            value={postData.video}
            onChange={handleVideoChange}
            disabled={!!postData.image} // Disable if an image is selected for preview (removed imagePreviewUrl check for consistency)
          />

          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="pdfUpload"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfChange}
            />
            <label
              htmlFor="pdfUpload"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600 flex items-center"
            >
              <FaUpload className="mr-2" /> {t("createPost.uploadPdf")}
            </label>
            {postData.pdf && <span className="text-gray-600 text-sm">{postData.pdf.name}</span>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('createPost.creating') : t('createPost.submitPost')}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">{t("createPost.preview")}</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">{t("createPost.englishContentPreview")}:</h4>
              <div
                className="border p-4 rounded"
                dangerouslySetInnerHTML={{ __html: formatContentWithLinks(postData.content) }}
              />
            </div>

            <div>
              <h4 className="font-semibold">{t("createPost.arabicContentPreview")}:</h4>
              <div
                className="border p-4 rounded text-right"
                dangerouslySetInnerHTML={{ __html: formatContentWithLinks(postData.content_ar) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;