import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Card,
  ListGroup,
  Spinner,
  Alert,
  ProgressBar,
  Badge,
  InputGroup
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Import the CSS file
import {
  createPlan,
  updatePlan,
  getAllPlans,
  deletePlan,
} from "../../services/LearningPlan";
import { FaSearch, FaTimes, FaPlus, FaTrash, FaEdit, FaListUl } from "react-icons/fa";

function LearningPlanForm() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({
    title: "",
    steps: [{ heading: "", description: "" }],
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Step navigation state
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPlans();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesTitle = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSteps = plan.steps.some(step => 
      step.heading.toLowerCase().includes(searchTerm.toLowerCase()) || 
      step.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesTitle || matchesSteps;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPlan({ ...currentPlan, [name]: value });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...currentPlan.steps];
    updatedSteps[index][field] = value;
    setCurrentPlan({ ...currentPlan, steps: updatedSteps });
  };

  const addStep = () => {
    setCurrentPlan({
      ...currentPlan,
      steps: [...currentPlan.steps, { heading: "", description: "" }],
    });
  };

  const removeStep = (index) => {
    const updatedSteps = [...currentPlan.steps];
    updatedSteps.splice(index, 1);
    setCurrentPlan({ ...currentPlan, steps: updatedSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        await updatePlan(editingId, currentPlan);
        setSuccess("Plan updated successfully!");
      } else {
        await createPlan(currentPlan);
        setSuccess("Plan created successfully!");
      }
      fetchPlans();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setCurrentPlan({
      title: plan.title,
      steps: plan.steps.map((step) => ({ ...step })),
    });
    setEditingId(plan.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        await deletePlan(id);
        setSuccess("Plan deleted successfully!");
        fetchPlans();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentPlan({
      title: "",
      steps: [{ heading: "", description: "" }],
    });
    setEditingId(null);
    setError(null);
  };

  // Step navigation functions
  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setCurrentStepIndex(0);
    setShowDetails(true);
  };

  const handleNextStep = () => {
    if (currentStepIndex < selectedPlan.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPlan(null);
    setCurrentStepIndex(0);
  };

  const handleJumpToStep = (index) => {
    setCurrentStepIndex(index);
  };

  return (
    <Container className="learning-plan-container fade-in">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-4">Learning Plans</h1>
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
              className="me-3"
            >
              <FaPlus className="me-2" />
              {isLoading ? "Loading..." : "Create New Plan"}
            </Button>
            
            <InputGroup className="search-container">
              <Form.Control
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
              {searchTerm && (
                <Button
                  variant="link"
                  onClick={() => setSearchTerm("")}
                  className="search-clear-btn"
                >
                  <FaTimes />
                </Button>
              )}
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          className="mb-4 fade-in"
          dismissible
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {isLoading && plans.length === 0 ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading your learning plans...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <Card className="empty-state">
          <Card.Body>
            <div className="empty-state-icon">
              <FaListUl />
            </div>
            <Card.Text className="fs-5">
              {searchTerm ? "No matching plans found" : "No learning plans found"}
            </Card.Text>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              Create Your First Plan
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredPlans.map((plan) => (
            <Col md={4} key={plan.id} className="mb-4">
              <Card className="plan-card h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{plan.title}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    <Badge bg="info" pill>
                      {plan.steps.length} {plan.steps.length === 1 ? "step" : "steps"}
                    </Badge>
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleViewDetails(plan)}
                      className="w-100 mb-2"
                    >
                      View Details
                    </Button>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="outline-warning"
                        onClick={() => handleEdit(plan)}
                        disabled={isLoading}
                        className="me-2"
                      >
                        <FaEdit className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(plan.id)}
                        disabled={isLoading}
                      >
                        <FaTrash className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Details Modal */}
      <Modal show={showDetails} onHide={handleCloseDetails} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPlan?.title} - Step {currentStepIndex + 1} of{" "}
            {selectedPlan?.steps.length}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <div>
              <ProgressBar
                now={((currentStepIndex + 1) / selectedPlan.steps.length) * 100}
                label={`${currentStepIndex + 1}/${selectedPlan.steps.length}`}
                className="step-progress"
                variant="success"
              />
              
              <div className="step-buttons">
                {selectedPlan.steps.map((step, index) => (
                  <Button
                    key={index}
                    variant={currentStepIndex === index ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => handleJumpToStep(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              
              <Card className="step-card">
                <Card.Body>
                  <Card.Title>{selectedPlan.steps[currentStepIndex].heading}</Card.Title>
                  <Card.Text className="mt-3">
                    {selectedPlan.steps[currentStepIndex].description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="step-navigation">
          <Button
            variant="outline-secondary"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={currentStepIndex === selectedPlan?.steps.length - 1}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Learning Plan" : "Create New Learning Plan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Plan Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentPlan.title}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Enter a title for your learning plan"
              />
            </Form.Group>

            <h5 className="mb-3 d-flex align-items-center">
              <span className="me-2">Steps</span>
              <Badge bg="secondary" pill>
                {currentPlan.steps.length}
              </Badge>
            </h5>
            
            {currentPlan.steps.map((step, index) => (
              <div key={index} className="mb-3 p-3 border rounded step-card">
                <Form.Group className="mb-3">
                  <Form.Label>Step {index + 1} Heading</Form.Label>
                  <Form.Control
                    type="text"
                    value={step.heading}
                    onChange={(e) =>
                      handleStepChange(index, "heading", e.target.value)
                    }
                    required
                    disabled={isLoading}
                    placeholder="Enter step heading"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(index, "description", e.target.value)
                    }
                    required
                    disabled={isLoading}
                    placeholder="Enter detailed description for this step"
                  />
                </Form.Group>
                {currentPlan.steps.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeStep(index)}
                    disabled={isLoading}
                  >
                    <FaTrash className="me-1" />
                    Remove Step
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline-primary"
              onClick={addStep}
              className="mb-3"
              disabled={isLoading}
            >
              <FaPlus className="me-1" />
              Add Step
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
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
                {editingId ? "Updating..." : "Creating..."}
              </>
            ) : editingId ? (
              "Update Plan"
            ) : (
              "Create Plan"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default LearningPlanForm;