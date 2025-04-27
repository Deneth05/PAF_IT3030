import axios from 'axios';
import CommentCreationForm from '../components/Comments/CommentForm';

const REST_API_BASE_URL_COMMENT = "http://localhost:8081/api/comments";

// Create a new comment
export const createComment = async (commentData) => {
    try {
        const response = await axios.post(REST_API_BASE_URL_COMMENT, commentData);
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}

// Fetch all comments
export const listComments = async () => {
    try {
        const response = await axios.get(REST_API_BASE_URL_COMMENT);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

// Get a single comment by ID
export const getComment = async (commentId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL_COMMENT}/${commentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching comment with ID ${commentId}:`, error);
        throw error;
    }
}

// Get comments for a specific post
export const getCommentsByPostId = async (postId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL_COMMENT}/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        throw error;
    }
}

// Update a comment
export const updateComment = async (commentId, commentData) => {
    try {
        const response = await axios.put(`${REST_API_BASE_URL_COMMENT}/${commentId}`, commentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating comment with ID ${commentId}:`, error);
        throw error;
    }
}

// Delete a comment
export const deleteComment = async (commentId) => {
    try {
        await axios.delete(`${REST_API_BASE_URL_COMMENT}/${commentId}`);
    } catch (error) {
        console.error(`Error deleting comment with ID ${commentId}:`, error);
        throw error;
    }
}