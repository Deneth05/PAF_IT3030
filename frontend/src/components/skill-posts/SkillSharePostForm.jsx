import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner, Toast, ToastContainer, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus, FaTrash } from 'react-icons/fa';

const SkillSharePostForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setToastVariant('success');
    setShowToast(true);
  };

  const showErrorToast = (message) => {
    setToastMessage(message);
    setToastVariant('danger');
    setShowToast(true);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const fetchPostData = async () => {
        try {
          setIsLoadingData(true);
          // TODO: Replace with actual API call to fetch post data
          // const response = await getPostById(id);
          const mockResponse = {
            title: 'Sample Skill Share',
            description: 'This is a sample skill share post description.',
            media: [
              { url: 'https://example.com/image1.jpg', type: 'image' },
              { url: 'https://example.com/video1.mp4', type: 'video' }
            ]
          };
          
          setFormData({
            title: mockResponse.title,
            description: mockResponse.description,
            media: mockResponse.media.map(item => ({
              file: null,
              preview: item.url,
              type: item.type
            }))
          });
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to load post data');
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchPostData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e, index) => {
    if (!e.target.files) return;
    
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      showErrorToast('Only images and videos are allowed');
      return;
    }

    const newMedia = [...formData.media];
    const preview = URL.createObjectURL(file);

    newMedia[index] = {
      file,
      preview,
      type: fileType
    };

    setFormData(prev => ({
      ...prev,
      media: newMedia
    }));
  };

  const addMediaSlot = () => {
    if (formData.media.length >= 3) {
      showErrorToast('Maximum 3 media items allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      media: [...prev.media, { file: null, preview: '', type: null }]
    }));
  };

  const removeMedia = (index) => {
    const newMedia = [...formData.media];
    newMedia.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      media: newMedia
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Prepare form data for submission
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('description', formData.description);
      
      // Append each media file
      formData.media.forEach((mediaItem, index) => {
        if (mediaItem.file) {
          postData.append(`media_${index}`, mediaItem.file);
        }
      });

      // TODO: Replace with actual API call
      // if (isEditMode) {
      //   await updatePost(id, postData);
      //   showSuccessToast('Post updated successfully!');
      // } else {
      //   await createPost(postData);
      //   showSuccessToast('Post created successfully!');
      // }
      
      // Mock API response
      console.log('Submitting:', {
        title: formData.title,
        description: formData.description,
        mediaCount: formData.media.filter(m => m.file).length
      });

      showSuccessToast(isEditMode ? 'Post updated successfully!' : 'Post created successfully!');

      setTimeout(() => {
        navigate('/skill-share');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message ||
        (isEditMode ? 'Failed to update post' : 'Failed to create post'));
      showErrorToast(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading post data...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white">
              <h3 className="mb-0">
                {isEditMode ? 'Edit Skill Share Post' : 'Create a Skill Share Post'}
              </h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter a title for your skill share"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe the skill you're sharing and what others can learn"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Media (Photos/Videos)</Form.Label>
                  <p className="text-muted small">You can upload up to 3 photos or videos</p>
                  
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    {formData.media.map((mediaItem, index) => (
                      <div key={index} className="position-relative" style={{ width: '150px', height: '150px' }}>
                        {mediaItem.preview ? (
                          <>
                            {mediaItem.type === 'image' ? (
                              <Image 
                                src={mediaItem.preview} 
                                alt={`Preview ${index + 1}`}
                                thumbnail
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <video 
                                src={mediaItem.preview}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                controls
                              />
                            )}
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1 rounded-circle"
                              onClick={() => removeMedia(index)}
                              style={{ width: '25px', height: '25px', padding: '0' }}
                            >
                              <FaTrash size={10} />
                            </Button>
                          </>
                        ) : (
                          <div className="border rounded d-flex flex-column justify-content-center align-items-center"
                            style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
                            <Form.Control
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleMediaChange(e, index)}
                              className="d-none"
                              id={`media-upload-${index}`}
                            />
                            <Form.Label htmlFor={`media-upload-${index}`} className="text-center" style={{ cursor: 'pointer' }}>
                              <FaPlus size={24} className="mb-2" />
                              <div>Add {index === 0 ? 'Primary' : 'Additional'} Media</div>
                            </Form.Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {formData.media.length < 3 && (
                    <Button
                      variant="outline-primary"
                      onClick={addMediaSlot}
                      className="mt-2"
                    >
                      <FaPlus className="me-2" />
                      Add Another Media Slot
                    </Button>
                  )}
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Post' : 'Create Post'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SkillSharePostForm;