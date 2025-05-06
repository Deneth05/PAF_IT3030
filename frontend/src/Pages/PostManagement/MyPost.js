import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaEdit, FaTrash, FaPen } from "react-icons/fa";
import NavBar from '../../Components/NavBar/NavBar';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function MyPost() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [postOwners, setPostOwners] = useState({});
    const navigate = useNavigate();
    const loggedInUserID = localStorage.getItem('userID');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/posts');
                const allPosts = response.data;

                // Filter posts by logged-in user ID
                const userPosts = allPosts.filter(post => post.userID === loggedInUserID);

                setPosts(userPosts);
                setFilteredPosts(userPosts);

                const userIDs = [...new Set(userPosts.map((post) => post.userID))];
                const ownerPromises = userIDs.map((userID) =>
                    axios.get(`http://localhost:8080/user/${userID}`)
                        .then((res) => ({
                            userID,
                            fullName: res.data.fullname,
                        }))
                        .catch((error) => {
                            console.error(`Error fetching user details for userID ${userID}:`, error);
                            return { userID, fullName: 'Anonymous' };
                        })
                );
                const owners = await Promise.all(ownerPromises);
                const ownerMap = owners.reduce((acc, owner) => {
                    acc[owner.userID] = owner.fullName;
                    return acc;
                }, {});
                console.log('Post Owners Map:', ownerMap);
                setPostOwners(ownerMap);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [loggedInUserID]);



    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/posts/${postId}`);
            alert('Post deleted successfully!');
            setPosts(posts.filter((post) => post.id !== postId));
            setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post.');
        }
    };

    const handleUpdate = (postId) => {
        navigate(`/updatePost/${postId}`);
    };

    return (
        <div>
            <div>
                <NavBar />
                <div className='create_btn' onClick={() => (window.location.href = '/addNewPost')}>
                    <FaPen className='create_btn_icon' />
                </div>
                <div className='posts-container'>
                    <div className='continSection'>
                        <div className='post_card_continer'>
                            {filteredPosts.length === 0 ? (
                                <div className="no-posts">
                                    <h3>No posts found</h3>
                                    <p>Be the first to share something amazing!</p>
                                </div>
                            ) : (
                                filteredPosts.map((post) => (
                                    <div key={post.id} className='post-card'>
                                        <div className="post-header">
                                            <div className="user-info">
                                                <div className="avatar">
                                                    <FaUserCircle className="user-icon" />
                                                </div>
                                                <span className="username">{postOwners[post.userID] || 'Anonymous'}</span>

                                            </div>
                                        </div>
                                        <div className='dix_con'>
                                            <div className="post-title-container">
                                                <h3 className="post-title">{post.title}</h3>
                                            </div>
                                            <div className="post-description">
                                                <p style={{ whiteSpace: "pre-line" }}>{post.description}</p>
                                            </div>
                                        </div>
                                        <div className="media-gallery">
                                            {post.media.slice(0, 4).map((mediaUrl, index) => (
                                                <div
                                                    key={index}
                                                    className={`media-item ${post.media.length > 4 && index === 3 ? 'has-overlay' : ''}`}

                                                >
                                                    {mediaUrl.endsWith('.mp4') ? (
                                                        <video controls>
                                                            <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        <img src={`http://localhost:8080${mediaUrl}`} alt="Post Media" />
                                                    )}
                                                    {post.media.length > 4 && index === 3 && (
                                                        <div className="overlay">+{post.media.length - 4}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>


                                        <div className="card-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => navigate(`/updatePost/${post.id}`)}
                                            >
                                                <FaEdit /> 
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <FaTrash /> 
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default MyPost
