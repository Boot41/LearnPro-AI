import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, Clock } from 'lucide-react';

// Mock MCQ quiz data
const mcqQuizzes = {
  '1': {
    topicName: 'JavaScript Fundamentals MCQ',
    timeLimit: 10, // minutes
    questions: [
      {
        id: '1',
        question: 'Which of the following is a primitive data type in JavaScript?',
        options: [
          { id: 'a', text: 'Array' },
          { id: 'b', text: 'Object' },
          { id: 'c', text: 'String' },
          { id: 'd', text: 'Function' }
        ],
        correctAnswer: 'c'
      },
      {
        id: '2',
        question: 'What is the output of: console.log(2 + "2")?',
        options: [
          { id: 'a', text: '4' },
          { id: 'b', text: '22' },
          { id: 'c', text: 'Error' },
          { id: 'd', text: 'undefined' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '3',
        question: 'Which method is used to serialize an object into a JSON string?',
        options: [
          { id: 'a', text: 'JSON.stringify()' },
          { id: 'b', text: 'JSON.parse()' },
          { id: 'c', text: 'JSON.toText()' },
          { id: 'd', text: 'JSON.serialize()' }
        ],
        correctAnswer: 'a'
      },
      {
        id: '4',
        question: 'What does the "use strict" directive do in JavaScript?',
        options: [
          { id: 'a', text: 'Enforces stricter parsing and error handling' },
          { id: 'b', text: 'Makes the code run faster' },
          { id: 'c', text: 'Allows the use of experimental features' },
          { id: 'd', text: 'Prevents the use of functions' }
        ],
        correctAnswer: 'a'
      }
    ]
  },
  '2': {
    topicName: 'React Basics MCQ',
    timeLimit: 10, // minutes
    questions: [
      {
        id: '1',
        question: 'What is React?',
        options: [
          { id: 'a', text: 'A JavaScript library for building user interfaces' },
          { id: 'b', text: 'A programming language' },
          { id: 'c', text: 'A database management system' },
          { id: 'd', text: 'A server-side framework' }
        ],
        correctAnswer: 'a'
      },
      {
        id: '2',
        question: 'What is the virtual DOM in React?',
        options: [
          { id: 'a', text: 'A direct copy of the real DOM' },
          { id: 'b', text: 'A lightweight JavaScript representation of the DOM' },
          { id: 'c', text: 'A browser extension for React' },
          { id: 'd', text: 'A debugging tool' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '3',
        question: 'Which of the following is NOT a React hook?',
        options: [
          { id: 'a', text: 'useState' },
          { id: 'b', text: 'useEffect' },
          { id: 'c', text: 'useComponent' },
          { id: 'd', text: 'useContext' }
        ],
        correctAnswer: 'c'
      },
      {
        id: '4',
        question: 'What is the purpose of React fragments?',
        options: [
          { id: 'a', text: 'To split code into multiple files' },
          { id: 'b', text: 'To group a list of children without adding extra nodes to the DOM' },
          { id: 'c', text: 'To create reusable components' },
          { id: 'd', text: 'To optimize rendering performance' }
        ],
        correctAnswer: 'b'
      }
    ]
  }
};

const QuizMCQ= () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuizData, setCurrentQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  useEffect(() => {
    if (topicId && mcqQuizzes[topicId]) {
      const quizData = mcqQuizzes[topicId];
      setCurrentQuizData(quizData);
      setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
    } else {
      // Handle invalid topic ID
      navigate('/dashboard');
    }
  }, [topicId, navigate]);
  
  // Timer effect
  useEffect(() => {
    if (!currentQuizData || quizCompleted) return;
    
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
  }, [currentQuizData, quizCompleted]);
  
  if (!currentQuizData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <HelpCircle className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Quiz not found</h2>
          <p className="text-gray-500 mt-2">The requested quiz could not be loaded.</p>
        </div>
      </div>
    );
  }
  
  const currentQuestion = currentQuizData.questions[currentQuestionIndex];
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
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
      
      // Update score if correct
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }
      
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
      setQuizCompleted(true);
    }
  };
  
  const handleFinishQuiz = () => {
    // Calculate final score
    let finalScore = 0;
    
    Object.keys(userAnswers).forEach(questionId => {
      const question = currentQuizData.questions.find((q) => q.id === questionId);
      if (question && userAnswers[questionId] === question.correctAnswer) {
        finalScore++;
      }
    });
    
    setScore(finalScore);
    setQuizCompleted(true);
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / currentQuizData.questions.length) * 100;
  
  if (quizCompleted) {
    const totalQuestions = currentQuizData.questions.length;
    const scorePercentage = (score / totalQuestions) * 100;
    
    return (
      <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${
            scorePercentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <span className={`text-3xl font-bold ${
              scorePercentage >= 70 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {score}/{totalQuestions}
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-4">Quiz Completed!</h2>
          <p className="text-gray-600 mt-2">
            You scored {score} out of {totalQuestions} questions correctly.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                scorePercentage >= 70 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0%</span>
            <span>Score: {Math.round(scorePercentage)}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Question Summary</h3>
          
          {currentQuizData.questions.map((question, index) => {
            const userAnswer = userAnswers[question.id] || '';
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mt-1`}>
                    {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">
                      {index + 1}. {question.question}
                    </p>
                    <div className="mt-2 space-y-1">
                      {question.options.map((option) => (
                        <div 
                          key={option.id}
                          className={`text-sm px-3 py-1 rounded ${
                            option.id === question.correctAnswer ? 'bg-green-100 text-green-800' : 
                            option.id === userAnswer && option.id !== question.correctAnswer ? 'bg-red-100 text-red-800' : 
                            'text-gray-600'
                          }`}
                        >
                          {option.id}. {option.text}
                          {option.id === question.correctAnswer && ' (Correct)'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{currentQuizData.topicName}</h2>
        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-1" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Question {currentQuestionIndex + 1} of {currentQuizData.questions.length}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
      </div>
      
      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={isAnswerSubmitted}
              className={`w-full text-left p-4 rounded-lg border ${
                selectedOption === option.id && isAnswerSubmitted && option.id === currentQuestion.correctAnswer
                  ? 'bg-green-100 border-green-300'
                : selectedOption === option.id && isAnswerSubmitted
                  ? 'bg-red-100 border-red-300'
                : selectedOption === option.id
                  ? 'bg-indigo-100 border-indigo-300'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${
                  selectedOption === option.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                } mr-3`}>
                  {selectedOption === option.id && (
                    <span className="flex items-center justify-center h-full w-full">
                      <span className="h-2 w-2 rounded-full bg-white"></span>
                    </span>
                  )}
                </div>
                <span>{option.text}</span>
                
                {isAnswerSubmitted && option.id === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                )}
                {isAnswerSubmitted && selectedOption === option.id && option.id !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between items-center">
        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
            className={`px-6 py-2 rounded-md ${
              selectedOption
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {currentQuestionIndex < currentQuizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizMCQ;
