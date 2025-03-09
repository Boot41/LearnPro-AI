import { get } from './apiService';

let baseURL = import.meta.env.VITE_BASE_URL;
/**
 * Get skill assessment quiz for a specific project
 * @param {string} projectId - The ID of the project
 * @returns {Promise} Promise resolving to skill assessment quiz data
 */

export const getSkillAssessmentQuiz = async (projectId) => {
  try {
    // Make a real API call to the server endpoint
    const response = await get(`${baseURL}/projects/${projectId}/skill-assessment`);
    return response;
  } catch (error) {
    console.error('Error fetching skill assessment quiz:', error);
    throw error;
  }
};

/**
 * Submit skill assessment answers
 * @param {string} projectId - The ID of the project
 * @param {string} userId - The ID of the user
 * @param {Object} answers - User's answers to the skill assessment questions
 * @returns {Promise} Promise resolving to the assessment results
 */
export const submitSkillAssessment = async (projectId, userId, answers) => {
  try {
    // Get the auth token from localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Make a real API call to the server endpoint
    const response = await fetch(`${baseURL}/api/learning_paths/from_assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        answers: answers.answers,
        topicScores: answers.topicScores
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit skill assessment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting skill assessment:', error);
    throw error;
  }
};

/**
 * Get quiz for a specific topic name
 * @param {string} topicName - The name of the topic
 * @returns {Promise} Promise resolving to quiz data for the topic
 */
export const getQuizByTopicName = async (topicName) => {
  try {
    const url = encodeURI(`${baseURL}/api/skill-assessment/topic-quiz/${topicName}`)
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Make a real API call to the server endpoint
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching topic quiz:', error);
    throw error;
  }
};
