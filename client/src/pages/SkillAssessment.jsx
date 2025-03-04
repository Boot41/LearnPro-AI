import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Quiz from './Quiz';
import { getSkillAssessmentQuiz, submitSkillAssessment } from '../services';

const SkillAssessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState(null);

  // Get the project ID from the location state if not in URL params
  const project = projectId || (location.state?.projectId);
  
  useEffect(() => {
    if (!project) {
      setError('Project ID is missing. Cannot load skill assessment.');
      setLoading(false);
      return;
    }
    
    const loadSkillAssessment = async () => {
      try {
        const quizData = await getSkillAssessmentQuiz(project);
        setQuizData(quizData);
      } catch (err) {
        console.error('Failed to load skill assessment:', err);
        setError('Failed to load skill assessment questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSkillAssessment();
  }, [project]);
  
  const handleQuizCompletion = async (results) => {
    try {
      await submitSkillAssessment(project, user.id, results);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit skill assessment:', err);
      setError('Failed to submit your answers. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
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
          This assessment will help customize your learning path for {quizData.projectName}
        </p>
      </div>
      
      <Quiz 
        quizData={quizData} 
        onComplete={handleQuizCompletion}
        isSkillAssessment={true}
      />
    </div>
  );
};

export default SkillAssessment;
