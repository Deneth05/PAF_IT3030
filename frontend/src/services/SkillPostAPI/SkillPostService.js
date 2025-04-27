import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/skills';

const SkillPostService = {
  // Create a new skill post
  createPost: async (postData) => {
    try {
      const response = await axios.post(API_BASE_URL, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Get all skill posts
  getAllPosts: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a single post by ID
  getPostById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw error;
    }
  },

  // Update an existing post
  updatePost: async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      throw error;
    }
  }
};

export default SkillPostService;