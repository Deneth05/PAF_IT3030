import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Alert, Container, Spinner, Row, Col, Modal } from 'react-bootstrap';
import SkillPostService from '../../services/SkillPostAPI/SkillPostService';

// Cloudinary configuration 
const CLOUDINARY_CLOUD_NAME = "dtu0zojzx";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

const PostCreationForm = () => {
  const [post, setPost] = useState({
    title: '',
    description: '',
    mediaUrls: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingPosts, setExistingPosts] = useState([]);
  const [showExistingPosts, setShowExistingPosts] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch existing posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await SkillPostService.getAllPosts();
        setExistingPosts(posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + post.mediaUrls.length > 3) {
      setError('Maximum 3 media files allowed');
      return;
    }

    setUploadingMedia(true);
    setError('');

    try {
      for (const file of files) {
        // Validate file
        if (!file.type.match('image.*|video.*')) {
          setError('Only images (JPEG/PNG) and videos (MP4) allowed');
          continue;
        }

        if (file.size > (file.type.match('video.*') ? 30000000 : 5000000)){
          setError(file.type.match('video.*') 
            ? 'Videos must be <30MB' 
            : 'Images must be <5MB');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        
        if (data.secure_url) {
          setPost(prev => ({
            ...prev,
            mediaUrls: [...prev.mediaUrls, data.secure_url]
          }));
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleRemoveMedia = (index) => {
    setPost(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!post.title || !post.description) {
      setError('Title and description are required');
      setIsLoading(false);
      return;
    }

    try {
      await SkillPostService.createPost(post);
      setSuccess('Post created successfully!');
      setPost({ title: '', description: '', mediaUrls: [] });
      const posts = await SkillPostService.getAllPosts();
      setExistingPosts(posts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const openMediaModal = (index) => {
    setSelectedMediaIndex(index);
    setShowMediaModal(true);
  };

  const renderMediaPreview = (url, index) => {
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
    
    return (
      <div key={index} className="media-preview" onClick={() => openMediaModal(index)}>
        {isVideo ? (
          <>
            <video className="img-thumbnail">
              <source src={url} type={`video/${url.split('.').pop()}`} />
            </video>
            <div className="play-icon">▶</div>
          </>
        ) : (
          <img src={url} alt={`Preview ${index}`} className="img-thumbnail" />
        )}
        <button 
          className="remove-media-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveMedia(index);
          }}
        >
          &times;
        </button>
      </div>
    );
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow">
        <Card.Header as="h5" className="bg-primary text-white">
          Create New Skill Post
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title*</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                required
                maxLength={100}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description*</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={post.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description"
                required
                maxLength={500}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Media Upload</Form.Label>
              <div className="media-upload-container mb-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  accept="image/*,video/mp4"
                  multiple
                  style={{ display: 'none' }}
                />
                
                <Button 
                  variant="outline-secondary"
                  onClick={() => fileInputRef.current.click()}
                  disabled={post.mediaUrls.length >= 3 || uploadingMedia}
                >
                  {uploadingMedia ? (
                    <><Spinner size="sm" className="me-2" /> Uploading...</>
                  ) : (
                    `Upload Media (${post.mediaUrls.length}/3)`
                  )}
                </Button>
                
                <Form.Text className="d-block mt-2">
                  Upload up to 3 images (JPEG/PNG) or videos (MP4). Max 5MB for images, 30MB for videos.
                </Form.Text>
                
                {post.mediaUrls.length > 0 && (
                  <Row className="mt-3 g-2">
                    {post.mediaUrls.map((url, index) => (
                      <Col xs={4} key={index}>
                        {renderMediaPreview(url, index)}
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button 
                variant="info" 
                onClick={() => setShowExistingPosts(!showExistingPosts)}
              >
                {showExistingPosts ? 'Hide Posts' : 'Show Existing Posts'}
              </Button>

              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? <><Spinner size="sm" className="me-2" /> Creating...</> : 'Create Post'}
              </Button>
            </div>
          </Form>

          <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Media Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {selectedMediaIndex !== null && post.mediaUrls[selectedMediaIndex] && (
                post.mediaUrls[selectedMediaIndex].match(/\.mp4$/i) ? (
                  <video controls className="w-100">
                    <source src={post.mediaUrls[selectedMediaIndex]} type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    src={post.mediaUrls[selectedMediaIndex]} 
                    alt="Full preview" 
                    className="img-fluid"
                  />
                )
              )}
            </Modal.Body>
          </Modal>

          {showExistingPosts && (
            <div className="mt-4">
              <h5>Existing Posts</h5>
              {existingPosts.length === 0 ? (
                <Alert variant="info">No posts found</Alert>
              ) : (
                <div className="list-group">
                  {existingPosts.map((p) => (
                    <div key={p._id} className="list-group-item">
                      <h6>{p.title}</h6>
                      <p>{p.description}</p>
                      {p.mediaUrls?.length > 0 && (
                        <Row className="g-2 mt-2">
                          {p.mediaUrls.map((url, idx) => (
                            <Col xs={4} key={idx}>
                              {url.match(/\.mp4$/i) ? (
                                <video className="w-100 img-thumbnail">
                                  <source src={url} type="video/mp4" />
                                </video>
                              ) : (
                                <img src={url} alt="" className="w-100 img-thumbnail" />
                              )}
                            </Col>
                          ))}
                        </Row>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      <style>{`
        .media-preview {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .media-preview:hover {
          transform: scale(1.03);
        }
        .media-preview .img-thumbnail {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }
        .remove-media-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
        }
        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 24px;
          text-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
      `}</style>
    </Container>
  );
};

export default PostCreationForm;



// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Alert, Container, Spinner } from 'react-bootstrap';
// import SkillPostService from '../../services/SkillPostAPI/SkillPostService';

// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtu0zojzx/image/upload";
// const CLOUDINARY_UPLOAD_PRESET = "ml_default";

// const PostCreationForm = () => {
//   const [post, setPost] = useState({
//     title: '',
//     description: '',
//     mediaUrls: []
//   });
//   const [mediaUrl, setMediaUrl] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [existingPosts, setExistingPosts] = useState([]);
//   const [showExistingPosts, setShowExistingPosts] = useState(false);

//   // Fetch existing posts on component mount
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const posts = await SkillPostService.getAllPosts();
//         setExistingPosts(posts);
//       } catch (err) {
//         console.error('Error fetching posts:', err);
//       }
//     };
//     fetchPosts();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPost(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddMedia = () => {
//     if (mediaUrl.trim() && !post.mediaUrls.includes(mediaUrl.trim())) {
//       setPost(prev => ({
//         ...prev,
//         mediaUrls: [...prev.mediaUrls, mediaUrl.trim()]
//       }));
//       setMediaUrl('');
//     }
//   };

//   const handleRemoveMedia = (index) => {
//     setPost(prev => ({
//       ...prev,
//       mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setIsLoading(true);

//     if (!post.title || !post.description) {
//       setError('Title and description are required');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await SkillPostService.createPost(post);
//       setSuccess('Post created successfully!');
//       // Reset form
//       setPost({
//         title: '',
//         description: '',
//         mediaUrls: []
//       });
//       // Refresh existing posts
//       const posts = await SkillPostService.getAllPosts();
//       setExistingPosts(posts);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create post');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleMediaUrlKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleAddMedia();
//     }
//   };

//   return (
//     <Container className="mt-5 mb-5">
//       <Card className="shadow">
//         <Card.Header as="h5" className="bg-primary text-white">
//           Create New Skill Post
//         </Card.Header>
//         <Card.Body>
//           {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
//           {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Title*</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="title"
//                 value={post.title}
//                 onChange={handleInputChange}
//                 placeholder="Enter post title"
//                 required
//                 maxLength={100}
//               />
//               <Form.Text className="text-muted">
//                 Maximum 100 characters
//               </Form.Text>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Description*</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={4}
//                 name="description"
//                 value={post.description}
//                 onChange={handleInputChange}
//                 placeholder="Enter detailed description"
//                 required
//                 maxLength={500}
//               />
//               <Form.Text className="text-muted">
//                 Maximum 500 characters
//               </Form.Text>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Media URLs</Form.Label>
//               <div className="d-flex mb-2">
//                 <Form.Control
//                   type="url"
//                   value={mediaUrl}
//                   onChange={(e) => setMediaUrl(e.target.value)}
//                   onKeyPress={handleMediaUrlKeyPress}
//                   placeholder="Enter media URL (image/video)"
//                   pattern="https?://.+"
//                 />
//                 <Button 
//                   variant="secondary" 
//                   onClick={handleAddMedia}
//                   className="ms-2"
//                   disabled={!mediaUrl.trim()}
//                 >
//                   Add
//                 </Button>
//               </div>
              
//               {post.mediaUrls.length > 0 && (
//                 <div className="mb-3">
//                   <h6>Attached Media:</h6>
//                   <ul className="list-group">
//                     {post.mediaUrls.map((url, index) => (
//                       <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
//                         <a href={url} target="_blank" rel="noopener noreferrer" className="text-truncate" style={{ maxWidth: '70%' }}>
//                           {url}
//                         </a>
//                         <Button 
//                           variant="outline-danger" 
//                           size="sm"
//                           onClick={() => handleRemoveMedia(index)}
//                         >
//                           Remove
//                         </Button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </Form.Group>

//             <div className="d-flex justify-content-between">
//               <Button 
//                 variant="info" 
//                 onClick={() => setShowExistingPosts(!showExistingPosts)}
//                 className="mb-3"
//               >
//                 {showExistingPosts ? 'Hide Existing Posts' : 'Show Existing Posts'}
//               </Button>

//               <Button 
//                 variant="primary" 
//                 type="submit"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Spinner
//                       as="span"
//                       animation="border"
//                       size="sm"
//                       role="status"
//                       aria-hidden="true"
//                       className="me-2"
//                     />
//                     Creating...
//                   </>
//                 ) : 'Create Post'}
//               </Button>
//             </div>
//           </Form>

//           {showExistingPosts && (
//             <div className="mt-4">
//               <h5>Existing Posts</h5>
//               {existingPosts.length === 0 ? (
//                 <Alert variant="info">No posts found</Alert>
//               ) : (
//                 <div className="list-group">
//                   {existingPosts.map((p) => (
//                     <div key={p._id} className="list-group-item">
//                       <h6>{p.title}</h6>
//                       <p className="mb-1">{p.description}</p>
//                       {p.mediaUrls && p.mediaUrls.length > 0 && (
//                         <small className="text-muted">
//                           {p.mediaUrls.length} media file(s) attached
//                         </small>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default PostCreationForm;