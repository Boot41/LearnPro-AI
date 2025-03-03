import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizResult = ({ score, totalQuestions, questions, userAnswers, onBackToDashboard }) => {
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
        
        {questions.map((question, index) => {
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
          onClick={onBackToDashboard}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
