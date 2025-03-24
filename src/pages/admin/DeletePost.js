import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const DeletePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [message, setMessage] = useState('');

  const baseURL = process.env.REACT_APP_API_URL || "link";

  const fetchPost = useCallback(async () => {
    try {
      const res = await axios.get(`${baseURL}/api/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setMessage('❌ Failed to fetch post details.');
    }
  }, [id, baseURL]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${baseURL}/api/posts/${id}`);
      setMessage('✅ Post deleted successfully! Redirecting...');
      setTimeout(() => navigate('/admin/posts'), 2000);
    } catch (err) {
      console.error('Error deleting post:', err);
      setMessage('❌ Error deleting post.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Delete Post</h2>
        {message && <p className="mb-3 text-sm text-red-600">{message}</p>}
        {post ? (
          <div>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-700 mb-4">{post.content}</p>
            {post.image && (
              <img
                src={`${baseURL}/uploads/${post.image}`}
                alt="Post"
                className="w-40 h-40 object-cover rounded-md mb-4"
              />
            )}
            {post.video && (
              <a
                href={post.video}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Video
              </a>
            )}
            {post.pdf && (
              <a
                href={`${baseURL}/uploads/${post.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View PDF
              </a>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Delete Post
            </button>
          </div>
        ) : (
          <p>Loading post details...</p>
        )}
      </div>
    </div>
  );
};

export default DeletePost;