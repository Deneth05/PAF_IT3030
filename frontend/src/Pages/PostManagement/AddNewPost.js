import React, { useState } from 'react';
import axios from 'axios';
import './post.css'
import NavBar from '../../Components/NavBar/NavBar'
function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        // Validate video duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        window.location.reload();
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      window.location.reload();
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      window.location.reload();
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/allPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
      window.location.reload();
    }
  };

  return (
    <div>
      <NavBar />
      <div className="pro-learning-container">
        <div className="pro-learning-header">
          <h2>Create New Post</h2>
        </div>

        <form className="pro-learning-form" onSubmit={handleSubmit}>
          <div className="pro-form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="pro-form-input"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="pro-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="pro-form-textarea"
              placeholder="Write your description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="pro-form-group">
            <label htmlFor="media">Media</label>
            <div className="media-preview-container">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="media-preview-item">
                  {preview.type.startsWith('video/') ? (
                    <video controls className="media-file">
                      <source src={preview.url} type={preview.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img className="media-file" src={preview.url} alt={`Media Preview ${index}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="pro-upload-wrapper">
              <label htmlFor="media" className="pro-upload-label">
                Upload Media (Images or Video)
              </label>
              <input
                id="media"
                type="file"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleMediaChange}
                className="pro-upload-input"
              />
            </div>

          </div>

          <button type="submit" className="pro-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );

}

export default AddNewPost;
