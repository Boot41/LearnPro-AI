import { sample_data } from '../../sample_data';

/**
 * Generate mock upcoming sessions based on the learning paths
 * @returns {Array} Array of upcoming session objects
 */
const generateMockSessions = () => {
  const sessions = [];
  const now = new Date();
  
  sample_data.forEach(product => {
    // Only generate sessions for topics that aren't completed
    product.learning_path.topics.forEach((topic, index) => {
      if (!topic.assessment || topic.assessment.status !== 'completed') {
        // Generate 1-2 sessions per topic
        const sessionCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < sessionCount; i++) {
          // Generate a date 1-14 days in the future
          const daysToAdd = Math.floor(Math.random() * 14) + 1;
          const sessionDate = new Date(now.getTime() + (86400000 * daysToAdd));
          
          sessions.push({
            id: `${product.product_id}_session_${index}_${i}`,
            topic: topic.topic_name,
            date: sessionDate,
            duration: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
            project: product.name
          });
        }
      }
    });
  });
  
  // Sort by date
  sessions.sort((a, b) => a.date - b.date);
  
  return sessions;
};

/**
 * Get upcoming learning sessions for the user
 * @returns {Promise} Promise resolving to an array of upcoming sessions
 */
export const getUpcomingSessions = () => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const sessions = generateMockSessions();
      resolve(sessions);
    }, 300);
  });
};

/**
 * Get upcoming learning sessions for a specific learning path
 * @param {string} pathId - The ID of the learning path
 * @returns {Promise} Promise resolving to an array of upcoming sessions for the path
 */
export const getSessionsByPathId = (pathId) => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const allSessions = generateMockSessions();
      const filteredSessions = allSessions.filter(session => session.id.startsWith(pathId));
      resolve(filteredSessions);
    }, 300);
  });
};
