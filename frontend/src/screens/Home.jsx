import React, { useEffect, useState } from 'react';
import { listPosts } from '../services/PostService';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';  

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  

    useEffect(() => {
        listPosts()
            .then(response => {
                setPosts(response); 
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts');
                setLoading(false);
            });
    }, []);

    
    const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`);  
    };

    
    const handleCreatePostClick = () => {
        navigate('/create-post');  
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">All Posts</h2>

            
            <div className="text-center mb-4">
                <button onClick={handleCreatePostClick} className="btn btn-primary">
                    Create New Post
                </button>
            </div>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            <div className="row">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onClick={() => handlePostClick(post.id)}  
                        />
                    ))
                ) : (
                    !loading && <p className="text-center">No posts found</p>
                )}
            </div>
        </div>
    );
};

export default Home;
