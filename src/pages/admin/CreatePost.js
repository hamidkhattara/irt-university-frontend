import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Standardized placeholder to a local asset for reliability
const placeholderImage = "/images/placeholder-image.png"; // Assuming you have this file in your public/images folder

const CreatePost = () => {
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
  const { i18n } = useTranslation(); // Use useTranslation hook
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
      setMessage('❌ You can only upload an image or a video, not both.');
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
      setMessage('❌ You can only upload an image or a video, not both.');
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
      setMessage('❌ All text fields (titles, content, page, section) are required.');
      setIsSubmitting(false);
      return;
    }

    if (!postData.image && !postData.video) {
      setMessage('❌ Please provide either an image or a video.');
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
        setMessage('✅ Post created successfully! Redirecting...');
        setTimeout(() => navigate('/admin/posts', { state: { fromCreate: true } }), 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(`❌ Error creating post: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // MODIFIED formatContentWithLinks FUNCTION for Admin Preview
  const formatContentWithLinks = (text, isArabic) => {
    if (!text) return "";

    // 1. Handle bolding (**text**)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 2. Handle coloring ([color:COLORNAME]text[/color])
    formattedText = formattedText.replace(/\[color:(.*?)]((?!\[color:).*?)\[\/color]/g, '<span style="color:$1;">$2</span>');

    // 3. Handle URLs (https://...)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formattedText = formattedText.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`;
    });

    // 4. Handle line breaks and bullet points, and apply RTL/LTR styling
    return formattedText
      .split("\n")
      .map((line) => {
        const style = isArabic ? 'text-align: right; direction: rtl;' : 'text-align: left; direction: ltr;';
        if (line.trim().startsWith("•")) {
          // For list items, ensure proper list structure and apply styling
          return `<li style="${style}">${line.replace("•", "").trim()}</li>`;
        } else if (line.trim() === "") {
          return ""; // Remove empty lines if they are not part of a paragraph
        } else {
          // For paragraphs, apply styling
          return `<p style="${style}">${line.trim()}</p>`;
        }
      })
      .join("");
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>

        {message && (
          <div className={`mb-3 text-sm ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title (English)"
            className="w-full border p-2 rounded"
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Title (Arabic)"
            className="w-full border p-2 rounded text-right"
            value={postData.title_ar}
            onChange={(e) => setPostData({ ...postData, title_ar: e.target.value })}
            required
          />

          <textarea
            placeholder="Content (English)"
            className="w-full border p-2 rounded"
            rows="6"
            value={postData.content}
            onChange={(e) => setPostData({ ...postData, content: e.target.value })}
            required
          />
          {/* Instruction for bold and color */}
          <p className="text-sm text-gray-500">
            Use `**text**` for bold, `[color:red]text[/color]` for colored text (replace `red` with any CSS color name or hex code).
          </p>


          <textarea
            placeholder="Content (Arabic)"
            className="w-full border p-2 rounded text-right"
            rows="6"
            value={postData.content_ar}
            onChange={(e) => setPostData({ ...postData, content_ar: e.target.value })}
            required
          />
          {/* Instruction for bold and color in Arabic */}
          <p className="text-sm text-gray-500 text-right">
            استخدم `**نص**` للخط العريض، `[color:red]نص[/color]` للنص الملون (استبدل `red` بأي اسم لون CSS أو رمز سداسي عشري).
          </p>

          <select
            className="w-full border p-2 rounded"
            value={postData.page}
            onChange={(e) => setPostData({ ...postData, page: e.target.value, section: '' })}
            required
          >
            <option value="">Select Page</option>
            <option value="research">Research & Insights</option>
            <option value="programs">Programs & Initiatives</option>
            <option value="news">News & Events</option>
          </select>

          {postData.page === 'research' && (
            <select
              className="w-full border p-2 rounded"
              value={postData.section}
              onChange={(e) => setPostData({ ...postData, section: e.target.value })}
              required
            >
              <option value="">Select Section</option>
              <option value="latest-publications">Latest Research Publications</option>
              <option value="ongoing-projects">Ongoing Research Projects</option>
              <option value="collaborations-partnerships">Collaborations & Partnerships</option>
            </select>
          )}

          {postData.page === 'programs' && (
            <select
              className="w-full border p-2 rounded"
              value={postData.section}
              onChange={(e) => setPostData({ ...postData, section: e.target.value })}
              required
            >
              <option value="">Select Section</option>
              <option value="innovation-labs">Innovation Labs</option>
              <option value="incubation-programs">Technology Incubation Programs</option>
              <option value="funding-opportunities">Research Funding Opportunities</option>
            </select>
          )}

          {postData.page === 'news' && (
            <select
              className="w-full border p-2 rounded"
              value={postData.section}
              onChange={(e) => setPostData({ ...postData, section: e.target.value })}
              required
            >
              <option value="">Select Section</option>
              <option value="webinars-workshops">Webinars and Workshops</option>
              <option value="announcements">Announcements</option>
              <option value="press-releases">Press Releases</option>
              <option value="events">Upcoming and Past Events</option>
            </select>
          )}

          {/* Conditional rendering for image preview */}
          {imagePreviewUrl && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Selected Image Preview:</p>
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
                Remove Image
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={handleImageChange}
            disabled={!!postData.video}
          />

          <input
            type="text"
            placeholder="YouTube Video Link"
            className="w-full border p-2 rounded"
            value={postData.video}
            onChange={handleVideoChange}
            disabled={!!imagePreviewUrl} // Disable if an image is selected for preview
          />

          <input
            type="file"
            accept="application/pdf"
            className="w-full border p-2 rounded"
            onChange={handlePdfChange}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Submit Post'}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Preview</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">English Content Preview:</h4>
              <div
                className="border p-4 rounded"
                dangerouslySetInnerHTML={{ __html: formatContentWithLinks(postData.content, false) }} // Pass isArabic = false
              />
            </div>

            <div>
              <h4 className="font-semibold">Arabic Content Preview:</h4>
              <div
                className="border p-4 rounded text-right"
                dangerouslySetInnerHTML={{ __html: formatContentWithLinks(postData.content_ar, true) }} // Pass isArabic = true
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;