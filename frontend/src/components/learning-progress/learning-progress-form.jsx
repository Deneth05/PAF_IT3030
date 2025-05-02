import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner, ListGroup, InputGroup, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { FaLightbulb, FaPlus, FaTrash } from 'react-icons/fa';
import { learningTemplates } from '../../types/learningTemplates';
import { createLearningProgress, getProgressById, updateLearningProgress } from '../../services/Learning-Progress-Service';

const LearningProgressForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: 0,
    createdAt: new Date(),
    resources: [{ link: '' }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

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
      const fetchProgressData = async () => {
        try {
          setIsLoadingData(true);
          const response = await getProgressById(id);
          if (response) {
            setFormData({
              title: response.title,
              description: response.description,
              rating: Number(response.rating) || 0,
              createdAt: new Date(response.createdAt),
              resources: response.resources?.length ?
                response.resources :
                [{ link: '' }]
            });
          }
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to load progress data');
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchProgressData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResourceChange = (index, e) => {
    const newResources = [...formData.resources];
    newResources[index].link = e.target.value;
    setFormData(prev => ({
      ...prev,
      resources: newResources
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { link: '' }]
    }));
  };

  const removeResource = (index) => {
    const newResources = [...formData.resources];
    newResources.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      resources: newResources.length ? newResources : [{ link: '' }]
    }));
  };

  const applyTemplate = (template) => {
    setFormData({
      title: template.title,
      description: template.description,
      rating: Number(template.rating) || 0,
      createdAt: new Date(),
      resources: template.resources || [{ link: '' }]
    });
    setShowTemplates(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const progressData = {
        ...formData,
        userId: localStorage.getItem('userId'),
        resources: formData.resources.filter(resource => resource.link.trim() !== '')
      };

      if (isEditMode) {
        await updateLearningProgress(id, progressData);
        showSuccessToast('Learning progress updated successfully!');
      } else {
        await createLearningProgress(progressData);
        showSuccessToast('Learning progress created successfully!');
      }

      setTimeout(() => {
        navigate('/learning-progress');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message ||
        (isEditMode ? 'Failed to update learning progress' : 'Failed to create learning progress'));
      showErrorToast(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading learning progress data...</p>
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
                {isEditMode ? 'Edit Learning Progress' : 'Tell us about your learning progress'}
              </h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  {success} Redirecting...
                </Alert>
              )}

              {!isEditMode && (
                <div className="mb-4">
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="d-flex align-items-center"
                  >
                    <FaLightbulb className="me-2" />
                    {showTemplates ? 'Hide Templates' : 'Show Templates'}
                  </Button>

                  {showTemplates && (
                    <Card className="mt-3">
                      <Card.Header>Select a Template</Card.Header>
                      <ListGroup variant="flush">
                        {learningTemplates.map((template, index) => (
                          <ListGroup.Item
                            key={index}
                            action
                            onClick={() => applyTemplate(template)}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <span>{template.name}</span>
                            <div>
                              Rating: {template.rating || 0}/5
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                  )}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter learning progress title"
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
                    placeholder="Describe your learning progress"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Resources (Links)</Form.Label>
                  {formData.resources.map((resource, index) => (
                    <InputGroup key={index} className="mb-2">
                      <Form.Control
                        type="url"
                        value={resource.link}
                        onChange={(e) => handleResourceChange(index, e)}
                        placeholder="https://example.com"
                      />
                      <Button
                        variant="outline-danger"
                        onClick={() => removeResource(index)}
                        disabled={formData.resources.length === 1}
                      >
                        <FaTrash />
                      </Button>
                    </InputGroup>
                  ))}
                  <Button
                    variant="outline-primary"
                    onClick={addResource}
                    className="mt-2"
                  >
                    <FaPlus className="me-2" />
                    Add Another Resource
                  </Button>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Progress Rating (1-5)</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Rate your learning progress from 1 (lowest) to 5 (highest)
                  </Form.Text>
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
                        {isEditMode ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Learning Progress' : 'Save Learning Progress'
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

export default LearningProgressForm;