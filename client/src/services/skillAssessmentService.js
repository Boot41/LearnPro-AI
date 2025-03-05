import { get } from './apiService';

/**
 * Get the skill assessment quiz for the currently logged in employee
 * @returns {Promise} Promise resolving to the quiz data
 */
export const getSkillAssessmentQuiz = async () => {
  try {
    const response = await get('/api/skill-assessment/quiz');
    return response;
  } catch (error) {
    console.error('Error fetching skill assessment quiz:', error);
    throw error;
  }
};
