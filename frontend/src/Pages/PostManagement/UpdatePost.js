import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMediaPreviews, setNewMediaPreviews] = useState([]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || '');
        setDescription(post.description || '');
        setExistingMedia(post.media || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl));
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;

    const validFiles = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }

      validFiles.push(file);
    }

    setNewMedia(validFiles);
    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewMediaPreviews(previews);
  };

  const handleRemoveNewMedia = (index) => {
    const updatedPreviews = [...newMediaPreviews];
    const updatedMedia = [...newMedia];

    URL.revokeObjectURL(updatedPreviews[index].preview); // Clean up memory
    updatedPreviews.splice(index, 1);
    updatedMedia.splice(index, 1);

    setNewMediaPreviews(updatedPreviews);
    setNewMedia(updatedMedia);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/myPosts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };


  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <NavBar/>
      <div className="pro-learning-container">
      <div className="pro-learning-header">
          <h2>Update Post</h2>
        </div>
        <form onSubmit={handleSubmit} className="pro-learning-form">
          <div className="pro-form-group">
            <label>Title</label>
            <input
            className="pro-form-input"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="pro-form-group">
            <label>Description</label>
            <textarea
              placeholder="Description"
              className="pro-form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="pro-form-group">
            <label>Media</label>
            <div className="media-preview-wrapper">
              {existingMedia.map((mediaUrl, index) => (
                <div key={index} className="media-preview-item">
                  {mediaUrl.endsWith('.mp4') ? (
                    <video controls>
                      <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={`http://localhost:8080${mediaUrl}`} alt={`Media ${index}`} />
                  )}
                  <button
                    className="media-delete-btn"
                    type="button"
                    onClick={() => handleDeleteMedia(mediaUrl)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              {newMediaPreviews.length > 0 && (
                <div className="media-preview-wrapper">
                  {newMediaPreviews.map((item, index) => (
                    <div key={index} className="media-preview-item">
                      {item.file.type === 'video/mp4' ? (
                        <video controls>
                          <source src={item.preview} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={item.preview} alt={`Preview ${index}`} />
                      )}
                      <button
                        type="button"
                        className="media-delete-btn"
                        onClick={() => handleRemoveNewMedia(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className="file-upload-wrapper">
              <label htmlFor="newMedia" className="upload-label">
              Upload Media (Image/Video)
              </label>
              <input
                id="newMedia"
                type="file"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleNewMediaChange}
                className="hidden-file-input"
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">Update Post</button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePost;
