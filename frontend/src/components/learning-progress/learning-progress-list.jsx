import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
  Badge,
  Dropdown,
  ButtonGroup,
  Pagination,
  ListGroup
} from 'react-bootstrap';
import {
  FaStar,
  FaRegStar,
  FaFilter,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSort,
  FaChartLine,
  FaLink,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { deleteLearningProgress, getAllProgress } from '../../services/Learning-Progress-Service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './learning-progress-list.css';

const LearningProgressList = () => {
  const [progressList, setProgressList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProgress();
        setProgressList(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch learning progress');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      try {
        await deleteLearningProgress(id);
        setProgressList(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error(err);
        setError('Failed to delete progress entry');
      }
    }
  };

  const filteredProgress = progressList.filter(progress => {
    const matchesSearch = progress.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      progress.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating ? progress.rating === filterRating : true;
    return matchesSearch && matchesRating;
  });

  const sortedProgress = [...filteredProgress].sort((a, b) => {
    if (sortField === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    } else {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const totalPages = Math.ceil(sortedProgress.length / itemsPerPage);
  const paginatedProgress = sortedProgress.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderRatingStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ?
            <FaStar key={star} className="text-warning" /> :
            <FaRegStar key={star} className="text-muted" />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProgressLevel = (rating) => {
    if (rating <= 2) return 'Beginner';
    if (rating <= 4) return 'Intermediate';
    return 'Advanced';
  };

  const renderResources = (resources) => {
    if (!resources || resources.length === 0) {
      return <small className="text-muted">No resources added</small>;
    }

    return (
      <ListGroup variant="flush" className="mt-3">
        {resources.map((resource, index) => (
          <ListGroup.Item key={index} className="px-0 py-2 border-0">
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none d-flex align-items-center"
            >
              <FaLink className="me-2 text-muted" />
              <span className="text-truncate" style={{ maxWidth: '200px' }}>
                {resource.link}
              </span>
              <FaExternalLinkAlt className="ms-2 text-muted" size={12} />
            </a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <Container className="py-4 learning-progress-container">
      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <FaChartLine className="me-2" />
            Learning Progresses
          </h2>
          <p className="text-muted">Track and review the learning journey</p>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => navigate('/learning-progress/new')}
          >
            <FaPlus className="me-2" />
            Add New Progress
          </Button>
        </Col>
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search progress..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={3}>
              <Dropdown as={ButtonGroup} className="w-100">
                <Button variant="outline-secondary">
                  <FaFilter className="me-2" />
                  {filterRating ? `${filterRating} star${filterRating > 1 ? 's' : ''}` : 'Filter by rating'}
                </Button>
                <Dropdown.Toggle split variant="outline-secondary" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterRating(null)}>All ratings</Dropdown.Item>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <Dropdown.Item
                      key={rating}
                      active={filterRating === rating}
                      onClick={() => setFilterRating(rating)}
                    >
                      {renderRatingStars(rating)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3}>
              <Dropdown as={ButtonGroup} className="w-100">
                <Button variant="outline-secondary">
                  <FaSort className="me-2" />
                  {sortField === 'createdAt' ? 'Date' : 'Rating'} ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
                </Button>
                <Dropdown.Toggle split variant="outline-secondary" />
                <Dropdown.Menu>
                  <Dropdown.Item
                    active={sortField === 'createdAt' && sortOrder === 'desc'}
                    onClick={() => { setSortField('createdAt'); setSortOrder('desc'); }}
                  >
                    Date (Newest first)
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={sortField === 'createdAt' && sortOrder === 'asc'}
                    onClick={() => { setSortField('createdAt'); setSortOrder('asc'); }}
                  >
                    Date (Oldest first)
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    active={sortField === 'rating' && sortOrder === 'desc'}
                    onClick={() => { setSortField('rating'); setSortOrder('desc'); }}
                  >
                    Rating (High to low)
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={sortField === 'rating' && sortOrder === 'asc'}
                    onClick={() => { setSortField('rating'); setSortOrder('asc'); }}
                  >
                    Rating (Low to high)
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your learning progress...</p>
        </div>
      ) : paginatedProgress.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h4>No learning progress found</h4>
            <p className="text-muted">
              {filterRating || searchTerm ?
                'Try adjusting your search or filter criteria' :
                'Start by adding your first learning progress entry'}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/learning-progress/new')}
            >
              <FaPlus className="me-2" />
              Add Progress Entry
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {paginatedProgress.map((progress) => (
              <Col key={progress.id}>
                <Card className="h-100 shadow-sm progress-card">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg="info" className="text-capitalize">
                        {getProgressLevel(progress.rating)}
                      </Badge>
                      <small className="text-muted">
                        {formatDate(progress.createdAt)}
                      </small>
                    </div>
                    <Card.Title className="mb-3">{progress.title}</Card.Title>
                    <Card.Text className="flex-grow-1 text-muted">
                      {progress.description.length > 150 ?
                        `${progress.description.substring(0, 150)}...` :
                        progress.description}
                    </Card.Text>

                    <div className="mt-2">
                      <small className="text-muted fw-bold">Resources:</small>
                      {renderResources(
                        typeof progress.resources === 'string'
                          ? [{ link: progress.resources }]
                          : progress.resources
                      )}
                    </div>

                    <div className="mt-3">
                      {renderRatingStars(progress.rating)}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0">
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/learning-progress/edit/${progress.id}`)}
                      >
                        <FaEdit className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(progress.id)}
                      >
                        <FaTrash className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default LearningProgressList;