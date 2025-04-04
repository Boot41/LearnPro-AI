import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

// Function to parse quiz data into required format
const parseQuizData = (rawQuizData) => {
  if (!rawQuizData) return null;
  
  return {
    topicName: rawQuizData.topic_name || rawQuizData.projectName || 'Skill Assessment',
    questions: rawQuizData.questions.map((q, index) => {
      // First create the options array
      const options = q.options.map((opt, optIndex) => ({
        id: opt.id || String.fromCharCode(97 + optIndex), // Convert 0,1,2,3 to a,b,c,d
        text: opt.text || opt
      }));
      
      // Find the option ID that matches the correct answer text
      const correctAnswerText = q.correct_answer || q.correctAnswer;
      const correctOption = options.find(opt => opt.text === correctAnswerText);
      const correctAnswerId = correctOption ? correctOption.id : options[0].id;
      
      return {
        id: q.id || String(index + 1),
        question: q.question,
        options,
        correctAnswer: correctAnswerId,
        topic: q.topic || 'General',
        points: q.points || 10
      };
    })
  };
};

// Calculate topic-wise scores from quiz results
const calculateTopicScores = (questions, userAnswers) => {
  const topicScores = {};
  const topicTotals = {};
  
  questions.forEach(question => {
    const topic = question.topic;
    const points = question.points;
    
    // Initialize topic scores if not exists
    if (!topicScores[topic]) {
      topicScores[topic] = 0;
      topicTotals[topic] = 0;
    }
    
    // Add points to total possible points for this topic
    topicTotals[topic] += points;
    
    // Add points to score if answer is correct
    if (userAnswers[question.id] === question.correctAnswer) {
      topicScores[topic] += points;
    }
  });
  
  // Calculate percentages for each topic
  const topicPercentages = {};
  Object.keys(topicScores).forEach(topic => {
    topicPercentages[topic] = {
      score: topicScores[topic],
      total: topicTotals[topic],
      percentage: Math.round((topicScores[topic] / topicTotals[topic]) * 100)
    };
  });
  
  return topicPercentages;
};

const Quiz = ({ quizData, onComplete, isSkillAssessment = false }) => {
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
    if (quizData) {
      const parsedData = parseQuizData(quizData);
      console.log(parsedData)
      setCurrentQuizData(parsedData);
    } else {
      navigate('/dashboard');
    }
  }, [quizData, navigate]);
  
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
      setUserAnswers((prevUserAnswers) => ({ ...prevUserAnswers, [currentQuestion.id]: selectedOption }));
      
      // Update score if correct
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
      
      setIsAnswerSubmitted(true);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };
  
  const handleFinishQuiz = () => {
    console.log(userAnswers)
    if (onComplete) {
      // Calculate topic-wise scores before submitting
      const topicScores = calculateTopicScores(currentQuizData.questions, userAnswers);
      console.log(userAnswers,topicScores)
      onComplete({ answers: userAnswers, topicScores });
    } else {
      navigate('/learning-path');
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / currentQuizData.questions.length) * 100;
  
  if (quizCompleted) {
    const totalQuestions = currentQuizData.questions.length;
    const scorePercentage = (score / totalQuestions) * 100;
    let ctaMessage     
    if (isSkillAssessment ) {
      if (scorePercentage >= 70) {
        ctaMessage = "Great job! We'll create a personalized learning path based on your results.";
      } else {
        ctaMessage = "Let's focus on improving your knowledge. We'll create a personalized learning path to help you master this topic.";
      }    
    }
    else {
      if (scorePercentage >= 70) {
        ctaMessage = "You've done great! Keep up the good work.";
      } else {
        ctaMessage = "You're making progress! Consider reviewing to strengthen your understanding.";
      }
    }

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
            {ctaMessage}
          </p>
          <button
            onClick={handleFinishQuiz}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            {isSkillAssessment ? 'View Your Learning Path' : 'Go Back to Learning Path'}
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
              <div className="flex">
                <div className="flex-shrink-0 my-auto">
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
                </div>
                <span className={`flex-1 ${
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
