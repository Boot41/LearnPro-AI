import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import smaller components
import QuizTimer from '../components/quiz/QuizTimer';
import QuizProgressBar from '../components/quiz/QuizProgressBar';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizActions from '../components/quiz/QuizActions';
import QuizResult from '../components/quiz/QuizResult';
import QuizNotFound from '../components/quiz/QuizNotFound';

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

const QuizMCQ = () => {
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
    return <QuizNotFound />;
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
  
  if (quizCompleted) {
    return (
      <QuizResult
        score={score}
        totalQuestions={currentQuizData.questions.length}
        questions={currentQuizData.questions}
        userAnswers={userAnswers}
        onBackToDashboard={() => navigate('/dashboard')}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{currentQuizData.topicName}</h2>
        <QuizTimer timeRemaining={timeRemaining} />
      </div>
      
      {/* Progress bar */}
      <QuizProgressBar 
        currentQuestion={currentQuestionIndex} 
        totalQuestions={currentQuizData.questions.length} 
      />
      
      {/* Question */}
      <QuizQuestion
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedOption={selectedOption}
        isAnswerSubmitted={isAnswerSubmitted}
        correctAnswer={currentQuestion.correctAnswer}
        onSelectOption={handleOptionSelect}
      />
      
      {/* Actions */}
      <QuizActions
        isAnswerSubmitted={isAnswerSubmitted}
        selectedOption={selectedOption}
        onSubmitAnswer={handleSubmitAnswer}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentQuestionIndex === currentQuizData.questions.length - 1}
      />
    </div>
  );
};

export default QuizMCQ;
