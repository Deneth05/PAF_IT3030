import React, { useState } from 'react';
import './Home.css';

const Home = () => {
    const [localPosts, setLocalPosts] = useState([
        {
            id: 1,
            title: "Watercolor Painting Techniques",
            content: "Sharing some of my favorite watercolor techniques I've learned over the years.",
            images: [
                "https://images.unsplash.com/photo-1579965342575-16428a7c8881",
                "https://images.unsplash.com/photo-1531219572328-a0171d44432a",
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
            ],
            likes: 2,
            comments: [
                { id: 1, author: "ArtLover", text: "These techniques are amazing! Thanks for sharing." },
                { id: 2, author: "DIYExpert", text: "Can't wait to try these out this weekend!" }
            ],
            author: "ArtEnthusiast",
            showComments: false,
            newComment: ""
        },
        {
            id: 2,
            title: "Woodworking Basics",
            content: "My journey into woodworking - here are some of my first projects!",
            images: [
                "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb",
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f"
            ],
            likes: 4,
            comments: [
                { id: 1, author: "DIYExpert", text: "Great projects for beginners!" },
                { id: 2, author: "WoodWorker", text: "What type of wood did you use for the first project?" }
            ],
            author: "CraftyCreator",
            showComments: false,
            newComment: ""
        },
        {
            id: 3,
            title: "Coding a React App",
            content: "Walkthrough of how I built this SkillShare app with React.",
            images: [
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee"
            ],
            likes: 1,
            comments: [
                { id: 1, author: "DIYExpert", text: "This is so helpful for my learning journey!" }
            ],
            author: "CodeMaster",
            showComments: false,
            newComment: ""
        }
    ]);

    const toggleComments = (postId) => {
        setLocalPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId 
                    ? { ...post, showComments: !post.showComments } 
                    : post
            )
        );
    };

    const handleCommentChange = (postId, value) => {
        setLocalPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId 
                    ? { ...post, newComment: value } 
                    : post
            )
        );
    };

    const addComment = (postId) => {
        setLocalPosts(prevPosts => 
            prevPosts.map(post => {
                if (post.id === postId && post.newComment.trim()) {
                    const newCommentObj = {
                        id: Date.now(),
                        author: "CurrentUser",
                        text: post.newComment
                    };
                    return {
                        ...post,
                        comments: [...post.comments, newCommentObj],
                        newComment: ""
                    };
                }
                return post;
            })
        );
    };

    return (
        <div className="social-feed">
            <header className="app-header">
                <h1>SkillShare</h1>
                <div className="header-actions">
                    <button className="create-post-button">+ Create Post</button>
                </div>
            </header>
            
            <main className="posts-grid">
                {localPosts.length > 0 ? (
                    localPosts.map((post) => (
                        <article key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="user-info">
                                    <div className="avatar">{post.author.charAt(0)}</div>
                                    <span className="username">{post.author}</span>
                                </div>
                                <button className="more-options">⋯</button>
                            </div>
                            
                            {post.images && post.images.length > 0 && (
                                <div className={`post-images image-count-${post.images.length}`}>
                                    {post.images.map((image, index) => (
                                        <div key={index} className="image-container">
                                            <img 
                                                src={image} 
                                                alt={`Post ${post.id} image ${index + 1}`}
                                                className="post-image"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="post-content">
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                            </div>
                            
                            <div className="post-actions">
                                <button className="action-button">
                                    <span role="img" aria-label="Like">👍</span> Like
                                </button>
                                <button 
                                    className="action-button" 
                                    onClick={() => toggleComments(post.id)}
                                >
                                    <span role="img" aria-label="Comment">💬</span> Comment
                                </button>
                                <button className="action-button">
                                    <span role="img" aria-label="Share">↗️</span> Share
                                </button>
                            </div>
                            
                            <div className="post-stats">
                                <span>{post.likes} likes</span>
                                <span>{post.comments.length} comments</span>
                            </div>

                            {post.showComments && (
                                <div className="comments-section">
                                    <div className="comments-list">
                                        {post.comments.map(comment => (
                                            <div key={comment.id} className="comment">
                                                <div className="comment-author">{comment.author}</div>
                                                <div className="comment-text">{comment.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-comment">
                                        <input
                                            type="text"
                                            value={post.newComment}
                                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            placeholder="Add a comment..."
                                            className="comment-input"
                                        />
                                        <button 
                                            onClick={() => addComment(post.id)}
                                            className="comment-submit"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            )}
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