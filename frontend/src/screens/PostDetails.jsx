import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../services/PostService';  // Import your getPost function
import { useComments } from '../context/CommentContext';

const PostDetails = () => {
    const { postId } = useParams();  // Get the postId from the URL
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const { getCommentsByPostId, addComment } = useComments();  // Use the Comments context

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the post details from the API on component mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await getPost(postId);  // Use the getPost function to fetch the post
                setPost(postData);  // Set the post data
                setLoading(false);
            } catch (error) {
                setError('Failed to load post');
                setLoading(false);
            }
        };

        fetchPost();  // Call the async function
    }, [postId]);

    // Get the comments specific to the current postId
    const comments = getCommentsByPostId(postId);

    // Handle new comment submission
    const handleAddComment = (event) => {
        event.preventDefault();
        if (newComment.trim()) {
            addComment(postId, { content: newComment });
            setNewComment('');
        }
    };

    // Loading and error states
    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <div className="container mt-4">
            {/* Displaying the Post Details */}
            {post && (
                <>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <p>{post.content}</p> {/* Assuming `content` is the full text of the post */}

                    <hr />
                    
                    {/* Displaying Comments */}
                    <h4>Comments</h4>
                    {comments.length > 0 ? (
                        <ul className="list-group">
                            {comments.map((comment, index) => (
                                <li key={index} className="list-group-item">
                                    {comment.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet.</p>
                    )}

                    {/* Comment Input Form */}
                    <form onSubmit={handleAddComment} className="mt-3">
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                rows="2"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Post Comment</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default PostDetails;
