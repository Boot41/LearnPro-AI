import { createContext, useContext, useState } from 'react';
import { getMyLearningPath } from '../services/learningPathService';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skillAssessment, setSkillAssessment] = useState(null);
  const fetchLearningPath = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyLearningPath();
      setLearningPath(data);
      setSkillAssessment(null); // Clear any existing skill assessment
    } catch (err) {
      console.log(err.message)
      throw err
    }
  };

  const clearLearningPath = () => {
    setLearningPath(null);
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
        clearLearningPath,
        setSkillAssessment
      }}
    >
      {children}
    </LearningPathContext.Provider>
  );
};
