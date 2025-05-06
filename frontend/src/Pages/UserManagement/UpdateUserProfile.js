import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaCamera, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './UpdateFrom.css';
import NavBar from '../../Components/NavBar/NavBar';

function UpdateUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    profilePicture: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/${id}`);
        const user = response.data;
        setFormData({
          fullname: user.fullname,
          email: user.email,
          password: '',
          phone: user.phone,
          profilePicture: user.profilePicture
        });
        setPreviewImage(user.profilePicture);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to load user data');
      }
    };

    fetchUserData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewImage(formData.profilePicture);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation (only if password is being changed)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Must contain at least one uppercase letter';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Must contain at least one special character';
      }
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // First upload image if new one was selected
      let profilePictureUrl = formData.profilePicture;
      
      if (profileImage) {
        const formDataImg = new FormData();
        formDataImg.append('file', profileImage);
        
        const uploadResponse = await axios.post(
          'http://localhost:8080/upload', // Your upload endpoint
          formDataImg,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        profilePictureUrl = uploadResponse.data.url;
      }

      // Then update user data
      const updateData = {
        ...formData,
        profilePicture: profilePictureUrl
      };

      const response = await axios.put(
        `http://localhost:8080/user/${id}`,
        updateData
      );

      alert('Profile updated successfully!');
      navigate('/userProfile');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'An error occurred while updating profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="update-profile-page">
      <NavBar />
      <div className="update-profile-container">
        <div className="update-profile-card">
          <h2 className="update-profile-title">Update Your Profile</h2>
          
          <div className="profile-image-section">
            <div className="avatar-upload">
              <div className="avatar-edit">
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
                <label htmlFor="imageUpload">
                  <FaCamera className="camera-icon" />
                </label>
              </div>
              <div className="avatar-preview">
                <img 
                  src={previewImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullname)}&background=2563EB&color=ffffff`} 
                  alt="Profile" 
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullname)}&background=2563EB&color=ffffff`;
                  }}
                />
                {previewImage && previewImage !== formData.profilePicture && (
                  <button className="remove-image-btn" onClick={removeImage}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="update-profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="input-icon" /> Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="input-icon" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaLock className="input-icon" /> Password (leave blank to keep current)
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
                {formData.password && !errors.password && (
                  <div className="password-strength">
                    <span className="strength-text">Password strength: </span>
                    <span className="strength-indicator strong">Strong</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaPhone className="input-icon" /> Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const re = /^[0-9\b]{0,10}$/;
                    if (re.test(e.target.value)) {
                      handleInputChange(e);
                    }
                  }}
                  maxLength="10"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserProfile;