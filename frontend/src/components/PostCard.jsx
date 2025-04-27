import React from 'react';

const PostCard = ({ post, onClick }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card" onClick={onClick}> {/* On click trigger */}
                <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.description}</p>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
