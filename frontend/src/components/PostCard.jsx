import React from 'react';

const PostCard = ({ post, onClick }) => {
    return (
        <div className="col-md-4 mb-4">
<<<<<<< HEAD
<<<<<<< HEAD
            <div className="card h-100" onClick={onClick} style={{ cursor: 'pointer' }}>
=======
            <div className="card" onClick={onClick}> {/* On click trigger */}
>>>>>>> Feature/SkillPost
=======
            <div className="card" onClick={onClick}> {/* On click trigger */}
>>>>>>> feature/Comments
                <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.description}</p>
                </div>
<<<<<<< HEAD
<<<<<<< HEAD
                <div className="card-footer bg-transparent">
                    <small className="text-muted">Posted on {post.date || 'unknown date'}</small>
                </div>
=======
>>>>>>> Feature/SkillPost
=======
>>>>>>> feature/Comments
            </div>
        </div>
    );
};

<<<<<<< HEAD
<<<<<<< HEAD
const PostsGridView = ({ posts, onPostClick }) => {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Recent Posts</h2>
            <div className="row">
                {posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onClick={() => onPostClick(post)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostsGridView;
=======
export default PostCard;
>>>>>>> Feature/SkillPost
=======
export default PostCard;
>>>>>>> feature/Comments
