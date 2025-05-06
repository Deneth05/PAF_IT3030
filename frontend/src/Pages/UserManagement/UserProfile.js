import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import NavBar from '../../Components/NavBar/NavBar';
import { Trash2, Mail, Phone, Pencil } from 'lucide-react';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userID');
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        if (!userId) {
          console.error('No userID found in localStorage');
          navigate('/login');
          return;
        }
        const response = await axios.get(`http://localhost:8080/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to permanently delete your profile? This action cannot be undone.')) {
      axios.delete(`http://localhost:8080/user/${userId}`)
        .then(() => {
          alert('Profile deleted successfully!');
          localStorage.removeItem('userID');
          navigate('/');
        })
        .catch(error => {
          console.error('Error deleting profile:', error);
          alert('Failed to delete profile. Please try again.');
        });
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-error-container">
        <h2>Oops!</h2>
        <p>Failed to load your profile data.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <NavBar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <img 
                src={userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullname)}&background=2563EB&color=ffffff`} 
                alt="Profile" 
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullname)}&background=2563EB&color=ffffff`;
                }}
              />
              <h2 className="profile-name">{userData.fullname}</h2>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-icon"><Mail size={24}/></span>
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-value">{userData.email}</span>
              </div>
            </div>

            {userType !== 'google' && userData.phone && (
              <div className="detail-item">
                <span className="detail-icon"><Phone /></span>
                <div className="detail-content">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{userData.phone}</span>
                </div>
              </div>
            )}

            <div className="profile-actions">
              {userType !== 'google' && (
                <button
                  className="btn btn-update"
                  onClick={() => navigate(`/updateUserProfile/${userId}`)}
                >
                  <Pencil /> Update Profile
                </button>
              )}
              <button
                className="btn btn-delete"
                onClick={handleDeleteProfile}
              >
                <Trash2 size={24}/> Delete Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;