import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import Quiz from './Quiz';

const QuizWrapper = () => {
  const { quizData, topicId } = useQuiz();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we have state from navigation, use it to set quiz data
    if (location.state?.quizData) {
      // No need to set in context as it's already passed directly to Quiz
    } else if (!quizData) {
      // If no quiz data in context or location state, redirect to learning path
      navigate('/learning-path');
    }
  }, [quizData, navigate, location.state]);

  // If we have location state, use that directly
  if (location.state?.quizData) {
    return <Quiz quizData={location.state.quizData} topicId={location.state.topicId} />;
  }

  // Otherwise use data from context
  if (quizData) {
    return <Quiz quizData={quizData} topicId={topicId} />;
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading quiz...</h2>
      </div>
    </div>
  );
};

export default QuizWrapper;
