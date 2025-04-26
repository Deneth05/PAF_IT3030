import axios from 'axios';

const REST_API_BASE_URL_PROGRESS = "http://localhost:8081/api/progress";

// Create new learning progress
export const createLearningProgress = async (progressData) => {
    try {
        const response = await axios.post(REST_API_BASE_URL_PROGRESS, progressData);
        return response.data;
    } catch (error) {
        console.error('Error creating learning progress:', error);
        throw error;
    }
}

// Get learning progress by its ID
export const getProgressById = async (progressId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL_PROGRESS}/${progressId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching progress by ID:', error);
        throw error;
    }
}

// Get all learning progress entries for a user
export const getProgressByUserId = async (userId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL_PROGRESS}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user progress:', error);
        throw error;
    }
}

// Get all learning progress entries (admin)
export const getAllProgress = async () => {
    try {
        const response = await axios.get(REST_API_BASE_URL_PROGRESS);
        return response.data;
    } catch (error) {
        console.error('Error fetching all progress:', error);
        throw error;
    }
}

// Update an existing learning progress
export const updateLearningProgress = async (id, updatedData) => {
    try {
        const response = await axios.put(`${REST_API_BASE_URL_PROGRESS}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating learning progress:', error);
        throw error;
    }
}

// Delete a learning progress entry
export const deleteLearningProgress = async (id) => {
    try {
        await axios.delete(`${REST_API_BASE_URL_PROGRESS}/${id}`);
    } catch (error) {
        console.error('Error deleting learning progress:', error);
        throw error;
    }
}