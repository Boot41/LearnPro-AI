import { sample_data } from '../../sample_data';
import { get } from './apiService';

/**
 * Get quiz data for a specific topic
 * @param {string} topicId - The ID of the topic
 * @returns {Promise} Promise resolving to quiz data for the topic
 */

let baseURL = import.meta.env.VITE_BASE_URL;

export const getQuizByTopicId = (topicId) => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // Parse topicId to extract product and topic indices
      const parts = topicId.split('_');
      if (parts.length !== 3) {
        reject(new Error('Invalid topic ID format'));
        return;
      }
      
      const productId = parts[0];
      const topicIndex = parseInt(parts[2], 10);
      
      // Find the product
      const product = sample_data.find(p => p.product_id === productId);
      if (!product) {
        reject(new Error(`Product with ID ${productId} not found`));
        return;
      }
      
      // Find the topic
      const topic = product.learning_path.topics[topicIndex];
      if (!topic) {
        reject(new Error(`Topic with index ${topicIndex} not found in product ${productId}`));
        return;
      }
      
      // Extract quiz data
      if (!topic.quiz) {
        reject(new Error(`No quiz found for topic ${topicId}`));
        return;
      }
      
      // Format quiz data for the component
      const quizData = {
        topicName: topic.topic_name,
        timeLimit: 10, // Default time limit in minutes
        questions: topic.quiz.questions.map((q, index) => ({
          id: `${topicId}_q_${index}`,
          question: q.question,
          options: q.options.map((opt, optIndex) => ({
            id: String.fromCharCode(97 + optIndex), // a, b, c, d
            text: opt
          })),
          correctAnswer: String.fromCharCode(97 + q.options.indexOf(q.correct_answer)) // Find index of correct answer
        })),
        passingScore: topic.quiz.passing_score || 70
      };
      
      resolve(quizData);
    }, 300);
  });
};

/**
 * Get MCQ quiz data for a specific topic
 * @param {string} topicId - The ID of the topic
 * @returns {Promise} Promise resolving to MCQ quiz data for the topic
 */
export const getMCQQuizByTopicId = (topicId) => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // For simplicity, we'll use the same data structure as regular quizzes
      // In a real application, this might have a different structure or additional fields
      getQuizByTopicId(topicId)
        .then(quizData => resolve(quizData))
        .catch(error => reject(error));
    }, 300);
  });
};

/**
 * Submit quiz answers and get results
 * @param {string} topicId - The ID of the topic
 * @param {Object} userAnswers - Object mapping question IDs to selected option IDs
 * @returns {Promise} Promise resolving to quiz results
 */
export const submitQuizAnswers = (topicId, userAnswers) => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Get the quiz data to check answers
      getQuizByTopicId(topicId).then(quizData => {
        let correctCount = 0;
        const totalQuestions = quizData.questions.length;
        
        // Check each answer
        quizData.questions.forEach(question => {
          if (userAnswers[question.id] === question.correctAnswer) {
            correctCount++;
          }
        });
        
        // Calculate score
        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= quizData.passingScore;
        
        // Prepare detailed results with correct/incorrect for each question
        const detailedResults = quizData.questions.map(question => ({
          questionId: question.id,
          question: question.question,
          userAnswer: userAnswers[question.id] || null,
          correctAnswer: question.correctAnswer,
          isCorrect: userAnswers[question.id] === question.correctAnswer
        }));
        
        resolve({
          topicId,
          topicName: quizData.topicName,
          score,
          correctCount,
          totalQuestions,
          passingScore: quizData.passingScore,
          passed,
          detailedResults
        });
      });
    }, 500);
  });
};

/**
 * Get skill assessment quiz for a specific project
 * @param {string} projectId - The ID of the project
 * @returns {Promise} Promise resolving to skill assessment quiz data
 */
export const getSkillAssessmentQuiz = async (projectId) => {
  try {
    // Make a real API call to the server endpoint
    const response = await get(`${baseURL}/projects/${projectId}/skill-assessment/`);
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
