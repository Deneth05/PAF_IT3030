// src/services/LearningPlanService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/learning-plans';

export const getAllPlans = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    throw error.response?.data?.message || error.message;
  }
};

export const getPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching learning plan with id ${id}:`, error);
    throw error.response?.data?.message || error.message;
  }
};

export const createPlan = async (planData) => {
  try {
    const response = await axios.post(API_BASE_URL, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating learning plan:', error);
    throw error.response?.data?.message || error.message;
  }
};

export const updatePlan = async (id, planData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating learning plan with id ${id}:`, error);
    throw error.response?.data?.message || error.message;
  }
};

export const deletePlan = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting learning plan with id ${id}:`, error);
    throw error.response?.data?.message || error.message;
  }
};