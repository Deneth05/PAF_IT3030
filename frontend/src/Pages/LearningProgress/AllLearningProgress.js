import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaPen } from "react-icons/fa";
import './LearningPro.css';
import NavBar from '../../Components/NavBar/NavBar'
function AllLearningProgress() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userType = localStorage.getItem('userType');
  useEffect(() => {
    fetch('http://localhost:8080/learningProgress')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error('Error fetching learning progress data:', error));
  }, []);

  return (
    <div>
      <NavBar />
      <div className="progress-container">
        <div className="progress-header">
          <h1>Learning Progress</h1>
        </div>

        <div className='create_btn' onClick={() => (window.location.href = '/addLearningProgress')}>
          <FaPen className='create_btn_icon' />
        </div>
        <div className="progress-grid">
          {filteredData.length === 0 ? (
            <div className="empty-state">
              <p>No learning progress found. Start by creating your first progress entry.</p>
            </div>
          ) : (
            filteredData.map((progress) => (
              <div className="progress-card" key={progress.id}>
                <div className="card-header">
                  <div className="user-avatar">
                    <FaUserCircle />
                  </div>
                  <div className="user-name">
                    {progress.postOwnerName}
                    <p className="progress-date">{progress.date}</p>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="progress-title">{progress.title}</h3>
                  <p className='progress-templt'>{progress.template}</p>
                  <p className="progress-description">{progress.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AllLearningProgress;