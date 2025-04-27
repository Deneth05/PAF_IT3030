import axios from 'axios';

const REST_API_BASE_URL_POST = "http://localhost:8080/api/posts";

// Fetch all posts
export const listPosts = async () => {
    try {
        const response = await axios.get(REST_API_BASE_URL_POST);
        return response.data; // Extract and return data
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; // Rethrow or handle error
    }
}

// Create a new post
export const createPost = async (post) => {
    try {
        const response = await axios.post(REST_API_BASE_URL_POST, post);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error creating post:', error);
        throw error; // Rethrow or handle error
    }
}

// Get a single post by ID
export const getPost = async (postId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL_POST}/${postId}`);
        return response.data; // Return the response data
    } catch (error) {
        console.error(`Error fetching post with ID ${postId}:`, error);
        throw error; // Rethrow or handle error
    }
}


