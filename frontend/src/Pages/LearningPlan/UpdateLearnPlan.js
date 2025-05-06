import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import './LearningPlan.css';
import NavBar from '../../Components/NavBar/NavBar';

function UpdateLearnPlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    steps: [{ heading: '', description: '' }],
    postOwnerID: '',
    postOwnerName: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/learningPlan/${id}`)
      .then((response) => {
        const { title, steps, postOwnerID, postOwnerName } = response.data;
        // Ensure steps exists and has at least one item
        const formattedSteps = steps && steps.length > 0 ? steps : [{ heading: '', description: '' }];
        setFormData({ 
          title, 
          steps: formattedSteps, 
          postOwnerID, 
          postOwnerName 
        });
      })
      .catch((error) => console.error('Error fetching learning plan:', error));
  }, [id]);

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index][field] = value;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { heading: '', description: '' }]
    });
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index);
      setFormData({ ...formData, steps: updatedSteps });
    }
  };

  const moveStepUp = (index) => {
    if (index > 0) {
      const updatedSteps = [...formData.steps];
      [updatedSteps[index], updatedSteps[index - 1]] = [updatedSteps[index - 1], updatedSteps[index]];
      setFormData({ ...formData, steps: updatedSteps });
    }
  };

  const moveStepDown = (index) => {
    if (index < formData.steps.length - 1) {
      const updatedSteps = [...formData.steps];
      [updatedSteps[index], updatedSteps[index + 1]] = [updatedSteps[index + 1], updatedSteps[index]];
      setFormData({ ...formData, steps: updatedSteps });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/learningPlan/${id}`, formData);
      alert('Learning plan updated successfully!');
      navigate('/myLearningPlan');
    } catch (error) {
      console.error('Error updating learning plan:', error);
      alert('Failed to update learning plan.');
    }
  };

  return (
    <div className="learning-plan-page">
      <NavBar />
      <div className="learning-plan-container">
        <div className="learning-plan-header">
          <h2>Update Learning Plan</h2>
          <p className="subtitle">Modify your learning journey steps</p>
        </div>

        <form className="learning-plan-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Plan Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. Mastering React Hooks"
              className="form-input"
            />
          </div>

          <div className="steps-section">
            <div className="steps-header">
              <h3>Learning Steps</h3>
              <button type="button" onClick={addStep} className="add-step-btn">
                <Plus size={16} /> Add Step
              </button>
            </div>

            {formData.steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-header">
                  <span className="step-number">Step {index + 1}</span>
                  <div className="step-actions">
                    <button type="button" onClick={() => moveStepUp(index)} className="icon-btn" disabled={index === 0}>
                      <ChevronUp size={18} />
                    </button>
                    <button type="button" onClick={() => moveStepDown(index)} className="icon-btn" disabled={index === formData.steps.length - 1}>
                      <ChevronDown size={18} />
                    </button>
                    <button type="button" onClick={() => removeStep(index)} className="icon-btn delete-btn" disabled={formData.steps.length === 1}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor={`heading-${index}`}>Step Title</label>
                  <input
                    id={`heading-${index}`}
                    type="text"
                    value={step.heading}
                    onChange={(e) => handleStepChange(index, 'heading', e.target.value)}
                    required
                    placeholder="e.g. Understand useState Hook"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`description-${index}`}>Step Description</label>
                  <textarea
                    id={`description-${index}`}
                    value={step.description}
                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                    required
                    rows={3}
                    placeholder="Describe what you'll learn in this step"
                    className="form-textarea"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Update Learning Plan <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateLearnPlan;