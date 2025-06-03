import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';

// Standardized placeholder to a local asset for reliability
const placeholderImage = "/images/placeholder-image.png"; // Assuming you have this file in your public/images folder

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.state?.fromCreate, baseURL]);

  useEffect(() => {
    if (location.state?.fromCreate) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.fromCreate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${baseURL}/api/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Error deleting post.');
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
    return match ? match[1] : null;
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Posts</h2>
          <Link
            to="/admin/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Create New Post
          </Link>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse shadow-sm rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Image/Video</th>
                  <th className="px-4 py-2 border">PDF</th>
                  <th className="px-4 py-2 border">Page</th>
                  <th className="px-4 py-2 border">Section</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="text-center">
                    <td className="px-4 py-2 border">{post.title}</td>
                    <td className="px-4 py-2 border">
                      {post.imageId ? (
                        <img
                          src={`${baseURL}/api/files/${post.imageId}`}
                          alt={post.title}
                          className="h-14 w-14 object-cover mx-auto rounded"
                          onError={(e) => {
                            e.target.src = placeholderImage; // Fallback to local placeholder
                            e.target.onerror = null;
                          }}
                        />
                      ) : post.video ? (
                        // Display thumbnail if YouTube video, otherwise just a link
                        getYouTubeVideoId(post.video) ? (
                            <img
                                src={`https://img.youtube.com/vi/${getYouTubeVideoId(post.video)}/0.jpg`} // Standard YouTube thumbnail
                                alt="Video Thumbnail"
                                className="h-14 w-14 object-cover mx-auto rounded"
                                onError={(e) => {
                                  e.target.src = placeholderImage; // Fallback for broken thumbnails
                                  e.target.onerror = null;
                                }}
                            />
                        ) : (
                            <a
                                href={post.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                View Video
                            </a>
                        )
                      ) : (
                        'No Media'
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {post.pdfId ? (
                        <a
                          href={`${baseURL}/api/files/${post.pdfId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        'No PDF'
                      )}
                    </td>
                    <td className="px-4 py-2 border">{post.page}</td>
                    <td className="px-4 py-2 border">{post.section}</td>
                    <td className="px-4 py-2 border">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <Link
                        to={`/admin/edit/${post._id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" className="text-gray-500 p-4">
                      No posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;