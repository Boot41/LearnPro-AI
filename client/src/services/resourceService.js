import { sample_data } from '../../sample_data';

/**
 * Get resources for a specific learning path
 * @param {string} pathId - The ID of the learning path
 * @returns {Promise} Promise resolving to an array of resources
 */
export const getResourcesByPathId = (pathId) => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      const product = sample_data.find(p => p.product_id === pathId);
      
      if (!product) {
        reject(new Error(`Learning path with ID ${pathId} not found`));
        return;
      }
      
      // Extract official documentation links from topics
      const resources = product.learning_path.topics
        .filter(topic => topic.official_docs)
        .map((topic, index) => ({
          id: `${pathId}_res_${index}`,
          title: `${topic.topic_name} Documentation`,
          url: topic.official_docs,
          topic: topic.topic_name
        }));
      
      resolve(resources);
    }, 300);
  });
};

/**
 * Get all resources across all learning paths
 * @returns {Promise} Promise resolving to an array of resources
 */
export const getAllResources = () => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const resources = [];
      
      sample_data.forEach(product => {
        product.learning_path.topics
          .filter(topic => topic.official_docs)
          .forEach((topic, index) => {
            resources.push({
              id: `${product.product_id}_res_${index}`,
              title: `${topic.topic_name} Documentation`,
              url: topic.official_docs,
              topic: topic.topic_name,
              project: product.name
            });
          });
      });
      
      resolve(resources);
    }, 300);
  });
};
