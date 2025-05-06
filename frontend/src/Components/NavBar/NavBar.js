import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import './NavBar.css';
import axios from 'axios';

function NavBar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownpro, setShowDropdownPro] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userID');
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/markAsRead`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate('/')}>
          <span>LearnX</span>
        </div>
      </div>

      <div className="navbar-right">
        <nav className="nav-items">
          <div className="nav-item" onClick={() => navigate('/allPost')}>Posts</div>
          <div className="nav-item" onClick={() => navigate('/trending')}>Trending</div>
          <div className="nav-item" onClick={() => navigate('/allLearningProgress')}>Learning Progress</div>
          <div className="nav-item" onClick={() => navigate('/allLearningPlan')}>Learning Plan</div>
        </nav>

        <div className="nav-actions" ref={dropdownRef}>
          <div className="nav-action" onClick={() => setShowDropdown(!showDropdown)}>
            <FaBell className="action-icon" />
            {notifications.some((n) => !n.read) && <span className="notification-badge"></span>}
          </div>

          {showDropdown && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <span>Notifications</span>

              </div>
              <div className="dropdown-list">
                {notifications.length === 0 ? (
                  <p className="empty-text">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className={`dropdown-item ${notification.read ? 'read' : 'unread'}`}>
                      <div className="item-content">
                        <p>{notification.message}</p>
                        <small>{formatDate(notification.createdAt)}</small>
                      </div>
                      <div className="item-actions">
                        {!notification.read && (
                          <IoMdCheckmarkCircleOutline onClick={() => handleMarkAsRead(notification.id)} />
                        )}
                        <RiDeleteBin6Fill onClick={() => handleDelete(notification.id)} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="nav-action" onClick={() => setShowDropdownPro(!showDropdownpro)}>
            <FaUser className="action-icon" />
          </div>
          {showDropdownpro && (
            <div className="profile-dropdown ">
              <div className="dropdown-header">
                <span>Profile Details</span>
              </div>
              <div className='nav_side_pro'>
                <p className='nav_side_pro_item' onClick={() => navigate('/userProfile')}>View Profile Details</p>
                <p className='nav_side_pro_item' onClick={() => navigate('/myPosts')}>My Posts</p>
                <p className='nav_side_pro_item' onClick={() => navigate('/myLearningPlan')}>My Learning Plan</p>
                <p className='nav_side_pro_item' onClick={() => navigate('/MylearningProgress')}>My learning Progress</p>
              </div>
            </div>
          )}
          <div className="nav-action" onClick={handleLogout}>
            <FaSignOutAlt className="action-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
