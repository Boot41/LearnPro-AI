import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizQuestion = ({ 
  question, 
  options, 
  selectedOption, 
  isAnswerSubmitted, 
  correctAnswer, 
  onSelectOption 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{question}</h3>
      
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            disabled={isAnswerSubmitted}
            className={`w-full text-left p-4 rounded-lg border ${
              selectedOption === option.id && isAnswerSubmitted && option.id === correctAnswer
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
              
              {isAnswerSubmitted && option.id === correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
              )}
              {isAnswerSubmitted && selectedOption === option.id && option.id !== correctAnswer && (
                <XCircle className="h-5 w-5 text-red-600 ml-auto" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
