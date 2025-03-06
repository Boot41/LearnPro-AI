import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearningPath } from '../contexts/LearningPathContext';
import Quiz from './Quiz';
import { submitSkillAssessment } from '../services';

const SkillAssessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { skillAssessment, error: contextError } = useLearningPath();
  const [error, setError] = useState('');
  const {fetchLearningPath}  = useLearningPath()
  if (!skillAssessment && !contextError) {
    navigate('/dashboard');
    return null;
  }

  const handleQuizCompletion = async (results) => {
    try {
      console.log(results)
      await submitSkillAssessment(skillAssessment.project_id, user.id, results);
      await fetchLearningPath();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit skill assessment:', err);
      setError('Failed to submit your answers. Please try again.');
    }
  };
  
  if (contextError || error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{contextError || error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Skill Assessment</h1>
        <p className="text-gray-600">
          This assessment will help customize your learning path for {skillAssessment.project_name}
        </p>
      </div>
      
      <Quiz 
        quizData={skillAssessment.quiz} 
        onComplete={handleQuizCompletion}
        isSkillAssessment={true}
      />
    </div>
  );
};

export default SkillAssessment;
