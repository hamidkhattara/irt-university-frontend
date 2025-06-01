import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
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
    existingImageId: null,
    existingPdfId: null
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/posts/${id}`);
        if (response.data) {
          const post = response.data;
          
          setPostData({
            title: post.title || '',
            content: post.content || '',
            title_ar: post.title_ar || '',
            content_ar: post.content_ar || '',
            page: post.page || '',
            section: post.section || '',
            image: null,
            video: post.video || '',
            pdf: null,
            existingImageId: post.imageId || null,
            existingPdfId: post.pdfId || null
          });
          setError(null);
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error.response?.data?.message || error.message || 'Post not found');
        setMessage(`❌ Error loading post: ${error.response?.data?.message || error.message || 'Post not found'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, baseURL]);

  const handleImageChange = (e) => {
    if (postData.video) {
      setMessage('❌ You can only upload an image or a video, not both.');
      return;
    }
    setPostData({ ...postData, image: e.target.files[0], video: '' });
    setMessage('');
  };

  const handleVideoChange = (e) => {
    if (postData.image || postData.existingImageId) {
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

    if (!postData.image && !postData.video && !postData.existingImageId) {
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

      const response = await axios.put(`${baseURL}/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setMessage('✅ Post updated successfully! Redirecting...');
        setTimeout(() => navigate('/admin/posts'), 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(`❌ Error updating post: ${error.response?.data?.message || error.message || 'Failed to update post'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatContentWithLinks = (text) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`);
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
          <p>Loading post data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
          <div className="text-red-600 mb-4">
            Error: {error}
          </div>
          <button
            onClick={() => navigate('/admin/posts')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

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

          <textarea
            placeholder="Content (Arabic)"
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

          {postData.existingImageId && !postData.image && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Current Image:</p>
              <img 
                src={`${baseURL}/api/files/${postData.existingImageId}`} 
                alt="Current" 
                className="max-h-40 mt-1"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                }}
              />
              <button
                type="button"
                onClick={() => setPostData({ ...postData, existingImageId: null })}
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
            disabled={!!(postData.image || postData.existingImageId)}
          />

          {postData.existingPdfId && !postData.pdf && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Current PDF:</p>
              <a 
                href={`${baseURL}/api/files/${postData.existingPdfId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Current PDF
              </a>
              <button
                type="button"
                onClick={() => setPostData({ ...postData, existingPdfId: null })}
                className="ml-4 text-sm text-red-600 hover:text-red-800"
              >
                Remove PDF
              </button>
            </div>
          )}

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
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Preview</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">English Content Preview:</h4>
              <div
                className="border p-4 rounded"
                dangerouslySetInnerHTML={{ __html: formatContentWithLinks(postData.content) }}
              />
            </div>

            <div>
              <h4 className="font-semibold">Arabic Content Preview:</h4>
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

export default EditPost; 