import { useState } from "react";
import axios from "../../api/axiosInstance";
import './Register.css'; // Create this CSS file for styling

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    skills: [{ name: "", level: "beginner" }],
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const skills = [...formData.skills];
    skills[index][name] = value;
    setFormData({
      ...formData,
      skills
    });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: "", level: "beginner" }]
    });
  };

  const removeSkill = (index) => {
    const skills = [...formData.skills];
    skills.splice(index, 1);
    setFormData({
      ...formData,
      skills
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.userName) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }
    
    // Validate skills
    formData.skills.forEach((skill, index) => {
      if (!skill.name) {
        newErrors[`skill-${index}`] = "Skill name is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        userName: formData.userName,
        skillsInterested: formData.skills,
      };
      
      const res = await axios.post("http://localhost:8081/api/auth/register", payload);
      localStorage.setItem("token", res.data.token);
      // Redirect or show success message
      alert("Registration successful! Welcome to our platform.");
    } catch (err) {
      let errorMessage = "Registration failed!";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="register-form">

        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Username*</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={errors.userName ? "error" : ""}
          />
          {errors.userName && <span className="error-message">{errors.userName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label>Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
        </div>

        <div className="skills-section">
          <label>Skills & Interests</label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="skill-row">
              <input
                type="text"
                name="name"
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, e)}
                className={errors[`skill-${index}`] ? "error" : ""}
              />
              <select
                name="level"
                value={skill.level}
                onChange={(e) => handleSkillChange(index, e)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="remove-skill"
                >
                  ×
                </button>
              )}
              {errors[`skill-${index}`] && (
                <span className="error-message">{errors[`skill-${index}`]}</span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSkill}
            className="add-skill"
          >
            + Add Skill
          </button>
        </div>

        <div className="form-group terms">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className={errors.termsAccepted ? "error" : ""}
            />
            I agree to the Terms and Conditions and Privacy Policy*
          </label>
          {errors.termsAccepted && (
            <span className="error-message">{errors.termsAccepted}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? "Registering..." : "Create Account"}
        </button>

        <div className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </form>
    </div>
  );
}

export default Register;