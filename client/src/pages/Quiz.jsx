import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

// Mock quiz data
const quizzes = {
  '1': {
    topicName: 'JavaScript Fundamentals',
    questions: [
      {
        id: '1',
        question: 'Which of the following is NOT a JavaScript data type?',
        options: [
          { id: 'a', text: 'String' },
          { id: 'b', text: 'Boolean' },
          { id: 'c', text: 'Float' },
          { id: 'd', text: 'Object' }
        ],
        correctAnswer: 'c'
      },
      {
        id: '2',
        question: 'What does the "===" operator do in JavaScript?',
        options: [
          { id: 'a', text: 'Assigns a value to a variable' },
          { id: 'b', text: 'Compares values and types' },
          { id: 'c', text: 'Compares only values' },
          { id: 'd', text: 'Logical OR operation' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '3',
        question: 'Which method is used to add an element to the end of an array?',
        options: [
          { id: 'a', text: 'push()' },
          { id: 'b', text: 'pop()' },
          { id: 'c', text: 'shift()' },
          { id: 'd', text: 'unshift()' }
        ],
        correctAnswer: 'a'
      }
    ]
  },
  '2': {
    topicName: 'React Basics',
    questions: [
      {
        id: '1',
        question: 'What is JSX in React?',
        options: [
          { id: 'a', text: 'JavaScript XML - A syntax extension for JavaScript' },
          { id: 'b', text: 'A JavaScript library for building user interfaces' },
          { id: 'c', text: 'JavaScript Extra - A new version of JavaScript' },
          { id: 'd', text: 'A database query language' }
        ],
        correctAnswer: 'a'
      },
      {
        id: '2',
        question: 'Which hook is used to add state to a functional component?',
        options: [
          { id: 'a', text: 'useEffect' },
          { id: 'b', text: 'useState' },
          { id: 'c', text: 'useContext' },
          { id: 'd', text: 'useReducer' }
        ],
        correctAnswer: 'b'
      },
      {
        id: '3',
        question: 'What is the correct way to render a list in React?',
        options: [
          { id: 'a', text: 'Using a for loop inside the render method' },
          { id: 'b', text: 'Using the map() function on an array' },
          { id: 'c', text: 'Using the forEach() method' },
          { id: 'd', text: 'Using a while loop' }
        ],
        correctAnswer: 'b'
      }
    ]
  }
};

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuizData, setCurrentQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    if (topicId && quizzes[topicId ]) {
      setCurrentQuizData(quizzes[topicId ]);
    } else {
      // Handle invalid topic ID
      navigate('/dashboard');
    }
  }, [topicId, navigate]);
  
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
  
  const handleOptionSelect = (optionId) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionId);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption) {
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      
      // Update user answers
      setUserAnswers(
        ...userAnswers,
        [currentQuestion.id]
      );
      
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
    // In a real app, this would send the quiz results to the server
    // and generate a learning path based on the results
    navigate('/learning-path');
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
        
        <div className="text-center">
          <p className="text-gray-700 mb-6">
            {scorePercentage >= 70 
              ? "Great job! We'll create a personalized learning path based on your results."
              : "Let's focus on improving your knowledge. We'll create a personalized learning path to help you master this topic."}
          </p>
          <button
            onClick={handleFinishQuiz}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            View Your Learning Path
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">{currentQuizData.topicName}</h2>
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {currentQuizData.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <div 
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === option.id 
                  ? isAnswerSubmitted
                    ? option.id === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedOption === option.id 
                    ? isAnswerSubmitted
                      ? option.id === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-300'
                }`}>
                  {selectedOption === option.id && (
                    isAnswerSubmitted ? (
                      option.id === currentQuestion.correctAnswer ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <XCircle className="h-4 w-4 text-white" />
                      )
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )
                  )}
                </div>
                <span className={`${
                  isAnswerSubmitted && option.id === currentQuestion.correctAnswer
                    ? 'font-medium text-green-700'
                    : ''
                }`}>
                  {option.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
            className={`px-6 py-2 rounded-md font-medium ${
              selectedOption
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center"
          >
            {currentQuestionIndex < currentQuizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
