import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
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

  const [existingImage, setExistingImage] = useState('');
  const [existingVideo, setExistingVideo] = useState('');
  const [existingPdf, setExistingPdf] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/posts/${id}`);
      const postData = res.data;
      
      setForm({
        title: postData.title || '',
        content: postData.content || '',
        title_ar: postData.title_ar || '',
        content_ar: postData.content_ar || '',
        page: postData.page || '',
        section: postData.section || '',
        video: postData.video || '',
      });
      
      if (postData.imageId) {
        setExistingImage(postData.imageId);
      }
      if (postData.video) {
        setExistingVideo(postData.video);
      }
      if (postData.pdfId) {
        setExistingPdf(postData.pdfId);
      }
      setMessage('');
    } catch (err) {
      console.error('Error fetching post:', err);
      setMessage('❌ Failed to fetch post data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, baseURL]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (form.video || existingVideo) {
      setMessage('❌ You can only upload an image or a video, not both.');
      return;
    }
    setForm(prev => ({
      ...prev,
      image: e.target.files[0],
      video: ''
    }));
    setExistingImage('');
    setExistingVideo('');
    setMessage('');
  };

  const handleVideoChange = (e) => {
    if (form.image || existingImage) {
      setMessage('❌ You can only upload an image or a video, not both.');
      return;
    }
    setForm(prev => ({
      ...prev,
      video: e.target.value,
      image: null
    }));
    setExistingImage('');
    setMessage('');
  };

  const handlePdfChange = (e) => {
    setForm(prev => ({
      ...prev,
      pdf: e.target.files[0]
    }));
    setExistingPdf('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.image && !form.video && !existingImage && !existingVideo) {
      setMessage('❌ Please provide either an image or a video.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('title_ar', form.title_ar);
      formData.append('content_ar', form.content_ar);
      formData.append('page', form.page);
      formData.append('section', form.section);
      
      if (form.image) formData.append('image', form.image);
      if (form.video) formData.append('video', form.video);
      if (form.pdf) formData.append('pdf', form.pdf);

      await axios.put(`${baseURL}/api/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Post updated successfully! Redirecting...');
      setTimeout(() => navigate('/admin/posts'), 2000);
    } catch (err) {
      console.error('Error updating post:', err);
      setMessage(`❌ Error updating post: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
          <p>Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

        {message && (
          <p className={`mb-3 text-sm ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title (English)</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Title (Arabic)</label>
            <input
              type="text"
              name="title_ar"
              value={form.title_ar}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Content (English)</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="6"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Content (Arabic)</label>
            <textarea
              name="content_ar"
              value={form.content_ar}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="6"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Page</label>
            <select
              name="page"
              value={form.page}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Page</option>
              <option value="research">Research & Insights</option>
              <option value="programs">Programs & Initiatives</option>
              <option value="news">News & Events</option>
            </select>
          </div>

          {form.page === 'research' && (
            <div>
              <label className="block mb-1 font-medium">Section</label>
              <select
                name="section"
                value={form.section}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Section</option>
                <option value="latest-publications">Latest Research Publications</option>
                <option value="ongoing-projects">Ongoing Research Projects</option>
                <option value="collaborations-partnerships">Collaborations & Partnerships</option>
              </select>
            </div>
          )}

          {form.page === 'programs' && (
            <div>
              <label className="block mb-1 font-medium">Section</label>
              <select
                name="section"
                value={form.section}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Section</option>
                <option value="innovation-labs">Innovation Labs</option>
                <option value="incubation-programs">Technology Incubation Programs</option>
                <option value="funding-opportunities">Research Funding Opportunities</option>
              </select>
            </div>
          )}

          {form.page === 'news' && (
            <div>
              <label className="block mb-1 font-medium">Section</label>
              <select
                name="section"
                value={form.section}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Section</option>
                <option value="webinars-workshops">Webinars and Workshops</option>
                <option value="announcements">Announcements</option>
                <option value="press-releases">Press Releases</option>
                <option value="events">Upcoming and Past Events</option>
              </select>
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Current Media</label>
            {existingImage ? (
              <div>
                <p className="text-gray-500 mb-2">Current Image:</p>
                <img
                  src={`${baseURL}/api/files/${existingImage}`}
                  alt="Current"
                  className="w-40 h-40 object-cover rounded-md mb-2"
                />
              </div>
            ) : existingVideo ? (
              <div>
                <p className="text-gray-500 mb-2">Current Video:</p>
                <a
                  href={existingVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Video
                </a>
              </div>
            ) : (
              <p className="text-gray-500">No media uploaded</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Change Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              disabled={!!(form.video || existingVideo)}
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.video || existingVideo ? "Remove video first to upload image" : ""}
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Change Video Link</label>
            <input
              type="text"
              name="video"
              value={form.video}
              onChange={handleVideoChange}
              className="w-full p-2 border rounded"
              placeholder="YouTube video URL"
              disabled={!!(form.image || existingImage)}
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.image || existingImage ? "Remove image first to add video" : ""}
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Current PDF</label>
            {existingPdf ? (
              <a
                href={`${baseURL}/api/files/${existingPdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View PDF
              </a>
            ) : (
              <p className="text-gray-500">No PDF uploaded</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Change PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;