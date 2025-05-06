import React, { useEffect, useState } from 'react';
import { FaPen, FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './LearningPlan.css';
import NavBar from '../../Components/NavBar/NavBar';

function MyLearningPlan() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const navigate = useNavigate();
    const userID = localStorage.getItem("userID");
    
    useEffect(() => {
        fetch('http://localhost:8080/learningPlan')
            .then((response) => response.json())
            .then((data) => {
                const userSpecificData = data.filter(progress => progress.postOwnerID === userID);
                setPosts(userSpecificData);
                setFilteredPosts(userSpecificData);
            })
            .catch((error) => console.error('Error fetching learning Post data:', error));
    }, [userID]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this learning Post?")) {
            fetch(`http://localhost:8080/learningPlan/${id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    const updatedData = filteredPosts.filter(progress => progress.id !== id);
                    setFilteredPosts(updatedData);
                    alert("Learning Post deleted successfully.");
                })
                .catch((error) => console.error('Error deleting learning Post:', error));
        }
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <NavBar />
            <div className="progress-container">
                <div className="progress-header">
                    <h1>My Learning Plan</h1>
                    <p></p>
                </div>
                <div className='create_btn' onClick={() => (window.location.href = '/addLeariningPlan')}>
                    <FaPen />
                </div>
                <div className="progress-grid">
                    {filteredPosts.length === 0 ? (
                        <div className="empty-state">
                            <p>No posts found. Please create a new post.</p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div className="progress-card" key={post.id}>
                                <div className="card-header">
                                    <div className="LPost-user-info">
                                        <div className="user-avatar">
                                            <FaUserCircle />
                                        </div>
                                        <div className="LPost-user-name">{post.postOwnerName}</div>
                                    </div>
                                    <div className="progress-date">{formatDate(post.createdAt)}</div>
                                </div>

                                <div className="card-body">
                                    <h3 className="progress-title">{post.title}</h3>
                                    <div className="LPost-content-section">
                                        <div className="LPost-content-flow">
                                            {/* Display Steps */}
                                            {post.steps && post.steps.length > 0 && (
                                                <div className="learning-plan-steps">
                                                    <h4>Learning Steps:</h4>
                                                    <ol>
                                                        {post.steps.map((step, index) => (
                                                            <li key={index}>
                                                                <strong>{step.heading || `Step ${index + 1}`}</strong>
                                                                {step.description && (
                                                                    <div className="step-description">
                                                                        <p>{step.description}</p>
                                                                    </div>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/updateLearnPlan/${post.id}`)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyLearningPlan;