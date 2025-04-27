import React, { useState } from 'react';
import { createComment } from '../../services/commentService';
import 'bootstrap/dist/css/bootstrap.min.css';

const CommentCreationForm = () => {
  const [formData, setFormData] = useState({
    postId: '',
    userId: '',
    username: '',
    text: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    
    try {
      const commentData = {
        postId: formData.postId,
        userId: formData.userId,
        username: formData.username,
        text: formData.text
      };
      
      await createComment(commentData);
      setSubmissionStatus('success');
      setFormData({
        postId: '',
        userId: '',
        username: '',
        text: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmissionStatus(null), 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Create New Comment</h4>
            </div>
            <div className="card-body">
              {submissionStatus === 'success' && (
                <div className="alert alert-success">
                  Comment submitted successfully!
                </div>
              )}
              {submissionStatus === 'error' && (
                <div className="alert alert-danger">
                  Failed to submit comment. Please try again.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="postId" className="form-label">Post ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="postId"
                      name="postId"
                      value={formData.postId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="userId" className="form-label">User ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userId"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="text" className="form-label">Comment *</label>
                  <textarea
                    className="form-control"
                    id="text"
                    name="text"
                    rows="4"
                    value={formData.text}
                    onChange={handleInputChange}
                    required
                    placeholder="Write your comment here..."
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submissionStatus === 'submitting'}
                  >
                    {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Comment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCreationForm;