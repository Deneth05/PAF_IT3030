import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css'; // We'll create this CSS file

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/posts');
                setPosts(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading skill posts...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>Error loading posts: {error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
                Try Again
            </button>
        </div>
    );

    return (
        <div className="social-feed">
            <header className="app-header">
                <h1>SkillShare</h1>
                <div className="header-actions">
                    <button className="create-post-button">+ Create Post</button>
                </div>
            </header>
            
            <main className="posts-grid">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <article key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="user-info">
                                    <div className="avatar"></div>
                                    <span className="username">Skill User</span>
                                </div>
                                <button className="more-options">⋯</button>
                            </div>
                            
                            <div className="post-content">
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                            </div>
                            
                            <div className="post-actions">
                                <button className="action-button">
                                    <span role="img" aria-label="Like">👍</span> Like
                                </button>
                                <button className="action-button">
                                    <span role="img" aria-label="Comment">💬</span> Comment
                                </button>
                                <button className="action-button">
                                    <span role="img" aria-label="Share">↗️</span> Share
                                </button>
                            </div>
                            
                            <div className="post-stats">
                                <span>42 likes</span>
                                <span>8 comments</span>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h2>No posts yet</h2>
                        <p>Be the first to share your skills!</p>
                        <button className="create-post-button">Create Post</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;