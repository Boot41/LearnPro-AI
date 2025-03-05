import React, { createContext, useContext, useState } from 'react';
import { getMyLearningPath } from '../services/learningPathService';
import { getSkillAssessmentQuiz } from '../services/skillAssessmentService';

const LearningPathContext = createContext();

export const useLearningPath = () => {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error('useLearningPath must be used within a LearningPathProvider');
  }
  return context;
};

export const LearningPathProvider = ({ children }) => {
  const [learningPath, setLearningPath] = useState(null);
  const [skillAssessment, setSkillAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLearningPath = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyLearningPath();
      setLearningPath(data);
      setSkillAssessment(null); // Clear any existing skill assessment
    } catch (err) {
      console.log(err.message)
      // If no learning path found, try to get skill assessment
      if (err.message?.includes('API request failed with status 404')) {
        try {
          const quizData = await getSkillAssessmentQuiz();
          setSkillAssessment(quizData);
          setLearningPath(null);
        } catch (quizError) {
          console.error('Error fetching skill assessment:', quizError);
          setError('Failed to fetch both learning path and skill assessment');
        }
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearLearningPath = () => {
    setLearningPath(null);
    setSkillAssessment(null);
    setError(null);
  };

  return (
    <LearningPathContext.Provider 
      value={{ 
        learningPath, 
        skillAssessment,
        isLoading, 
        error, 
        fetchLearningPath,
        clearLearningPath
      }}
    >
      {children}
    </LearningPathContext.Provider>
  );
};
