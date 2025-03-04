import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import smaller components
import QuizTimer from '../components/quiz/QuizTimer';
import QuizProgressBar from '../components/quiz/QuizProgressBar';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizActions from '../components/quiz/QuizActions';
import QuizResult from '../components/quiz/QuizResult';
import QuizNotFound from '../components/quiz/QuizNotFound';

// Import quiz service
import { getMCQQuizByTopicId, submitQuizAnswers } from '../services';

const QuizMCQ = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [currentQuizData, setCurrentQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const quizData = await getMCQQuizByTopicId(topicId);
        setCurrentQuizData(quizData);
        setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
        setError(null);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError("Failed to load quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (topicId) {
      fetchQuizData();
    } else {
      // Handle invalid topic ID
      setError("Invalid topic ID");
      setLoading(false);
    }
  }, [topicId]);
  
  // Timer effect
  useEffect(() => {
    if (!currentQuizData || quizCompleted || loading) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuizData, quizCompleted, loading]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error || !currentQuizData) {
    return <QuizNotFound message={error || "Quiz not found"} />;
  }
  
  const currentQuestion = currentQuizData.questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionId) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionId);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption) {
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      
      // Update user answers
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.id]: selectedOption
      });
      
      setIsAnswerSubmitted(true);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuizData.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      handleFinishQuiz();
    }
  };
  
  const handleFinishQuiz = async () => {
    setQuizCompleted(true);
    
    try {
      // Submit answers to get results
      const results = await submitQuizAnswers(topicId, userAnswers);
      setQuizResults(results);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Create basic results even if submission fails
      const correctCount = currentQuizData.questions.filter(
        q => userAnswers[q.id] === q.correctAnswer
      ).length;
      
      setQuizResults({
        topicId,
        topicName: currentQuizData.topicName,
        score: Math.round((correctCount / currentQuizData.questions.length) * 100),
        correctCount,
        totalQuestions: currentQuizData.questions.length,
        passingScore: currentQuizData.passingScore,
        passed: (correctCount / currentQuizData.questions.length) * 100 >= currentQuizData.passingScore
      });
    }
  };
  
  const handleRetry = () => {
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizCompleted(false);
    setQuizResults(null);
    setTimeRemaining(currentQuizData.timeLimit * 60);
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  // Show results if quiz is completed
  if (quizCompleted && quizResults) {
    return (
      <QuizResult
        results={quizResults}
        onRetry={handleRetry}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentQuizData.topicName}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-500 mb-2 sm:mb-0">
            Question {currentQuestionIndex + 1} of {currentQuizData.questions.length}
          </p>
          <QuizTimer timeRemaining={timeRemaining} />
        </div>
        <QuizProgressBar 
          current={currentQuestionIndex + 1} 
          total={currentQuizData.questions.length} 
        />
      </div>
      
      <QuizQuestion
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedOption={selectedOption}
        isAnswerSubmitted={isAnswerSubmitted}
        correctAnswer={currentQuestion.correctAnswer}
        onSelectOption={handleOptionSelect}
      />
      
      <QuizActions
        isLastQuestion={currentQuestionIndex === currentQuizData.questions.length - 1}
        isAnswerSubmitted={isAnswerSubmitted}
        hasSelectedOption={!!selectedOption}
        onSubmitAnswer={handleSubmitAnswer}
        onNextQuestion={handleNextQuestion}
        onFinishQuiz={handleFinishQuiz}
      />
    </div>
  );
};

export default QuizMCQ;
