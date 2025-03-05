import { sample_data } from '../../sample_data';
import { get, post } from './apiService';

// Helper function to transform the sample data into the required format for components
let baseURL = import.meta.env.VITE_BASE_URL;

const transformLearningPathData = (data) => {
  const learningPaths = [];
  
  data.forEach(product => {
    const topics = product.learning_path.topics.map((topic, index) => {
      // Determine status based on assessment
      let status = 'not-started';
      let progress = 0;
      
      if (topic.assessment && topic.assessment.status) {
        if (topic.assessment.status === 'completed') {
          status = 'completed';
          progress = 100;
        } else if (topic.assessment.status === 'in-progress') {
          status = 'in-progress';
          progress = Math.floor(Math.random() * 80) + 20; // Random progress between 20-99%
        }
      }
      
      return {
        id: `${product.product_id}_topic_${index}`,
        name: topic.topic_name,
        progress: progress,
        status: status,
        estimatedHours: topic.estimated_hours || 0,
        official_docs: topic.official_docs || null
      };
    });
    
    // Calculate overall progress
    const completedTopics = topics.filter(t => t.status === 'completed').length;
    const inProgressTopics = topics.filter(t => t.status === 'in-progress').length;
    const totalTopics = topics.length;
    const overallProgress = Math.floor(
      ((completedTopics * 100) + (inProgressTopics * topics.filter(t => t.status === 'in-progress').reduce((acc, curr) => acc + curr.progress, 0) / inProgressTopics)) / totalTopics
    ) || 0;
    
    learningPaths.push({
      projectId: product.product_id,
      project: product.name,
      progress: overallProgress,
      nextAssessment: new Date(Date.now() + 86400000 * (2 + Math.floor(Math.random() * 5))), // 2-7 days from now
      topics: topics,
      calendarLocked: product.calendar_locked || false
    });
  });
  
  return learningPaths;
};

/**
 * Get all learning paths for the current user
 * @returns {Promise} Promise resolving to an array of learning paths
 */
export const getAllLearningPaths = () => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const learningPaths = transformLearningPathData(sample_data);
      resolve(learningPaths);
    }, 300);
  });
};

/**
 * Get a specific learning path by ID
 * @param {string} pathId - The ID of the learning path to retrieve
 * @returns {Promise} Promise resolving to a learning path object
 */
export const getLearningPathById = (pathId) => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      const learningPaths = transformLearningPathData(sample_data);
      const learningPath = learningPaths.find(path => path.projectId === pathId);
      
      if (learningPath) {
        resolve(learningPath);
      } else {
        reject(new Error(`Learning path with ID ${pathId} not found`));
      }
    }, 300);
  });
};

/**
 * Get the current active learning path for the user
 * @returns {Promise} Promise resolving to the active learning path object
 */
export const getActiveLearningPath = () => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const learningPaths = transformLearningPathData(sample_data);
      // For mock data, just return the first path
      resolve(learningPaths[0]);
    }, 300);
  });
};

/**
 * Update the progress of a topic within a learning path
 * @param {string} pathId - The ID of the learning path
 * @param {string} topicId - The ID of the topic to update
 * @param {number} progress - The new progress percentage
 * @param {string} status - The new status (not-started, in-progress, completed)
 * @returns {Promise} Promise resolving to the updated learning path
 */
export const updateTopicProgress = (pathId, topicId, progress, status) => {
  return new Promise((resolve) => {
    // In a real implementation, this would make an API call to update the backend
    // For now, we just simulate a successful update
    setTimeout(() => {
      // We would typically return the updated learning path from the server
      getLearningPathById(pathId).then(learningPath => {
        const updatedPath = { ...learningPath };
        const topicIndex = updatedPath.topics.findIndex(topic => topic.id === topicId);
        
        if (topicIndex !== -1) {
          updatedPath.topics[topicIndex] = {
            ...updatedPath.topics[topicIndex],
            progress: progress,
            status: status
          };
        }
        
        resolve(updatedPath);
      });
    }, 300);
  });
};

/**
 * Get the learning path for a specific user from the server API
 * @param {string} userId - The ID of the user
 * @returns {Promise} Promise resolving to the user's learning path or an error
 */
export const getUserLearningPath = async (userId) => {
  try {
    // Make a real API call to the server endpoint
    const response = await get(`/users/${userId}/learning_path/`);
    return response;
  } catch (error) {
    console.error('Error fetching user learning path:', error);
    throw error;
  }
};

/**
 * Get learning path for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise} Promise resolving to the learning path data
 */
export const getUserLearningPaths = async (userId) => {
  try {
    const response = await get(`/api/learning_paths/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }
};

/**
 * Create a new learning path
 * @param {Object} learningPathData - Learning path data
 * @returns {Promise} Promise resolving to the created learning path
 */
export const createLearningPath = async (learningPathData) => {
  try {
    const response = await post('/api/learning_paths', learningPathData);
    return response;
  } catch (error) {
    console.error('Error creating learning path:', error);
    throw error;
  }
};
