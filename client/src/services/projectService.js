import { post, get } from './apiService';

/**
 * Create a new project
 * @param {Object} projectData - Project data including name, description, and subjects
 * @param {Boolean} isFileUpload - Whether the project is being created via file upload
 * @returns {Promise} Promise resolving to the created project
 */
export const createProject = async (projectData, isFileUpload = false) => {
  try {
    if (isFileUpload) {
      // For file upload method, send FormData directly to the file upload endpoint
      const response = await post('/api/projects/', projectData, true);
      return response;
    } else {
      // For manual method, transform data and send to the old endpoint
      const transformedData = {
        name: projectData.project_name,
        description: projectData.project_description,
        subjects: projectData.subjects.map(subject => ({
          name: subject.subject_name,
          topics: subject.topics.filter(topic => topic.trim() !== '')
        }))
      };

      const response = await post('/api/projects/old', transformedData);
      return response;
    }
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Get all projects
 * @returns {Promise} Promise resolving to the list of projects
 */
export const getProjects = async () => {
  try {
    const response = await get('/api/projects/');
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Get a specific project by ID
 * @param {number} projectId - The ID of the project to fetch
 * @returns {Promise} Promise resolving to the project data
 */
export const getProject = async (projectId) => {
  try {
    const response = await get(`/api/projects/${projectId}`);
    return response;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

/**
 * Get project completion statistics
 * @returns {Promise} Promise resolving to project completion statistics
 */
export const getProjectCompletionStats = async () => {
  try {
    const response = await get('/api/projects/completion/stats');
    return response;
  } catch (error) {
    console.error('Error fetching project completion stats:', error);
    throw error;
  }
};
